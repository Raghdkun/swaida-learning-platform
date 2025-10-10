<?php

namespace App\Http\Controllers;

use App\Models\Sponsor;
use App\Models\SponsorTransaction;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;

class SponsorController extends Controller
{
    /**
     * List sponsors with search/sort.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->get('search', ''));
        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');

        $query = Sponsor::query()
            ->when($search, function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });

        $allowedSorts = ['full_name', 'email', 'current_amount', 'created_at', 'updated_at'];
        if (!in_array($sort, $allowedSorts, true)) {
            $sort = 'created_at';
        }
        $direction = $direction === 'asc' ? 'asc' : 'desc';

        $sponsors = $query->orderBy($sort, $direction)
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Dashboard/Sponsors/Index', [
            'sponsors' => $sponsors,
            'filters' => $request->only(['search', 'sort', 'direction']),
        ]);
    }

    /**
     * Create form.
     */
    public function create(): Response
    {
        return Inertia::render('Dashboard/Sponsors/Create');
    }

    /**
     * Store sponsor (initial + current).
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'full_name'       => ['required','string','max:255'],
            'phone'           => ['nullable','string','max:50'],
            'email'           => ['required','email','max:255', 'unique:sponsors,email'],
            'initial_amount'  => ['required','numeric','min:0'],
            'current_amount'  => ['required','numeric','min:0'],
            'password'        => ['required', 'confirmed', Password::min(8)->letters()->numbers()->mixedCase()],
            'require_change'  => ['sometimes','boolean'],
        ]);

        DB::transaction(function () use ($validated) {
            /** @var Sponsor $sponsor */
            $sponsor = Sponsor::create([
            'full_name'            => $validated['full_name'],
            'phone'                => $validated['phone'] ?? null,
            'email'                => $validated['email'],
            'initial_amount'       => $validated['initial_amount'],
            'current_amount'       => $validated['current_amount'],
            'password'             => $validated['password'],
            'must_change_password' => $request->boolean('require_change', true), // default force change
        ]);

            // Log initial top_up for audit trail
            SponsorTransaction::create([
                'sponsor_id' => $sponsor->id,
                'type'       => 'top_up',
                'amount'     => $validated['initial_amount'],
                'reference'  => 'Initial funding',
                'notes'      => 'Initial amount on sponsor creation',
            ]);
        });

        return redirect()->route('dashboard.sponsors.index')->with('success', 'Sponsor created.');
    }

    /**
     * Show a sponsor with allocations and transactions.
     */
    public function show(Sponsor $sponsor): Response
    {
        $sponsor->load([
            'allocations' => function ($q) {
                $q->with('course:id,title')
                    ->latest();
            },
            'transactions' => function ($q) {
                $q->latest();
            },
        ]);

        return Inertia::render('Dashboard/Sponsors/Show', [
            'sponsor' => $sponsor,
        ]);
    }

    /**
     * Edit form.
     */
    public function edit(Sponsor $sponsor): Response
    {
        return Inertia::render('Dashboard/Sponsors/Edit', [
            'sponsor' => $sponsor,
        ]);
    }

    /**
     * Update basic info ONLY (not balances).
     */
    public function update(Request $request, Sponsor $sponsor): RedirectResponse
    {
        $validated = $request->validate([
            'full_name'       => ['sometimes','required','string','max:255'],
            'phone'           => ['nullable','string','max:50'],
            'email'           => ['sometimes','required','email','max:255', Rule::unique('sponsors','email')->ignore($sponsor->id)],
            'initial_amount'  => ['sometimes','required','numeric','min:0'],
            'current_amount'  => ['sometimes','required','numeric','min:0'],
            // optional password reset by admin
            'password'        => ['nullable','confirmed', Password::min(8)->letters()->numbers()->mixedCase()],
            'require_change'  => ['sometimes','boolean'],
        ]);
        $payload = collect($validated)->except('password','require_change')->toArray();

        if (!empty($validated['password'])) {
            $payload['password'] = $validated['password'];
            // admin can decide to require change on next login
            $payload['must_change_password'] = $request->boolean('require_change', false);
            // reset changed_at if forcing change
            if ($payload['must_change_password']) {
                $payload['password_changed_at'] = null;
            } else {
                $payload['password_changed_at'] = now();
            }
        } elseif ($request->has('require_change')) {
            $payload['must_change_password'] = $request->boolean('require_change');
            if ($payload['must_change_password']) {
                $payload['password_changed_at'] = null;
            }
        }

        $sponsor->update($payload);

        return redirect()->route('dashboard.sponsors.show', $sponsor)->with('success', 'Sponsor updated.');
    }

    /**
     * Top-up or manual adjustment (positive amount only).
     * - type: top_up|adjustment
     */
    public function addFunds(Request $request, Sponsor $sponsor): RedirectResponse
    {
        $validated = $request->validate([
            'type'      => ['required', Rule::in(['top_up', 'adjustment'])],
            'amount'    => ['required', 'numeric', 'min:0.01', 'max:9999999999.99'],
            'reference' => ['nullable', 'string', 'max:255'],
            'notes'     => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($sponsor, $validated) {
            $sponsor->increment('current_amount', $validated['amount']);

            SponsorTransaction::create([
                'sponsor_id' => $sponsor->id,
                'type'       => $validated['type'],
                'amount'     => $validated['amount'],
                'reference'  => $validated['reference'] ?? null,
                'notes'      => $validated['notes'] ?? null,
            ]);
        });

        return back()->with('success', 'Funds added.');
    }

    /**
     * Delete sponsor (soft delete).
     */
    public function destroy(Sponsor $sponsor): RedirectResponse
    {
        $sponsor->delete();

        return redirect()->route('dashboard.sponsors.index')->with('success', 'Sponsor deleted.');
    }
}
