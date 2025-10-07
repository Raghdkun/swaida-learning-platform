<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

class DashboardCourseController extends Controller
{
    /**
     * Display a listing of courses for dashboard
     */
    public function index(Request $request): Response
    {
        $query = Course::with(['category', 'tags']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('platform', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category_id', $request->get('category'));
        }

        // Filter by level
        if ($request->filled('level')) {
            $query->where('level', $request->get('level'));
        }

        // Filter by type (free/paid)
        if ($request->filled('type')) {
            $type = $request->get('type');
            if ($type === 'free') {
                $query->whereNull('price')->orWhere('price', '<=', 0);
            } elseif ($type === 'paid') {
                $query->whereNotNull('price')->where('price', '>', 0);
            }
        }

        // Sort functionality
        $sortBy = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        
        $allowedSorts = ['title', 'created_at', 'updated_at', 'level', 'platform'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDirection);
        }

        $courses = $query->paginate(15)->withQueryString();

        // Get filter options
        $categories = Category::orderBy('name')->get();
        $levels = Course::distinct()->pluck('level')->filter()->sort()->values();

        return Inertia::render('Dashboard/Courses/Index', [
            'courses' => $courses,
            'categories' => $categories,
            'levels' => $levels,
            'filters' => $request->only(['search', 'category', 'level', 'type', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new course
     */
    public function create(): Response
    {
        $categories = Category::orderBy('name')->get();
        $tags = Tag::orderBy('name')->get();

        return Inertia::render('Dashboard/Courses/Create', [
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created course
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'external_url' => 'required|url',
            'duration' => 'nullable|string|max:100',
            'platform' => 'required|string|max:100',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'category_id' => 'required|exists:categories,id',
            'level' => 'required|in:beginner,intermediate,advanced',
            'have_cert' => 'boolean',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id',
            'price' => 'nullable|numeric|min:0',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('courses', 'public');
            $validated['image'] = $imagePath;
        }

        $course = Course::create($validated);

        // Attach tags if provided
        if (!empty($validated['tags'])) {
            $course->tags()->attach($validated['tags']);
        }

        return redirect()->route('dashboard.courses.index')
            ->with('success', 'Course created successfully.');
    }

    /**
     * Display the specified course
     */
    public function show(Course $course): Response
    {
        $course->load(['category', 'tags']);

        return Inertia::render('Dashboard/Courses/Show', [
            'course' => $course,
        ]);
    }

    /**
     * Show the form for editing the specified course
     */
    public function edit(Course $course): Response
    {
        $course->load(['category', 'tags']);
        $categories = Category::orderBy('name')->get();
        $tags = Tag::orderBy('name')->get();

        return Inertia::render('Dashboard/Courses/Edit', [
            'course' => $course,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * Update the specified course
     */
    public function update(Request $request, Course $course): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'external_url' => 'required|url',
            'duration' => 'nullable|string|max:100',
            'platform' => 'required|string|max:100',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'category_id' => 'required|exists:categories,id',
            'level' => 'required|in:beginner,intermediate,advanced',
            'have_cert' => 'boolean',
            'tags' => 'array',
            'tags.*' => 'exists:tags,id',
            'price' => 'nullable|numeric|min:0',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($course->image && Storage::disk('public')->exists($course->image)) {
                Storage::disk('public')->delete($course->image);
            }
            
            $imagePath = $request->file('image')->store('courses', 'public');
            $validated['image'] = $imagePath;
        }

        $course->update($validated);

        // Sync tags
        if (isset($validated['tags'])) {
            $course->tags()->sync($validated['tags']);
        } else {
            $course->tags()->detach();
        }

        return redirect()->route('dashboard.courses.index')
            ->with('success', 'Course updated successfully.');
    }

    /**
     * Remove the specified course
     */
    public function destroy(Course $course): RedirectResponse
    {
        // Delete image file if exists
        if ($course->image && Storage::disk('public')->exists($course->image)) {
            Storage::disk('public')->delete($course->image);
        }
        
        $course->tags()->detach();
        $course->delete();

        return redirect()->route('dashboard.courses.index')
            ->with('success', 'Course deleted successfully.');
    }

    /**
     * Bulk delete courses
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:courses,id',
        ]);

        $courses = Course::whereIn('id', $validated['ids'])->get();
        
        foreach ($courses as $course) {
            // Delete image file if exists
            if ($course->image && Storage::disk('public')->exists($course->image)) {
                Storage::disk('public')->delete($course->image);
            }
            
            $course->tags()->detach();
            $course->delete();
        }

        return redirect()->route('dashboard.courses.index')
            ->with('success', count($validated['ids']) . ' courses deleted successfully.');
    }
}