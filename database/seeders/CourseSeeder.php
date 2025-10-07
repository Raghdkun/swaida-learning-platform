<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create categories
        $categories = [
            ['name' => 'Web Development', 'slug' => 'web-development'],
            ['name' => 'Data Science', 'slug' => 'data-science'],
            ['name' => 'Mobile Development', 'slug' => 'mobile-development'],
            ['name' => 'DevOps', 'slug' => 'devops'],
            ['name' => 'Design', 'slug' => 'design'],
            ['name' => 'Business', 'slug' => 'business'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // Create tags
        $tags = [
            ['name' => 'JavaScript', 'slug' => 'javascript'],
            ['name' => 'React', 'slug' => 'react'],
            ['name' => 'Vue.js', 'slug' => 'vuejs'],
            ['name' => 'Node.js', 'slug' => 'nodejs'],
            ['name' => 'Python', 'slug' => 'python'],
            ['name' => 'Django', 'slug' => 'django'],
            ['name' => 'Laravel', 'slug' => 'laravel'],
            ['name' => 'PHP', 'slug' => 'php'],
            ['name' => 'Machine Learning', 'slug' => 'machine-learning'],
            ['name' => 'AI', 'slug' => 'ai'],
            ['name' => 'Flutter', 'slug' => 'flutter'],
            ['name' => 'React Native', 'slug' => 'react-native'],
            ['name' => 'Docker', 'slug' => 'docker'],
            ['name' => 'AWS', 'slug' => 'aws'],
            ['name' => 'Figma', 'slug' => 'figma'],
            ['name' => 'Photoshop', 'slug' => 'photoshop'],
        ];

        foreach ($tags as $tag) {
            Tag::create($tag);
        }

        // Create courses
        $courses = [
            [
                'title' => 'Complete React Developer Course',
                'description' => 'Master React from basics to advanced concepts including hooks, context, and testing.',
                'external_url' => 'https://example.com/react-course',
                'image_url' => 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
                'duration' => '40 hours',
                'level' => 'intermediate',
                'platform' => 'Udemy',
                'have_cert' => true,
                'category_id' => 1,
                'tags' => [1, 2], // JavaScript, React
            ],
            [
                'title' => 'Python for Data Science',
                'description' => 'Learn Python programming specifically for data analysis and machine learning.',
                'external_url' => 'https://example.com/python-data-science',
                'image_url' => 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
                'duration' => '35 hours',
                'level' => 'beginner',
                'platform' => 'Coursera',
                'have_cert' => true,
                'category_id' => 2,
                'tags' => [5, 9], // Python, Machine Learning
            ],
            [
                'title' => 'Flutter Mobile App Development',
                'description' => 'Build beautiful cross-platform mobile apps with Flutter and Dart.',
                'external_url' => 'https://example.com/flutter-course',
                'image_url' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
                'duration' => '30 hours',
                'level' => 'intermediate',
                'platform' => 'Udemy',
                'have_cert' => true,
                'category_id' => 3,
                'tags' => [11], // Flutter
            ],
            [
                'title' => 'Docker and Kubernetes Masterclass',
                'description' => 'Master containerization and orchestration with Docker and Kubernetes.',
                'external_url' => 'https://example.com/docker-kubernetes',
                'image_url' => 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400',
                'duration' => '25 hours',
                'level' => 'advanced',
                'platform' => 'Pluralsight',
                'have_cert' => true,
                'category_id' => 4,
                'tags' => [13, 14], // Docker, AWS
            ],
            [
                'title' => 'UI/UX Design with Figma',
                'description' => 'Learn modern UI/UX design principles and master Figma for prototyping.',
                'external_url' => 'https://example.com/figma-design',
                'image_url' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
                'duration' => '20 hours',
                'level' => 'beginner',
                'platform' => 'Skillshare',
                'have_cert' => false,
                'category_id' => 5,
                'tags' => [15], // Figma
            ],
            [
                'title' => 'Laravel Web Development',
                'description' => 'Build modern web applications with Laravel PHP framework.',
                'external_url' => 'https://example.com/laravel-course',
                'image_url' => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
                'duration' => '45 hours',
                'level' => 'intermediate',
                'platform' => 'Laracasts',
                'have_cert' => false,
                'category_id' => 1,
                'tags' => [7, 8], // Laravel, PHP
            ],
            [
                'title' => 'Vue.js Complete Guide',
                'description' => 'Master Vue.js framework for building interactive web applications.',
                'external_url' => 'https://example.com/vue-course',
                'image_url' => 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
                'duration' => '32 hours',
                'level' => 'beginner',
                'platform' => 'Vue Mastery',
                'have_cert' => true,
                'category_id' => 1,
                'tags' => [1, 3], // JavaScript, Vue.js
            ],
            [
                'title' => 'Business Strategy Fundamentals',
                'description' => 'Learn essential business strategy concepts for entrepreneurs and managers.',
                'external_url' => 'https://example.com/business-strategy',
                'image_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                'duration' => '15 hours',
                'level' => 'beginner',
                'platform' => 'edX',
                'have_cert' => true,
                'category_id' => 6,
                'tags' => [],
            ],
        ];

        foreach ($courses as $courseData) {
            $tags = $courseData['tags'] ?? [];
            unset($courseData['tags']);
            
            $course = Course::create($courseData);
            
            if (!empty($tags)) {
                $course->tags()->attach($tags);
            }
        }
    }
}
