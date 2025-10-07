<?php

namespace App\Repositories;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Collection;

class TagRepository
{
    /**
     * Get all tags
     */
    public function getAll(): Collection
    {
        return Tag::orderBy('name')->get();
    }

    /**
     * Get tags with course count
     */
    public function getAllWithCourseCount(): Collection
    {
        return Tag::withCount('courses')
            ->orderBy('name')
            ->get();
    }

    /**
     * Find tag by ID
     */
    public function findById(int $id): ?Tag
    {
        return Tag::find($id);
    }

    /**
     * Find tag by slug
     */
    public function findBySlug(string $slug): ?Tag
    {
        return Tag::where('slug', $slug)->first();
    }

    /**
     * Get tags that have courses
     */
    public function getTagsWithCourses(): Collection
    {
        return Tag::has('courses')
            ->withCount('courses')
            ->orderBy('name')
            ->get();
    }

    /**
     * Get popular tags (most used)
     */
    public function getPopularTags(int $limit = 10): Collection
    {
        return Tag::withCount('courses')
            ->orderBy('courses_count', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Find tags by IDs
     */
    public function findByIds(array $ids): Collection
    {
        return Tag::whereIn('id', $ids)->get();
    }

    /**
     * Create a new tag
     */
    public function create(array $data): Tag
    {
        return Tag::create($data);
    }

    /**
     * Update tag
     */
    public function update(int $id, array $data): bool
    {
        return Tag::where('id', $id)->update($data);
    }

    /**
     * Delete tag
     */
    public function delete(int $id): bool
    {
        return Tag::destroy($id) > 0;
    }
}