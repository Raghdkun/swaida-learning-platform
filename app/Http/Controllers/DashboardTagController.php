<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class DashboardTagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Tag::query()->with('translations');

        // Search by base (English) name, and current-locale translations
        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $locale = app()->getLocale();

            $query->where(function ($q) use ($search, $locale) {
                $q->where('name', 'like', '%' . $search . '%');

                if ($locale !== 'en') {
                    $q->orWhereHas('translations', function ($t) use ($search, $locale) {
                        $t->where('locale', $locale)
                          ->where('field', 'name')
                          ->where('value', 'like', '%' . $search . '%');
                    });
                }
            });
        }

        // Sort
        $sortBy = $request->get('sort', 'name');
        $direction = $request->get('direction', 'asc');
        if (in_array($sortBy, ['name', 'created_at'])) {
            $query->orderBy($sortBy, $direction);
        } else {
            $query->orderBy('name');
        }

        $tags = $query->withCount('courses')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Dashboard/Tags/Index', [
            'tags' => $tags,
            'filters' => [
                'search' => $request->get('search'),
                'sort' => $sortBy,
                'direction' => $direction,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Dashboard/Tags/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required','string','max:255','unique:tags,name'],
            'name_ar' => ['nullable','string','max:255'], // Arabic optional
            'slug' => ['nullable','string','max:255','unique:tags,slug'],
        ]);

        $slug = $validated['slug'] ?? Str::slug($validated['name']);

        $tag = Tag::create([
            'name' => $validated['name'], // English base
            'slug' => $slug,
        ]);

        // Save Arabic translation if provided
        if ($request->filled('name_ar')) {
            $tag->setTranslated('name', 'ar', $request->string('name_ar')->toString());
        }

        return redirect()
            ->route('dashboard.tags.index')
            ->with('success', 'Tag created successfully.');
    }
public function show(Tag $tag): Response
{
    $tag->load([
        'translations',
        'courses' => fn($q) => $q->with(['category', 'tags'])->latest()->take(10),
        'courses.category.translations',
        'courses.tags.translations',
    ]);

    $nameAr = optional(
        $tag->translations->where('field','name')->where('locale','ar')->first()
    )->value;

    $nameEn = $tag->getRawOriginal('name');
    return Inertia::render('Dashboard/Tags/Show', [
        'tag' => [
            'id' => $tag->id,
            'name' => $nameEn,     // localized for current locale
            'slug' => $tag->slug,
            'courses_count' => $tag->courses()->count(),

            'name_en' => $nameEn,
            'name_ar' => $nameAr,

            // Only translations that belong to the Tag itself (already true) and expose explicitly
            'translations' => $tag->translations
                ->where('field', 'name')
                ->map(fn($t) => [
                    'locale' => $t->locale,
                    'field'  => $t->field,
                    'value'  => $t->value,
                ])
                ->values(),

            'courses' => $tag->courses->map(fn($c) => [
                'id' => $c->id,
                'title' => $c->title, // localized by accessor
                'level' => $c->level,
                'category' => [
                    'id' => $c->category?->id,
                    'name' => $c->category?->name, // localized
                ],
            ])->values(),
        ],
    ]);
}


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tag $tag): Response
    {
        $tag->load('translations');
$nameAr = optional(
        $tag->translations
            ->where('field', 'name')
            ->where('locale', 'ar')
            ->first()
    )->value;
        return Inertia::render('Dashboard/Tags/Edit', [
            'tag' => [
                'id' => $tag->id,
                'name' => $tag->name, // Will auto-localize via accessor override
                'slug' => $tag->slug,
                'courses_count' => $tag->courses()->count(),
                'name_ar' => $nameAr, // ← ADDED
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tag $tag): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required','string','max:255','unique:tags,name,' . $tag->id],
            'name_ar' => ['nullable','string','max:255'], // Arabic optional
            'slug' => ['nullable','string','max:255','unique:tags,slug,' . $tag->id],
        ]);

        $slug = $validated['slug'] ?? Str::slug($validated['name']);

        // Update base English
        $tag->update([
            'name' => $validated['name'],
            'slug' => $slug,
        ]);

        // Update Arabic translation (creates/updates/deletes)
        if ($request->has('name_ar')) {
            $value = $request->string('name_ar')->toString();
            $tag->setTranslated('name', 'ar', $value !== '' ? $value : null);
        }

        return redirect()
            ->route('dashboard.tags.index')
            ->with('success', 'Tag updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tag $tag): RedirectResponse
    {
        $tag->translations()->delete();
        $tag->delete();

        return redirect()
            ->route('dashboard.tags.index')
            ->with('success', 'Tag deleted successfully.');
    }
}
