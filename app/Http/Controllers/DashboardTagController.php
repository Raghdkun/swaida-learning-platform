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
        $query = Tag::query();

        // Search functionality
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Sort functionality
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        
        if (in_array($sortBy, ['name', 'created_at'])) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $tags = $query->withCount('courses')->paginate(15)->withQueryString();

        return Inertia::render('Dashboard/Tags/Index', [
            'tags' => $tags,
            'filters' => $request->only(['search', 'sort_by', 'sort_order']),
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
            'name' => 'required|string|max:255|unique:tags,name',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        Tag::create($validated);

        return redirect()->route('dashboard.tags.index')
            ->with('success', 'Tag created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Tag $tag): Response
    {
        $tag->load(['courses' => function ($query) {
            $query->with(['category', 'tags'])->latest()->take(10);
        }]);

        return Inertia::render('Dashboard/Tags/Show', [
            'tag' => $tag,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tag $tag): Response
    {
        return Inertia::render('Dashboard/Tags/Edit', [
            'tag' => $tag,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tag $tag): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tags,name,' . $tag->id,
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $tag->update($validated);

        return redirect()->route('dashboard.tags.index')
            ->with('success', 'Tag updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tag $tag): RedirectResponse
    {
        // Check if tag has associated courses
        if ($tag->courses()->count() > 0) {
            return redirect()->route('dashboard.tags.index')
                ->with('error', 'Cannot delete tag that has associated courses.');
        }

        $tag->delete();

        return redirect()->route('dashboard.tags.index')
            ->with('success', 'Tag deleted successfully.');
    }

    /**
     * Remove multiple tags from storage.
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:tags,id',
        ]);

        $tags = Tag::whereIn('id', $validated['ids'])->get();
        
        // Check if any tags have associated courses
        $tagsWithCourses = $tags->filter(function ($tag) {
            return $tag->courses()->count() > 0;
        });

        if ($tagsWithCourses->count() > 0) {
            return redirect()->route('dashboard.tags.index')
                ->with('error', 'Cannot delete tags that have associated courses.');
        }

        Tag::whereIn('id', $validated['ids'])->delete();

        return redirect()->route('dashboard.tags.index')
            ->with('success', count($validated['ids']) . ' tags deleted successfully.');
    }
}