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

    /**
     * Submit payment request
     */
    public function submitPayment(Request $request, int $id): RedirectResponse
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

        // Validate the request
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'identity_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'reason' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $validated = $validator->validated();

        // Store the identity image
        if ($request->hasFile('identity_image')) {
            $imagePath = $request->file('identity_image')->store('payment-requests', 'public');
            $validated['identity_image_path'] = $imagePath;
        }

        // Add course information
        $validated['course_id'] = $course->id;
        $validated['course_title'] = $course->title;
        $validated['course_price'] = $course->price;
        $validated['submitted_at'] = now();

        // Here you would typically save to a payment_requests table
        // For now, we'll just log it or save to a JSON file
        $this->storePaymentRequest($validated);

        // Redirect to success page with course and submission data
        return redirect()->route('courses.payment.success')
            ->with('course', $course)
            ->with('submissionData', [
                'full_name' => $validated['full_name'],
                'phone' => $validated['phone'],
                'email' => $validated['email'],
            ]);
    }

    /**
     * Show payment success page
     */
    public function paymentSuccess(): Response
    {
        $course = session('course');
        $submissionData = session('submissionData');
        
        return Inertia::render('Courses/PaymentSuccess', [
            'course' => $course,
            'submissionData' => $submissionData,
        ]);
    }

    /**
     * Store payment request (temporary implementation)
     * In a real application, you would save this to a database table
     */
    private function storePaymentRequest(array $data): void
    {
        $filename = 'payment-requests/' . date('Y-m-d') . '.json';
        
        // Get existing requests for today
        $existingRequests = [];
        if (Storage::disk('local')->exists($filename)) {
            $existingRequests = json_decode(Storage::disk('local')->get($filename), true) ?? [];
        }
        
        // Add new request
        $existingRequests[] = $data;
        
        // Save back to file
        Storage::disk('local')->put($filename, json_encode($existingRequests, JSON_PRETTY_PRINT));
        
        // Also log for immediate notification (you could send email/SMS here)
        Log::info('New payment request submitted', $data);
    }
}
