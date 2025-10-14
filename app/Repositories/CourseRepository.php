<?php

namespace App\Repositories;

use App\Models\Course;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class CourseRepository
{
    public function getPaginatedCourses(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = Course::query()
            ->with(['category.translations', 'tags.translations', 'translations']); // ← ADDED translations eager-load

        // Search across title, description, category name, tag name, AND translations
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $locale = app()->getLocale();
            
            $query->where(function (Builder $q) use ($search, $locale) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('category', function (Builder $categoryQuery) use ($search) {
                        $categoryQuery->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('tags', function (Builder $tagQuery) use ($search) {
                        $tagQuery->where('name', 'like', "%{$search}%");
                    });
                
                // ← ADDED: search translations for current locale
                if ($locale !== 'en') {
                    $q->orWhereHas('translations', function (Builder $transQuery) use ($search, $locale) {
                        $transQuery->where('locale', $locale)
                                   ->whereIn('field', ['title', 'description', 'platform', 'level'])
                                   ->where('value', 'like', "%{$search}%");
                    });
                }
            });
        }

        // Rest of filters remain unchanged...
        if (!empty($filters['category_id'])) {
            $query->where('category_id', (int) $filters['category_id']);
        }

        if (!empty($filters['platform'])) {
            $query->where('platform', $filters['platform']);
        }
        if (!empty($filters['level'])) {
            $query->where('level', $filters['level']);
        }

        if (array_key_exists('have_cert', $filters)) {
            $query->where('have_cert', (bool) $filters['have_cert']);
        }

        if (!empty($filters['tags']) && is_array($filters['tags'])) {
            $tagIds = array_filter(array_map('intval', $filters['tags']));
            if (!empty($tagIds)) {
                $query->whereHas('tags', function (Builder $tagQuery) use ($tagIds) {
                    $tagQuery->whereIn('tags.id', $tagIds);
                });
            }
        }

        if (!empty($filters['course_type'])) {
            $query->where(function (Builder $q) use ($filters) {
                if ($filters['course_type'] === 'free') {
                    $q->whereNull('price')->orWhere('price', '<=', 0);
                } elseif ($filters['course_type'] === 'paid') {
                    $q->whereNotNull('price')->where('price', '>', 0);
                }
            });
        }

        if (isset($filters['min_price']) && is_numeric($filters['min_price'])) {
            $query->where('price', '>=', (float) $filters['min_price']);
        }
        if (isset($filters['max_price']) && is_numeric($filters['max_price'])) {
            $query->where('price', '<=', (float) $filters['max_price']);
        }

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
                $query->orderBy('created_at', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        return $query->paginate($perPage);
    }

    public function findWithRelations(int $id): ?Course
    {
        return Course::with(['category.translations', 'tags.translations', 'translations'])->find($id); // ← ADDED translations
    }

    // Rest of methods unchanged...
    public function getUniquePlatforms(): array
    {
        return Course::whereNotNull('platform')
            ->distinct()
            ->orderBy('platform')
            ->pluck('platform')
            ->toArray();
    }

    public function getUniqueLevels(): array
    {
        return Course::whereNotNull('level')
            ->distinct()
            ->orderBy('level')
            ->pluck('level')
            ->toArray();
    }

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

    public function getFeaturedCourses(int $limit = 6): \Illuminate\Database\Eloquent\Collection
    {
        return Course::with(['category.translations', 'tags.translations', 'translations'])->where('have_cert', true)
            ->where('have_cert', true)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

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

    public function getCourseTypeCounts(): array
    {
        $free = Course::where(function (Builder $q) {
            $q->whereNull('price')->orWhere('price', '<=', 0);
        })->count();

        $paid = Course::whereNotNull('price')->where('price', '>', 0)->count();

        return ['free' => $free, 'paid' => $paid];
    }
}
