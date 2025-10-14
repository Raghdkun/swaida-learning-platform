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
        'name_ar' => 'nullable|string|max:255', // ← ADDED
    ]);

    $validated['slug'] = Str::slug($validated['name']);

    $category = Category::create($validated);
    
    // ← ADDED
    if ($request->filled('name_ar')) {
        $category->setTranslated('name', 'ar', $request->string('name_ar')->toString());
    }

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
$category->load('translations', 'courses.tags');
    $nameEn = $category->getRawOriginal('name');

       return Inertia::render('Dashboard/Categories/Show', [
    'category' => [
        'id' => $category->id,
        'name' => $nameEn,       // localized by accessor
        'slug' => $category->slug,
        'courses_count' => $category->courses()->count(),
        'courses' => $category->courses->map(fn ($c) => [
            'id' => $c->id,
            'title' => $c->title,        // localized by accessor
            'level' => $c->level,        // canonical or localized based on your model setup
            'tags'  => $c->tags->map(fn ($t) => ['id' => $t->id, 'name' => $t->name]), // localized
        ]),
        'translations' => $category->translations->map(fn ($t) => [
            'locale' => $t->locale,
            'field'  => $t->field,
            'value'  => $t->value,
        ]),
    ],
]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category): Response
{
    // Load translations to extract Arabic
    $category->load('translations');

    $nameAr = optional(
        $category->translations
            ->where('field', 'name')
            ->where('locale', 'ar')
            ->first()
    )->value;

    return Inertia::render('Dashboard/Categories/Edit', [
        'category' => [
            'id' => $category->id,
            'name' => $category->name, // localized for current locale
            'slug' => $category->slug,
            'courses_count' => $category->courses()->count(),
            'name_ar' => $nameAr, // ← add this
            // You can also pass all translations if you want:
            // 'translations' => $category->translations->map(fn ($t) => [
            //   'locale' => $t->locale, 'field' => $t->field, 'value' => $t->value
            // ]),
        ],
    ]);
}

    /**
     * Update the specified resource in storage.
     */
public function update(Request $request, Category $category): RedirectResponse
{
    $validated = $request->validate([
        'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        'name_ar' => 'nullable|string|max:255', // ← ADDED
    ]);

    $validated['slug'] = Str::slug($validated['name']);

    $category->update($validated);
    
    // ← ADDED
    if ($request->has('name_ar')) {
        $category->setTranslated('name', 'ar', $request->string('name_ar')->toString() ?: null);
    }

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