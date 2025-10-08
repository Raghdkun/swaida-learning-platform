<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CoursePaymentRequest;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Arr;
class CoursePaymentRequestController extends Controller
{
    /**
     * PUBLIC: Store payment request submitted by the React/Inertia form.
     * Route name used by your form: courses.payment.store
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'full_name'       => ['required', 'string', 'max:255'],
            'phone'           => ['required', 'string', 'max:50'],
            'email'           => ['required', 'email', 'max:255'],
            'identity_image'  => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:10240'], // 10MB
            'reason'          => ['required', 'string', 'min:10'],
            'course_id'       => ['required', Rule::exists('courses', 'id')],
        ]);

        // Upload image
        if ($request->hasFile('identity_image')) {
            $validated['identity_image'] = $request->file('identity_image')
                ->store('course-payments', 'public');
        }

        CoursePaymentRequest::create($validated);

        // minimal data to show on success page
        $submissionData = Arr::only($validated, ['full_name','phone','email']);

        // redirect to success page for this course with submission data in session
        return redirect()
            ->route('courses.payment.success', $validated['course_id'])
            ->with('submissionData', $submissionData);
    }

    /**
     * PUBLIC: Success page after a payment request is submitted.
     * Loads the course and pulls submitted data from the session.
     */
    public function success(Request $request, Course $course): Response
    {
        // eager-load anything you show (category, etc.)
        $course->load('category');

        return Inertia::render('Courses/PaymentSuccess', [
            'course' => $course,
            'submissionData' => $request->session()->get('submissionData'),
        ]);
    }

    /**
     * DASHBOARD: list payment requests (filters + sorting).
     */
    public function index(Request $request): Response
    {
        $query = CoursePaymentRequest::with('course')
            ->search($request->get('search'))
            ->status($request->get('status'))
            ->course($request->get('course_id'));

        // Sorting
        $sortBy = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');

        $allowedSorts = ['created_at', 'updated_at', 'full_name', 'email', 'status'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $direction);
        }

        $payments = $query->paginate(15)->withQueryString();

        $courses = Course::orderBy('title')->get(['id', 'title']);

        return Inertia::render('Dashboard/CoursePayments/Index', [
            'payments' => $payments,
            'courses' => $courses,
            'filters' => $request->only(['search', 'status', 'course_id', 'sort', 'direction']),
        ]);
    }

    /**
     * DASHBOARD: show a single payment request.
     */
    public function show(CoursePaymentRequest $coursePaymentRequest): Response
    {
        $coursePaymentRequest->load('course');

        return Inertia::render('Dashboard/CoursePayments/Show', [
            'payment' => $coursePaymentRequest,
        ]);
    }

    /**
     * DASHBOARD: update a payment request (status, admin_note, or fix fields).
     */
    public function update(Request $request, CoursePaymentRequest $coursePaymentRequest): RedirectResponse
    {

            if (!$request->hasFile('identity_image')) {
        $request->request->remove('identity_image');
    }
        $validated = $request->validate([
            'full_name'       => ['sometimes', 'required', 'string', 'max:255'],
            'phone'           => ['sometimes', 'required', 'string', 'max:50'],
            'email'           => ['sometimes', 'required', 'email', 'max:255'],
            'identity_image'  => ['sometimes', 'nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:10240'],
            'reason'          => ['sometimes', 'required', 'string', 'min:10'],
            'course_id'       => ['sometimes', 'required', Rule::exists('courses', 'id')],
            'status'          => ['sometimes', 'required', Rule::in(['pending','reviewing','approved','rejected','contacted'])],
            'admin_note'      => ['nullable', 'string'],
        ]);

        if ($request->hasFile('identity_image')) {
            if ($coursePaymentRequest->identity_image && Storage::disk('public')->exists($coursePaymentRequest->identity_image)) {
                Storage::disk('public')->delete($coursePaymentRequest->identity_image);
            }
            $validated['identity_image'] = $request->file('identity_image')->store('course-payments', 'public');
        }

        $coursePaymentRequest->update($validated);

        return redirect()->route('dashboard.course-payments.index')->with('success', 'Payment request updated.');
    }

    public function edit(CoursePaymentRequest $coursePaymentRequest): \Inertia\Response
{
    // eager-load anything you display in the edit form
    $coursePaymentRequest->load('course');

    // list of courses for the "Course" <Select> in the sidebar
    $courses = Course::orderBy('title')->get(['id', 'title']);

    return \Inertia\Inertia::render('Dashboard/CoursePayments/Edit', [
        'payment' => $coursePaymentRequest,
        'courses' => $courses,
    ]);
}

    /**
     * DASHBOARD: delete a single payment request.
     */
    public function destroy(CoursePaymentRequest $coursePaymentRequest): RedirectResponse
    {
        if ($coursePaymentRequest->identity_image && Storage::disk('public')->exists($coursePaymentRequest->identity_image)) {
            Storage::disk('public')->delete($coursePaymentRequest->identity_image);
        }

        $coursePaymentRequest->delete();

        return redirect()
            ->route('dashboard.course-payments.index')
            ->with('success', 'Payment request deleted.');
    }

    /**
     * DASHBOARD: bulk delete.
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:course_payment_requests,id'],
        ]);

        $items = CoursePaymentRequest::whereIn('id', $validated['ids'])->get();

        foreach ($items as $item) {
            if ($item->identity_image && Storage::disk('public')->exists($item->identity_image)) {
                Storage::disk('public')->delete($item->identity_image);
            }
            $item->delete();
        }

        return redirect()
            ->route('dashboard.course-payments.index')
            ->with('success', count($validated['ids']) . ' payment requests deleted.');
    }
}
