<?php

require 'vendor/autoload.php';

$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$course = App\Models\Course::find(10);

if ($course) {
    echo "Course ID: " . $course->id . PHP_EOL;
    echo "Title: " . $course->title . PHP_EOL;
    echo "Price: " . ($course->price ?? 'NULL') . PHP_EOL;
    echo "Is Paid: " . ($course->is_paid ? 'true' : 'false') . PHP_EOL;
    echo "Formatted Price: " . ($course->formatted_price ?? 'NULL') . PHP_EOL;
} else {
    echo "Course not found" . PHP_EOL;
}