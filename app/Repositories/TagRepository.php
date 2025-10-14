<?php

namespace App\Repositories;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Collection;

class TagRepository
{
    public function getAll(): Collection
    {
        return Tag::with('translations')->orderBy('name')->get(); // ← ADDED
    }

    public function getAllWithCourseCount(): Collection
    {
        return Tag::with('translations') // ← ADDED
            ->withCount('courses')
            ->orderBy('name')
            ->get();
    }

    public function findById(int $id): ?Tag
    {
        return Tag::with('translations')->find($id); // ← ADDED
    }

    public function findBySlug(string $slug): ?Tag
    {
        return Tag::with('translations')->where('slug', $slug)->first(); // ← ADDED
    }

    public function findIdsBySlugs(array $slugs): array
    {
        if (empty($slugs)) {
            return [];
        }

        return Tag::whereIn('slug', $slugs)->pluck('id')->all();
    }

    public function getTagsWithCourses(): Collection
    {
        return Tag::has('courses')
            ->with('translations') // ← ADDED
            ->withCount('courses')
            ->orderBy('name')
            ->get();
    }

    public function getPopularTags(int $limit = 10): Collection
    {
        return Tag::with('translations') // ← ADDED
            ->withCount('courses')
            ->orderBy('courses_count', 'desc')
            ->limit($limit)
            ->get();
    }

    public function findByIds(array $ids): Collection
    {
        return Tag::with('translations')->whereIn('id', $ids)->get(); // ← ADDED
    }

    public function create(array $data): Tag
    {
        return Tag::create($data);
    }

    public function update(int $id, array $data): bool
    {
        return Tag::where('id', $id)->update($data);
    }

    public function delete(int $id): bool
    {
        return Tag::destroy($id) > 0;
    }
}
