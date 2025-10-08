<?php

namespace App\Http\Controllers;

use App\Services\CourseService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function __construct(
        private CourseService $courseService
    ) {}

    /**
     * Display a listing of courses
     */
    public function index(Request $request): Response
    {
        $filters = $this->courseService->sanitizeFilters($request->all());
        $perPage = $request->get('per_page', 12);
        
        $data = $this->courseService->getCourses($filters, $perPage);
        
        return Inertia::render('Courses/Index', [
            'courses' => $data['courses'],
            'filters' => $data['filters'],
            'meta' => $data['meta'],
            'currentFilters' => $filters,
        ]);
    }

    /**
     * Display the specified course
     */
    public function show(int $id): Response
    {
        $data = $this->courseService->getCourseDetails($id);
        
        if (!$data) {
            abort(404, 'Course not found');
        }
        
        return Inertia::render('Courses/Show', [
            'course' => $data['course'],
            'relatedCourses' => $data['related_courses'],
        ]);
    }

    /**
     * Search courses
     */
    public function search(Request $request): Response
    {
        $query = $request->get('q', '');
        $filters = $this->courseService->sanitizeFilters($request->all());
        $perPage = $request->get('per_page', 12);
        
        $data = $this->courseService->searchCourses($query, $filters, $perPage);
        
        return Inertia::render('Courses/Search', [
            'courses' => $data['courses'],
            'filters' => $data['filters'],
            'meta' => $data['meta'],
            'currentFilters' => $filters,
            'searchQuery' => $query,
        ]);
    }

    /**
     * Get featured courses for homepage
     */
    public function featured(): Response
    {
        $featuredCourses = $this->courseService->getFeaturedCourses(8);
        $filterOptions = $this->courseService->getFilterOptions();
        $stats = $this->courseService->getDashboardStats();
        
        return Inertia::render('Home', [
            'featuredCourses' => $featuredCourses,
            'filterOptions' => $filterOptions,
            'stats' => $stats,
        ]);
    }

    /**
     * API endpoint for course data (for AJAX requests)
     */
    public function api(Request $request)
    {
        $filters = $this->courseService->sanitizeFilters($request->all());
        $perPage = $request->get('per_page', 12);
        
        $data = $this->courseService->getCourses($filters, $perPage);
        
        // Return the courses data in the format expected by the frontend
        return response()->json([
            'data' => $data['courses']->items(),
            'meta' => $data['meta'],
            'links' => [
                'first' => $data['courses']->url(1),
                'last' => $data['courses']->url($data['courses']->lastPage()),
                'prev' => $data['courses']->previousPageUrl(),
                'next' => $data['courses']->nextPageUrl(),
            ],
            'filters' => $data['filters'],
        ]);
    }

    /**
     * API endpoint for filter options
     */
    public function filterOptions()
    {
        $filterOptions = $this->courseService->getFilterOptions();
        
        return response()->json($filterOptions);
    }

    /**
     * Show payment form for a course
     */
    public function payment(int $id): Response|RedirectResponse
    {
        $data = $this->courseService->getCourseDetails($id);
        
        if (!$data) {
            abort(404, 'Course not found');
        }

        $course = $data['course'];
        
        // Redirect to course page if it's free
        if (!$course->is_paid) {
            return redirect()->route('courses.show', $id)
                ->with('message', 'This course is free and does not require payment.');
        }
        
        return Inertia::render('Courses/Payment', [
            'course' => $course,
        ]);
    }


}
