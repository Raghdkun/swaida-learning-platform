<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Course extends Model
{
    protected $fillable = [
        'title',
        'description',
        'external_url',
        'duration',
        'platform',
        'image',
        'category_id',
        'have_cert',
        'level',
        'price',
    ];

    protected $casts = [
        'have_cert' => 'boolean',
        'price'     => 'float',
    ];

    protected $appends = [
        'image_url',
        'is_paid',
        'formatted_price',
    ];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }

    public function getIsPaidAttribute(): bool
    {
        return $this->price !== null && $this->price > 0;
    }

    public function getFormattedPriceAttribute(): ?string
    {
        return $this->price ? number_format($this->price, 0) . ' USD' : null;
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }
}
