<?php

namespace App\Services;

use App\Repositories\CourseRepository;
use App\Repositories\CategoryRepository;
use App\Repositories\TagRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class CourseService
{
    public function __construct(
        private CourseRepository $courseRepository,
        private CategoryRepository $categoryRepository,
        private TagRepository $tagRepository
    ) {}

    /**
     * Get courses with filters and pagination
     */
    public function getCourses(array $filters = [], int $perPage = 12): array
    {
        $courses = $this->courseRepository->getPaginatedCourses($filters, $perPage);
        
        return [
            'courses' => $courses,
            'filters' => $this->getFilterOptions(),
            'meta' => [
                'total' => $courses->total(),
                'per_page' => $courses->perPage(),
                'current_page' => $courses->currentPage(),
                'last_page' => $courses->lastPage(),
                'from' => $courses->firstItem(),
                'to' => $courses->lastItem(),
            ]
        ];
    }

    /**
     * Get course details by ID
     */
    public function getCourseDetails(int $id): ?array
    {
        $course = $this->courseRepository->findWithRelations($id);
        
        if (!$course) {
            return null;
        }

        return [
            'course' => $course,
            'related_courses' => $this->getRelatedCourses($course, 4)
        ];
    }

    /**
     * Get filter options for the frontend
     */
    public function getFilterOptions(): array
    {
        return [
            'categories' => $this->categoryRepository->getCategoriesWithCourses(),
            'tags' => $this->tagRepository->getPopularTags(20),
            'platforms' => $this->courseRepository->getUniquePlatforms(),
            'levels' => $this->courseRepository->getUniqueLevels(),
            'price_range' => $this->courseRepository->getPriceRange(),
            'course_types' => $this->courseRepository->getCourseTypeCounts(),
        ];
    }

    /**
     * Get related courses based on category and tags
     */
    public function getRelatedCourses($course, int $limit = 4): \Illuminate\Database\Eloquent\Collection
    {
        $tagIds = $course->tags->pluck('id')->toArray();
        
        $filters = [
            'category_id' => $course->category_id,
        ];
        
        if (!empty($tagIds)) {
            $filters['tags'] = $tagIds;
        }

        $relatedCourses = $this->courseRepository->getPaginatedCourses($filters, $limit);
        
        // Remove the current course from related courses
        return $relatedCourses->getCollection()->filter(function ($relatedCourse) use ($course) {
            return $relatedCourse->id !== $course->id;
        })->take($limit);
    }

    /**
     * Get featured courses for homepage
     */
    public function getFeaturedCourses(int $limit = 6): \Illuminate\Database\Eloquent\Collection
    {
        return $this->courseRepository->getFeaturedCourses($limit);
    }

    /**
     * Get dashboard statistics
     */
    public function getDashboardStats(): array
    {
        return [
            'total_courses' => $this->courseRepository->getPaginatedCourses([], 1)->total(),
            'total_categories' => $this->categoryRepository->getAll()->count(),
            'total_tags' => $this->tagRepository->getAll()->count(),
            'courses_by_category' => $this->courseRepository->getCoursesCountByCategory(),
            'platforms' => $this->courseRepository->getUniquePlatforms(),
            'levels' => $this->courseRepository->getUniqueLevels(),
        ];
    }

    /**
     * Search courses with advanced filters
     */
    public function searchCourses(string $query, array $filters = [], int $perPage = 12): array
    {
        $filters['search'] = $query;
        
        return $this->getCourses($filters, $perPage);
    }

    /**
     * Validate and sanitize filter inputs
     */
    public function sanitizeFilters(array $filters): array
    {
        $sanitized = [];

        // Sanitize search query
        if (isset($filters['search']) && !empty($filters['search'])) {
            $sanitized['search'] = trim(strip_tags($filters['search']));
        }

        // Validate category_id
        if (isset($filters['category_id']) && is_numeric($filters['category_id'])) {
            $sanitized['category_id'] = (int) $filters['category_id'];
        }

        // Validate platform
        if (isset($filters['platform']) && !empty($filters['platform'])) {
            $sanitized['platform'] = trim(strip_tags($filters['platform']));
        }

        // Validate level
        if (isset($filters['level']) && !empty($filters['level'])) {
            $sanitized['level'] = trim(strip_tags($filters['level']));
        }

        // Validate have_cert
        if (isset($filters['have_cert'])) {
            $sanitized['have_cert'] = filter_var($filters['have_cert'], FILTER_VALIDATE_BOOLEAN);
        }

        // Validate tags
        if (isset($filters['tags'])) {
            if (is_array($filters['tags'])) {
                $sanitized['tags'] = array_filter(array_map('intval', $filters['tags']));
            } elseif (is_numeric($filters['tags'])) {
                $sanitized['tags'] = [(int) $filters['tags']];
            }
        }

        // Validate course_type (also handle 'type' parameter from frontend)
        if (isset($filters['course_type']) && in_array($filters['course_type'], ['free', 'paid'])) {
            $sanitized['course_type'] = $filters['course_type'];
        } elseif (isset($filters['type']) && in_array($filters['type'], ['free', 'paid'])) {
            $sanitized['course_type'] = $filters['type'];
        }

        // Validate min_price
        if (isset($filters['min_price']) && is_numeric($filters['min_price'])) {
            $sanitized['min_price'] = (float) $filters['min_price'];
        }

        // Validate max_price
        if (isset($filters['max_price']) && is_numeric($filters['max_price'])) {
            $sanitized['max_price'] = (float) $filters['max_price'];
        }

        return $sanitized;
    }
}