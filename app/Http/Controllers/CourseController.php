<?php

namespace App\Http\Controllers;

use App\Services\CourseService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function __construct(
        private CourseService $courseService
    ) {}

    /**
     * Display a listing of courses (Inertia page)
     */
    public function index(Request $request): Response
    {
        $filters = $this->courseService->sanitizeFilters($request->all());
        $perPage = (int) $request->get('per_page', 12);

        $data = $this->courseService->getCourses($filters, $perPage);

        return Inertia::render('Courses/Index', [
            'courses'          => [
                'data' => $data['courses']->items(),
                'meta' => [
                    'total'        => $data['meta']['total'],
                    'per_page'     => $data['meta']['per_page'],
                    'current_page' => $data['meta']['current_page'],
                    'last_page'    => $data['meta']['last_page'],
                    'from'         => $data['meta']['from'],
                    'to'           => $data['meta']['to'],
                ],
            ],
            'categories'       => $data['filters']['categories'],
            'filters'          => $data['filters'], // FilterOptions for the UI component
            'current_filters'  => $filters,
        ]);
    }

    /**
     * API endpoint for async filtering/pagination
     */
    public function api(Request $request)
    {
        $filters = $this->courseService->sanitizeFilters($request->all());
        $perPage = (int) $request->get('per_page', 12);

        $data = $this->courseService->getCourses($filters, $perPage);
        $paginator = $data['courses'];

        return response()->json([
            'data'  => $paginator->items(),
            'meta'  => [
                'total'        => $paginator->total(),
                'per_page'     => $paginator->perPage(),
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'from'         => $paginator->firstItem(),
                'to'           => $paginator->lastItem(),
            ],
            'links' => [
                'first' => $paginator->url(1),
                'last'  => $paginator->url($paginator->lastPage()),
                'prev'  => $paginator->previousPageUrl(),
                'next'  => $paginator->nextPageUrl(),
            ],
            // Optional: return filter options if you want to live-update counts
            'filters' => $data['filters'],
        ]);
    }

    /**
     * API: filter options (platforms, levels, etc.)
     */
    public function filterOptions()
    {
        return response()->json($this->courseService->getFilterOptions());
    }

    public function show(int $id): Response
    {
        $data = $this->courseService->getCourseDetails($id);
        if (!$data) {
            abort(404, 'Course not found');
        }

        return Inertia::render('Courses/Show', [
            'course'          => $data['course'],
            'relatedCourses'  => $data['related_courses'],
        ]);
    }

    public function featured(): Response
    {
        $featuredCourses = $this->courseService->getFeaturedCourses(8);
        $filterOptions   = $this->courseService->getFilterOptions();
        $stats           = $this->courseService->getDashboardStats();

        return Inertia::render('Home', [
            'featuredCourses' => $featuredCourses,
            'filterOptions'   => $filterOptions,
            'stats'           => $stats,
        ]);
    }
}
