<?php

namespace App\Repositories;

use App\Models\Course;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;

class CourseRepository
{
    /**
     * Get paginated courses with filters and search
     */
    public function getPaginatedCourses(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        return QueryBuilder::for(Course::class)
            ->allowedFilters([
                'title',
                'platform',
                'level',
                'have_cert',
                'category.name',
                'tags.name',
                'price',
            ])
            ->allowedSorts([
                'title',
                'platform',
                'level',
                'created_at',
                'duration',
                'price',
            ])
            ->with(['category', 'tags'])
            ->when(isset($filters['search']), function (Builder $query) use ($filters) {
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
            })
            ->when(isset($filters['category_id']), function (Builder $query) use ($filters) {
                $query->where('category_id', $filters['category_id']);
            })
            ->when(isset($filters['platform']), function (Builder $query) use ($filters) {
                $query->where('platform', $filters['platform']);
            })
            ->when(isset($filters['level']), function (Builder $query) use ($filters) {
                $query->where('level', $filters['level']);
            })
            ->when(isset($filters['have_cert']), function (Builder $query) use ($filters) {
                $query->where('have_cert', $filters['have_cert']);
            })
            ->when(isset($filters['tags']), function (Builder $query) use ($filters) {
                $tagIds = is_array($filters['tags']) ? $filters['tags'] : [$filters['tags']];
                $query->whereHas('tags', function (Builder $tagQuery) use ($tagIds) {
                    $tagQuery->whereIn('tags.id', $tagIds);
                });
            })
            ->when(isset($filters['course_type']), function (Builder $query) use ($filters) {
                if ($filters['course_type'] === 'free') {
                    $query->whereNull('price')->orWhere('price', '<=', 0);
                } elseif ($filters['course_type'] === 'paid') {
                    $query->whereNotNull('price')->where('price', '>', 0);
                }
            })
            ->when(isset($filters['min_price']), function (Builder $query) use ($filters) {
                $query->where('price', '>=', $filters['min_price']);
            })
            ->when(isset($filters['max_price']), function (Builder $query) use ($filters) {
                $query->where('price', '<=', $filters['max_price']);
            })
            ->paginate($perPage);
    }

    /**
     * Get course by ID with relationships
     */
    public function findWithRelations(int $id): ?Course
    {
        return Course::with(['category', 'tags'])->find($id);
    }

    /**
     * Get all unique platforms
     */
    public function getUniquePlatforms(): array
    {
        return Course::distinct('platform')
            ->whereNotNull('platform')
            ->pluck('platform')
            ->toArray();
    }

    /**
     * Get all unique levels
     */
    public function getUniqueLevels(): array
    {
        return Course::distinct('level')
            ->whereNotNull('level')
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
     * Get featured courses (you can customize this logic)
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
            'min_price' => $prices->min_price ?? 0,
            'max_price' => $prices->max_price ?? 0,
        ];
    }

    /**
     * Get course type counts
     */
    public function getCourseTypeCounts(): array
    {
        $freeCourses = Course::whereNull('price')->orWhere('price', '<=', 0)->count();
        $paidCourses = Course::whereNotNull('price')->where('price', '>', 0)->count();

        return [
            'free' => $freeCourses,
            'paid' => $paidCourses,
        ];
    }
}