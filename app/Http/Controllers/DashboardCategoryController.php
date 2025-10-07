<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class DashboardCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Category::query();

        // Search functionality
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Sort functionality
        $sortBy = $request->get('sort', 'name');
        $sortDirection = $request->get('direction', 'asc');
        
        if (in_array($sortBy, ['name', 'created_at'])) {
            $query->orderBy($sortBy, $sortDirection);
        }

        $categories = $query->withCount('courses')->paginate(15)->withQueryString();

        return Inertia::render('Dashboard/Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Dashboard/Categories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        Category::create($validated);

        return redirect()->route('dashboard.categories.index')
            ->with('success', 'Category created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category): Response
    {
        $category->load(['courses' => function ($query) {
            $query->with(['category', 'tags'])->latest()->take(10);
        }]);

        return Inertia::render('Dashboard/Categories/Show', [
            'category' => $category,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category): Response
    {
        return Inertia::render('Dashboard/Categories/Edit', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $category->update($validated);

        return redirect()->route('dashboard.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category): RedirectResponse
    {
        // Check if category has associated courses
        if ($category->courses()->count() > 0) {
            return redirect()->route('dashboard.categories.index')
                ->with('error', 'Cannot delete category that has associated courses.');
        }

        $category->delete();

        return redirect()->route('dashboard.categories.index')
            ->with('success', 'Category deleted successfully.');
    }

    /**
     * Remove multiple categories from storage.
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:categories,id',
        ]);

        $categories = Category::whereIn('id', $validated['ids'])->get();
        
        // Check if any categories have associated courses
        $categoriesWithCourses = $categories->filter(function ($category) {
            return $category->courses()->count() > 0;
        });

        if ($categoriesWithCourses->count() > 0) {
            return redirect()->route('dashboard.categories.index')
                ->with('error', 'Cannot delete categories that have associated courses.');
        }

        Category::whereIn('id', $validated['ids'])->delete();

        return redirect()->route('dashboard.categories.index')
            ->with('success', count($validated['ids']) . ' categories deleted successfully.');
    }
}