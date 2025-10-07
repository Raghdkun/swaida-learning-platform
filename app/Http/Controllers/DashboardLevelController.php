<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardLevelController extends Controller
{
    /**
     * Available course levels
     */
    private const LEVELS = [
        'beginner' => 'Beginner',
        'intermediate' => 'Intermediate', 
        'advanced' => 'Advanced'
    ];

    /**
     * Display a listing of the levels with course counts.
     */
    public function index(): Response
    {
        $levelStats = [];
        
        foreach (self::LEVELS as $value => $label) {
            $courseCount = Course::where('level', $value)->count();
            $levelStats[] = [
                'level' => $value,
                'label' => $label,
                'courses_count' => $courseCount,
                'description' => $this->getLevelDescription($value)
            ];
        }

        return Inertia::render('Dashboard/Levels/Index', [
            'levels' => $levelStats,
        ]);
    }

    /**
     * Display courses for a specific level.
     */
    public function show(Request $request, string $level): Response
    {
        if (!array_key_exists($level, self::LEVELS)) {
            abort(404, 'Level not found');
        }

        $query = Course::where('level', $level)->with(['category', 'tags']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category_id', $request->get('category'));
        }

        // Sort functionality
        $sortBy = $request->get('sort', 'title');
        $sortDirection = 'asc';
        
        $allowedSorts = ['title', 'created_at', 'updated_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDirection);
        } else {
            $query->orderBy('title', 'asc');
        }

        $courses = $query->paginate(15)->withQueryString();

        // Get categories for filter dropdown
        $categories = \App\Models\Category::orderBy('name')->get();

        return Inertia::render('Dashboard/Levels/Show', [
            'level' => [
                'level' => $level,
                'label' => self::LEVELS[$level],
                'description' => $this->getLevelDescription($level)
            ],
            'courses' => $courses,
            'filters' => $request->only(['search', 'sort', 'category']),
            'categories' => $categories,
        ]);
    }

    /**
     * Get available levels for API/form usage.
     */
    public function getLevels(): array
    {
        return array_map(function($value, $label) {
            return [
                'value' => $value,
                'label' => $label
            ];
        }, array_keys(self::LEVELS), self::LEVELS);
    }

    /**
     * Get level description.
     */
    private function getLevelDescription(string $level): string
    {
        return match($level) {
            'beginner' => 'Perfect for those new to the subject with little to no prior experience.',
            'intermediate' => 'Suitable for learners with some foundational knowledge and basic experience.',
            'advanced' => 'Designed for experienced learners looking to master complex concepts and techniques.',
            default => ''
        };
    }
}