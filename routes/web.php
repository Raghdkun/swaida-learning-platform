<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CoursePaymentRequestController;

// Homepage with featured courses
Route::get('/', [CourseController::class, 'featured'])->name('home');
// Public endpoint used by your React form
Route::post('/courses/payment', [CoursePaymentRequestController::class, 'store'])
    ->name('courses.payment.store');

// Success page (server-rendered with props)
Route::get('/courses/payment/success/{course}', [CoursePaymentRequestController::class, 'success'])
    ->name('courses.payment.success');

// Dashboard CRUD (auth middleware as you see fit)
Route::middleware(['auth', 'admin'])
    ->prefix('dashboard')
    ->name('dashboard.')
    ->group(function () {
        Route::get('course-payments/{coursePaymentRequest}/edit', [
    CoursePaymentRequestController::class, 'edit'
])->name('dashboard.course-payments.edit');
        Route::get('/course-payments', [CoursePaymentRequestController::class, 'index'])->name('course-payments.index');
        Route::get('/course-payments/{coursePaymentRequest}', [CoursePaymentRequestController::class, 'show'])->name('course-payments.show');
        Route::post('/course-payments/{coursePaymentRequest}', [CoursePaymentRequestController::class, 'update'])->name('course-payments.update');
        Route::delete('/course-payments/{coursePaymentRequest}', [CoursePaymentRequestController::class, 'destroy'])->name('course-payments.destroy');
        Route::delete('/course-payments-bulk-destroy', [CoursePaymentRequestController::class, 'bulkDestroy'])->name('course-payments.bulk-destroy');
    });
// Course routes
Route::prefix('courses')->name('courses.')->group(function () {
    Route::get('/', [CourseController::class, 'index'])->name('index');
    Route::get('/search', [CourseController::class, 'search'])->name('search');
    Route::get('/{id}', [CourseController::class, 'show'])->name('show')->where('id', '[0-9]+');
    Route::get('/{id}/payment', [CourseController::class, 'payment'])->name('payment')->where('id', '[0-9]+');
    Route::post('/{id}/payment', [CourseController::class, 'submitPayment'])->name('payment.submit')->where('id', '[0-9]+');
});

// API routes for AJAX requests
Route::prefix('api')->name('api.')->group(function () {
    Route::get('/courses', [CourseController::class, 'api'])->name('courses');
    Route::get('/filter-options', [CourseController::class, 'filterOptions'])->name('filter-options');
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Dashboard Course CRUD routes
    Route::prefix('dashboard/courses')->name('dashboard.courses.')->group(function () {
        Route::get('/', [App\Http\Controllers\DashboardCourseController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\DashboardCourseController::class, 'create'])->name('create');
        Route::post('/', [App\Http\Controllers\DashboardCourseController::class, 'store'])->name('store');
        Route::get('/{course}', [App\Http\Controllers\DashboardCourseController::class, 'show'])->name('show');
        Route::get('/{course}/edit', [App\Http\Controllers\DashboardCourseController::class, 'edit'])->name('edit');
        Route::put('/{course}', [App\Http\Controllers\DashboardCourseController::class, 'update'])->name('update');
        Route::delete('/{course}', [App\Http\Controllers\DashboardCourseController::class, 'destroy'])->name('destroy');
        Route::delete('/', [App\Http\Controllers\DashboardCourseController::class, 'bulkDestroy'])->name('bulk-destroy');
    });

    // Dashboard Tag CRUD routes
    Route::prefix('dashboard/tags')->name('dashboard.tags.')->group(function () {
        Route::get('/', [App\Http\Controllers\DashboardTagController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\DashboardTagController::class, 'create'])->name('create');
        Route::post('/', [App\Http\Controllers\DashboardTagController::class, 'store'])->name('store');
        Route::get('/{tag}', [App\Http\Controllers\DashboardTagController::class, 'show'])->name('show');
        Route::get('/{tag}/edit', [App\Http\Controllers\DashboardTagController::class, 'edit'])->name('edit');
        Route::put('/{tag}', [App\Http\Controllers\DashboardTagController::class, 'update'])->name('update');
        Route::delete('/{tag}', [App\Http\Controllers\DashboardTagController::class, 'destroy'])->name('destroy');
        Route::delete('/', [App\Http\Controllers\DashboardTagController::class, 'bulkDestroy'])->name('bulk-destroy');
    });

    // Debug route for tags
    Route::get('/debug/tags', function () {
        $tags = \App\Models\Tag::withCount('courses')->paginate(15);
        return response()->json([
            'total_count' => \App\Models\Tag::count(),
            'paginated_data' => $tags,
            'paginated_structure' => [
                'data' => $tags->items(),
                'current_page' => $tags->currentPage(),
                'last_page' => $tags->lastPage(),
                'per_page' => $tags->perPage(),
                'total' => $tags->total(),
                'from' => $tags->firstItem(),
                'to' => $tags->lastItem(),
            ]
        ]);
    });

    // Dashboard Category CRUD routes
    Route::prefix('dashboard/categories')->name('dashboard.categories.')->group(function () {
        Route::get('/', [App\Http\Controllers\DashboardCategoryController::class, 'index'])->name('index');
        Route::get('/create', [App\Http\Controllers\DashboardCategoryController::class, 'create'])->name('create');
        Route::post('/', [App\Http\Controllers\DashboardCategoryController::class, 'store'])->name('store');
        Route::get('/{category}', [App\Http\Controllers\DashboardCategoryController::class, 'show'])->name('show');
        Route::get('/{category}/edit', [App\Http\Controllers\DashboardCategoryController::class, 'edit'])->name('edit');
        Route::put('/{category}', [App\Http\Controllers\DashboardCategoryController::class, 'update'])->name('update');
        Route::delete('/{category}', [App\Http\Controllers\DashboardCategoryController::class, 'destroy'])->name('destroy');
        Route::delete('/', [App\Http\Controllers\DashboardCategoryController::class, 'bulkDestroy'])->name('bulk-destroy');
    });

    // Dashboard Level routes (read-only since levels are predefined)
    Route::prefix('dashboard/levels')->name('dashboard.levels.')->group(function () {
        Route::get('/', [App\Http\Controllers\DashboardLevelController::class, 'index'])->name('index');
        Route::get('/{level}', [App\Http\Controllers\DashboardLevelController::class, 'show'])->name('show');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
