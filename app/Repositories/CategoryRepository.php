<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository
{
    /**
     * Get all categories
     */
    public function getAll(): Collection
    {
        return Category::orderBy('name')->get();
    }

    /**
     * Get categories with course count
     */
    public function getAllWithCourseCount(): Collection
    {
        return Category::withCount('courses')
            ->orderBy('name')
            ->get();
    }

    /**
     * Find category by ID
     */
    public function findById(int $id): ?Category
    {
        return Category::find($id);
    }

    /**
     * Find category by slug
     */
    public function findBySlug(string $slug): ?Category
    {
        return Category::where('slug', $slug)->first();
    }

    /**
     * Return the ID for a given slug (or null if not found)
     */
    public function findIdBySlug(?string $slug): ?int
    {
        if (!$slug) {
            return null;
        }

        return Category::where('slug', $slug)->value('id');
    }

    /**
     * Get categories that have courses
     */
    public function getCategoriesWithCourses(): Collection
    {
        return Category::has('courses')
            ->withCount('courses')
            ->orderBy('name')
            ->get();
    }

    /**
     * Create a new category
     */
    public function create(array $data): Category
    {
        return Category::create($data);
    }

    /**
     * Update category
     */
    public function update(int $id, array $data): bool
    {
        return Category::where('id', $id)->update($data);
    }

    /**
     * Delete category
     */
    public function delete(int $id): bool
    {
        return Category::destroy($id) > 0;
    }
}
