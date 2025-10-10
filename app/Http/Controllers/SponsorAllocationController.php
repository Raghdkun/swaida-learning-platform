<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Sponsor;
use App\Models\SponsorAllocation;
use App\Models\SponsorTransaction;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class SponsorAllocationController extends Controller
{
    /**
     * Store a new allocation (deducts sponsor current_amount).
     */
    public function store(Request $request, Sponsor $sponsor): RedirectResponse
    {
        $validated = $request->validate([
            'recipient_full_name' => ['required', 'string', 'max:255'],
            'course_id'           => ['nullable', Rule::exists('courses', 'id')],
            'course_external_url' => ['nullable', 'url', 'max:2048'],
            'amount'              => ['required', 'numeric', 'min:0.01', 'max:9999999999.99'],
            'admin_note'          => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($sponsor, $validated) {
            // Balance check (you can relax this if overdraft allowed)
            if ((float)$sponsor->current_amount < (float)$validated['amount']) {
                abort(422, 'Insufficient sponsor balance.');
            }

            $allocation = SponsorAllocation::create([
                'sponsor_id'         => $sponsor->id,
                'recipient_full_name'=> $validated['recipient_full_name'],
                'course_id'          => $validated['course_id'] ?? null,
                'course_external_url'=> $validated['course_external_url'] ?? null,
                'amount'             => $validated['amount'],
                'admin_note'         => $validated['admin_note'] ?? null,
            ]);

            // Deduct from sponsor balance
            $sponsor->decrement('current_amount', $validated['amount']);

            // (Optional) You can log a transaction for audit: a "adjustment" negative is represented as
            // a refund elsewhere, so here we just skip and rely on allocation record itself.
            // If you prefer symmetry, create another table for outflows; for now we keep it simple.
        });

        return back()->with('success', 'Allocation created.');
    }

    /**
     * Update an allocation (adjust sponsor balance by delta).
     */
    public function update(Request $request, Sponsor $sponsor, SponsorAllocation $allocation): RedirectResponse
    {
        if ($allocation->sponsor_id !== $sponsor->id) {
            abort(404);
        }

        $validated = $request->validate([
            'recipient_full_name' => ['required', 'string', 'max:255'],
            'course_id'           => ['nullable', Rule::exists('courses', 'id')],
            'course_external_url' => ['nullable', 'url', 'max:2048'],
            'amount'              => ['required', 'numeric', 'min:0.01', 'max:9999999999.99'],
            'admin_note'          => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($sponsor, $allocation, $validated) {
            $old = (float)$allocation->amount;
            $new = (float)$validated['amount'];
            $delta = $new - $old; // positive => need extra funds; negative => refund back to sponsor

            // If delta > 0, ensure balance
            if ($delta > 0 && (float)$sponsor->current_amount < $delta) {
                abort(422, 'Insufficient sponsor balance for this increase.');
            }

            $allocation->update([
                'recipient_full_name' => $validated['recipient_full_name'],
                'course_id'           => $validated['course_id'] ?? null,
                'course_external_url' => $validated['course_external_url'] ?? null,
                'amount'              => $new,
                'admin_note'          => $validated['admin_note'] ?? null,
            ]);

            // Adjust sponsor
            if ($delta > 0) {
                $sponsor->decrement('current_amount', $delta);
            } elseif ($delta < 0) {
                $sponsor->increment('current_amount', abs($delta));

                // log refund
                SponsorTransaction::create([
                    'sponsor_id' => $sponsor->id,
                    'type'       => 'refund',
                    'amount'     => abs($delta),
                    'reference'  => "Allocation #{$allocation->id} decrease",
                    'notes'      => 'Refund from allocation edit',
                ]);
            }
        });

        return back()->with('success', 'Allocation updated.');
    }

    /**
     * Delete allocation (refund full amount back to sponsor).
     */
    public function destroy(Sponsor $sponsor, SponsorAllocation $allocation): RedirectResponse
    {
        if ($allocation->sponsor_id !== $sponsor->id) {
            abort(404);
        }

        DB::transaction(function () use ($sponsor, $allocation) {
            $refund = (float)$allocation->amount;

            // Refund balance
            $sponsor->increment('current_amount', $refund);

            // Log refund
            SponsorTransaction::create([
                'sponsor_id' => $sponsor->id,
                'type'       => 'refund',
                'amount'     => $refund,
                'reference'  => "Allocation #{$allocation->id} deleted",
                'notes'      => 'Refund due to allocation deletion',
            ]);

            $allocation->delete();
        });

        return back()->with('success', 'Allocation deleted and amount refunded.');
    }
}
