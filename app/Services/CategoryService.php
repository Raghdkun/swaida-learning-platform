<?php

namespace App\Services;

use App\Repositories\CategoryRepository;
use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class CategoryService
{
    public function __construct(
        private CategoryRepository $categoryRepository
    ) {}

    /**
     * Get all categories with course counts
     */
    public function getAllCategories(): Collection
    {
        return $this->categoryRepository->getAllWithCourseCount();
    }

    /**
     * Get categories that have courses
     */
    public function getCategoriesWithCourses(): Collection
    {
        return $this->categoryRepository->getCategoriesWithCourses();
    }

    /**
     * Get category by ID
     */
    public function getCategoryById(int $id): ?Category
    {
        return $this->categoryRepository->findById($id);
    }

    /**
     * Get category by slug
     */
    public function getCategoryBySlug(string $slug): ?Category
    {
        return $this->categoryRepository->findBySlug($slug);
    }

    /**
     * Create a new category
     */
    public function createCategory(array $data): Category
    {
        // Generate slug if not provided
        if (!isset($data['slug']) || empty($data['slug'])) {
            $data['slug'] = $this->generateUniqueSlug($data['name']);
        }

        return $this->categoryRepository->create($data);
    }

    /**
     * Update category
     */
    public function updateCategory(int $id, array $data): bool
    {
        // Generate slug if name is updated but slug is not provided
        if (isset($data['name']) && (!isset($data['slug']) || empty($data['slug']))) {
            $data['slug'] = $this->generateUniqueSlug($data['name'], $id);
        }

        return $this->categoryRepository->update($id, $data);
    }

    /**
     * Delete category
     */
    public function deleteCategory(int $id): bool
    {
        return $this->categoryRepository->delete($id);
    }

    /**
     * Generate unique slug for category
     */
    private function generateUniqueSlug(string $name, ?int $excludeId = null): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while ($this->slugExists($slug, $excludeId)) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Check if slug exists
     */
    private function slugExists(string $slug, ?int $excludeId = null): bool
    {
        $query = Category::where('slug', $slug);
        
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    /**
     * Get category statistics
     */
    public function getCategoryStats(): array
    {
        $categories = $this->categoryRepository->getAllWithCourseCount();
        
        return [
            'total_categories' => $categories->count(),
            'categories_with_courses' => $categories->where('courses_count', '>', 0)->count(),
            'most_popular_category' => $categories->sortByDesc('courses_count')->first(),
            'categories_breakdown' => $categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'courses_count' => $category->courses_count,
                ];
            })->toArray()
        ];
    }
}