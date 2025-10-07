<?php

namespace App\Services;

use App\Repositories\TagRepository;
use App\Models\Tag;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class TagService
{
    public function __construct(
        private TagRepository $tagRepository
    ) {}

    /**
     * Get all tags with course counts
     */
    public function getAllTags(): Collection
    {
        return $this->tagRepository->getAllWithCourseCount();
    }

    /**
     * Get tags that have courses
     */
    public function getTagsWithCourses(): Collection
    {
        return $this->tagRepository->getTagsWithCourses();
    }

    /**
     * Get popular tags
     */
    public function getPopularTags(int $limit = 10): Collection
    {
        return $this->tagRepository->getPopularTags($limit);
    }

    /**
     * Get tag by ID
     */
    public function getTagById(int $id): ?Tag
    {
        return $this->tagRepository->findById($id);
    }

    /**
     * Get tag by slug
     */
    public function getTagBySlug(string $slug): ?Tag
    {
        return $this->tagRepository->findBySlug($slug);
    }

    /**
     * Get tags by IDs
     */
    public function getTagsByIds(array $ids): Collection
    {
        return $this->tagRepository->findByIds($ids);
    }

    /**
     * Create a new tag
     */
    public function createTag(array $data): Tag
    {
        // Generate slug if not provided
        if (!isset($data['slug']) || empty($data['slug'])) {
            $data['slug'] = $this->generateUniqueSlug($data['name']);
        }

        return $this->tagRepository->create($data);
    }

    /**
     * Update tag
     */
    public function updateTag(int $id, array $data): bool
    {
        // Generate slug if name is updated but slug is not provided
        if (isset($data['name']) && (!isset($data['slug']) || empty($data['slug']))) {
            $data['slug'] = $this->generateUniqueSlug($data['name'], $id);
        }

        return $this->tagRepository->update($id, $data);
    }

    /**
     * Delete tag
     */
    public function deleteTag(int $id): bool
    {
        return $this->tagRepository->delete($id);
    }

    /**
     * Generate unique slug for tag
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
        $query = Tag::where('slug', $slug);
        
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    /**
     * Get tag statistics
     */
    public function getTagStats(): array
    {
        $tags = $this->tagRepository->getAllWithCourseCount();
        
        return [
            'total_tags' => $tags->count(),
            'tags_with_courses' => $tags->where('courses_count', '>', 0)->count(),
            'most_popular_tag' => $tags->sortByDesc('courses_count')->first(),
            'popular_tags' => $this->getPopularTags(10)->map(function ($tag) {
                return [
                    'id' => $tag->id,
                    'name' => $tag->name,
                    'slug' => $tag->slug,
                    'courses_count' => $tag->courses_count,
                ];
            })->toArray()
        ];
    }

    /**
     * Create multiple tags from array of names
     */
    public function createMultipleTags(array $tagNames): Collection
    {
        $tags = collect();
        
        foreach ($tagNames as $name) {
            $name = trim($name);
            if (empty($name)) {
                continue;
            }

            // Check if tag already exists
            $existingTag = $this->tagRepository->findBySlug(Str::slug($name));
            
            if ($existingTag) {
                $tags->push($existingTag);
            } else {
                $newTag = $this->createTag(['name' => $name]);
                $tags->push($newTag);
            }
        }

        return $tags;
    }
}