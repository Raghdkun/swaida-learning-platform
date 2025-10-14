<?php

namespace App\Services;

use App\Repositories\CourseRepository;
use App\Repositories\CategoryRepository;
use App\Repositories\TagRepository;
use Illuminate\Database\Eloquent\Collection;

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
        $filters = $this->sanitizeFilters($filters);

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
            ],
        ];
    }

    public function getCourseDetails(int $id): ?array
    {
        $course = $this->courseRepository->findWithRelations($id);

        if (!$course) {
            return null;
        }

        return [
            'course' => $course,
            'related_courses' => $this->getRelatedCourses($course, 4),
        ];
    }

    public function getFilterOptions(): array
    {
        return [
            'categories'   => $this->categoryRepository->getCategoriesWithCourses(), // categories auto-localize via accessor
            'tags'         => $this->tagRepository->getPopularTags(20),             // tags auto-localize
            'platforms'    => $this->courseRepository->getUniquePlatforms(),        // canonical value list
            'levels'       => $this->courseRepository->getUniqueLevels(),           // canonical value list
            'price_range'  => $this->courseRepository->getPriceRange(),
            'course_types' => $this->courseRepository->getCourseTypeCounts(),
        ];
    }

    public function getRelatedCourses($course, int $limit = 4): Collection
    {
        $tagIds = $course->tags->pluck('id')->toArray();

        $filters = [
            'category_id' => $course->category_id,
            'tags'        => $tagIds,
        ];

        $related = $this->courseRepository->getPaginatedCourses($filters, $limit);

        // Ensure all localized data is available on the related collection
        return $related->getCollection()
            ->load(['translations', 'category.translations', 'tags.translations'])
            ->filter(fn ($c) => $c->id !== $course->id)
            ->take($limit);
    }

    public function getFeaturedCourses(int $limit = 6): Collection
    {
        // Repository already eager-loads translations; return as-is
        return $this->courseRepository->getFeaturedCourses($limit);
    }

    public function getDashboardStats(): array
    {
        return [
            'total_courses'      => $this->courseRepository->getPaginatedCourses([], 1)->total(),
            'total_categories'   => $this->categoryRepository->getAll()->count(),
            'total_tags'         => $this->tagRepository->getAll()->count(),
            'courses_by_category'=> $this->courseRepository->getCoursesCountByCategory(),
            'platforms'          => $this->courseRepository->getUniquePlatforms(),
            'levels'             => $this->courseRepository->getUniqueLevels(),
        ];
    }

    public function searchCourses(string $query, array $filters = [], int $perPage = 12): array
    {
        $filters['search'] = $query;
        return $this->getCourses($filters, $perPage);
    }

    /**
     * Normalize/validate filters coming from the client.
     * - Accepts friendly slugs and converts them to IDs where needed
     * - Guards against invalid types
     */
    public function sanitizeFilters(array $filters): array
    {
        $sanitized = [];

        // Search
        if (isset($filters['search']) && is_string($filters['search'])) {
            $sanitized['search'] = trim(strip_tags($filters['search']));
        }

        // Category: accept 'category' (slug) or 'category_id'
        if (!empty($filters['category_id']) && is_numeric($filters['category_id'])) {
            $sanitized['category_id'] = (int) $filters['category_id'];
        } elseif (!empty($filters['category']) && is_string($filters['category'])) {
            $id = $this->categoryRepository->findIdBySlug($filters['category']);
            if ($id) {
                $sanitized['category_id'] = $id;
            }
        }

        // Platform / Level (canonical values; display localized via accessors on models)
        if (!empty($filters['platform']) && is_string($filters['platform'])) {
            $sanitized['platform'] = trim($filters['platform']);
        }
        if (!empty($filters['level']) && is_string($filters['level'])) {
            $level = trim($filters['level']);
            if (in_array($level, ['beginner', 'intermediate', 'advanced'], true)) {
                $sanitized['level'] = $level;
            }
        }

        // Certificate (bool-like)
        if (array_key_exists('have_cert', $filters)) {
            $sanitized['have_cert'] = filter_var($filters['have_cert'], FILTER_VALIDATE_BOOLEAN);
        }

        // Tags: accept array of slugs (tags[]) or a single slug
        if (isset($filters['tags'])) {
            $tagSlugs = [];
            if (is_array($filters['tags'])) {
                $tagSlugs = array_values(array_filter(array_map('strval', $filters['tags'])));
            } elseif (is_string($filters['tags'])) {
                $tagSlugs = [$filters['tags']];
            }
            if (!empty($tagSlugs)) {
                $sanitized['tags'] = $this->tagRepository->findIdsBySlugs($tagSlugs);
            }
        }

        // Course type
        if (!empty($filters['course_type']) && in_array($filters['course_type'], ['free', 'paid'], true)) {
            $sanitized['course_type'] = $filters['course_type'];
        } elseif (!empty($filters['type']) && in_array($filters['type'], ['free', 'paid'], true)) {
            // backward compatibility
            $sanitized['course_type'] = $filters['type'];
        }

        // Price range
        if (isset($filters['min_price']) && $filters['min_price'] !== '') {
            $sanitized['min_price'] = (float) $filters['min_price'];
        }
        if (isset($filters['max_price']) && $filters['max_price'] !== '') {
            $sanitized['max_price'] = (float) $filters['max_price'];
        }

        // Sort mapping (allow only known values)
        if (!empty($filters['sort']) && is_string($filters['sort'])) {
            $allowed = ['newest', 'oldest', 'price-low', 'price-high', 'title', 'popularity'];
            if (in_array($filters['sort'], $allowed, true)) {
                $sanitized['sort'] = $filters['sort'];
            }
        }

        // Pagination (optional)
        if (!empty($filters['page']) && is_numeric($filters['page'])) {
            $sanitized['page'] = (int) $filters['page'];
        }

        return $sanitized;
    }
}
