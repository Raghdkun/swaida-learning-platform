<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository
{
    public function getAll(): Collection
    {
        return Category::with('translations')->orderBy('name')->get(); // ← ADDED translations
    }

    public function getAllWithCourseCount(): Collection
    {
        return Category::with('translations') // ← ADDED
            ->withCount('courses')
            ->orderBy('name')
            ->get();
    }

    public function findById(int $id): ?Category
    {
        return Category::with('translations')->find($id); // ← ADDED
    }

    public function findBySlug(string $slug): ?Category
    {
        return Category::with('translations')->where('slug', $slug)->first(); // ← ADDED
    }

    public function findIdBySlug(?string $slug): ?int
    {
        if (!$slug) {
            return null;
        }

        return Category::where('slug', $slug)->value('id');
    }

    public function getCategoriesWithCourses(): Collection
    {
        return Category::has('courses')
            ->with('translations') // ← ADDED
            ->withCount('courses')
            ->orderBy('name')
            ->get();
    }

    public function create(array $data): Category
    {
        return Category::create($data);
    }

    public function update(int $id, array $data): bool
    {
        return Category::where('id', $id)->update($data);
    }

    public function delete(int $id): bool
    {
        return Category::destroy($id) > 0;
    }
}
