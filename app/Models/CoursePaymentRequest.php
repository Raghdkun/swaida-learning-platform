<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class CoursePaymentRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'full_name',
        'phone',
        'email',
        'identity_image',
        'reason',
        'status',
        'admin_note',
    ];

    protected $appends = [
        'identity_image_url',
    ];
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    // Accessors
    public function getIdentityImageUrlAttribute(): ?string
    {
        return $this->identity_image
            ? asset('storage/' . $this->identity_image)
            : null;
    }

    // Scopes (handy for dashboard list)
    public function scopeSearch(Builder $q, ?string $term): Builder
    {
        if (!$term) return $q;

        return $q->where(function ($qq) use ($term) {
            $qq->where('full_name', 'like', "%{$term}%")
               ->orWhere('email', 'like', "%{$term}%")
               ->orWhere('phone', 'like', "%{$term}%")
               ->orWhere('reason', 'like', "%{$term}%");
        });
    }

    public function scopeStatus(Builder $q, ?string $status): Builder
    {
        if (!$status) return $q;
        return $q->where('status', $status);
    }

    public function scopeCourse(Builder $q, $courseId): Builder
    {
        if (!$courseId) return $q;
        return $q->where('course_id', $courseId);
    }
}
