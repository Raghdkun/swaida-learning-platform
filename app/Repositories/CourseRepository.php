<?php

namespace App\Repositories;

use App\Models\Course;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class CourseRepository
{
    /**
     * Get paginated courses with filters and search
     *
     * Expects normalized filter keys:
     * - search: string
     * - category_id: int
     * - platform: string
     * - level: string (beginner|intermediate|advanced)
     * - have_cert: bool
     * - tags: array<int> (tag IDs)
     * - course_type: 'free'|'paid'
     * - min_price: float
     * - max_price: float
     * - sort: 'newest'|'oldest'|'price-low'|'price-high'|'title'|'popularity'
     */
    public function getPaginatedCourses(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = Course::query()
            ->with(['category', 'tags']);

        // Search across title, description, category name, tag name
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (Builder $q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('category', function (Builder $categoryQuery) use ($search) {
                        $categoryQuery->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('tags', function (Builder $tagQuery) use ($search) {
                        $tagQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Category ID (normalized in service)
        if (!empty($filters['category_id'])) {
            $query->where('category_id', (int) $filters['category_id']);
        }

        // Simple equality filters
        if (!empty($filters['platform'])) {
            $query->where('platform', $filters['platform']);
        }
        if (!empty($filters['level'])) {
            $query->where('level', $filters['level']);
        }

        // Boolean filter
        if (array_key_exists('have_cert', $filters)) {
            $query->where('have_cert', (bool) $filters['have_cert']);
        }

        // Tags as ID array (normalized in service)
        if (!empty($filters['tags']) && is_array($filters['tags'])) {
            $tagIds = array_filter(array_map('intval', $filters['tags']));
            if (!empty($tagIds)) {
                $query->whereHas('tags', function (Builder $tagQuery) use ($tagIds) {
                    $tagQuery->whereIn('tags.id', $tagIds);
                });
            }
        }

        // Free/Paid (proper grouping)
        if (!empty($filters['course_type'])) {
            $query->where(function (Builder $q) use ($filters) {
                if ($filters['course_type'] === 'free') {
                    $q->whereNull('price')->orWhere('price', '<=', 0);
                } elseif ($filters['course_type'] === 'paid') {
                    $q->whereNotNull('price')->where('price', '>', 0);
                }
            });
        }

        // Price range
        if (isset($filters['min_price']) && is_numeric($filters['min_price'])) {
            $query->where('price', '>=', (float) $filters['min_price']);
        }
        if (isset($filters['max_price']) && is_numeric($filters['max_price'])) {
            $query->where('price', '<=', (float) $filters['max_price']);
        }

        // Sorting
        switch ($filters['sort'] ?? 'newest') {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'price-low':
                $query->orderByRaw('CASE WHEN price IS NULL THEN 1 ELSE 0 END ASC')->orderBy('price', 'asc');
                break;
            case 'price-high':
                $query->orderByRaw('CASE WHEN price IS NULL THEN 1 ELSE 0 END ASC')->orderBy('price', 'desc');
                break;
            case 'title':
                $query->orderBy('title', 'asc');
                break;
            case 'popularity':
                // If you later add a "popularity" metric, adjust here.
                // Fallback to newest for now.
                $query->orderBy('created_at', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        return $query->paginate($perPage);
    }

    /**
     * Get course by ID with relationships
     */
    public function findWithRelations(int $id): ?\App\Models\Course
    {
        return Course::with(['category', 'tags'])->find($id);
    }

    /**
     * Get all unique platforms
     */
    public function getUniquePlatforms(): array
    {
        return Course::whereNotNull('platform')
            ->distinct()
            ->orderBy('platform')
            ->pluck('platform')
            ->toArray();
    }

    /**
     * Get all unique levels
     */
    public function getUniqueLevels(): array
    {
        return Course::whereNotNull('level')
            ->distinct()
            ->orderBy('level')
            ->pluck('level')
            ->toArray();
    }

    /**
     * Get courses count by category
     */
    public function getCoursesCountByCategory(): array
    {
        return Course::selectRaw('category_id, count(*) as count')
            ->groupBy('category_id')
            ->with('category:id,name')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->category->name => $item->count];
            })
            ->toArray();
    }

    /**
     * Get featured courses (example logic)
     */
    public function getFeaturedCourses(int $limit = 6): \Illuminate\Database\Eloquent\Collection
    {
        return Course::with(['category', 'tags'])
            ->where('have_cert', true)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get price range for filtering
     */
    public function getPriceRange(): array
    {
        $prices = Course::whereNotNull('price')
            ->where('price', '>', 0)
            ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
            ->first();

        return [
            'min_price' => (float) ($prices->min_price ?? 0),
            'max_price' => (float) ($prices->max_price ?? 0),
        ];
    }

    /**
     * Get course type counts
     */
    public function getCourseTypeCounts(): array
    {
        $free = Course::where(function (Builder $q) {
            $q->whereNull('price')->orWhere('price', '<=', 0);
        })->count();

        $paid = Course::whereNotNull('price')->where('price', '>', 0)->count();

        return ['free' => $free, 'paid' => $paid];
    }
}
