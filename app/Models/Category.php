<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\CastsTranslatable;

class Category extends Model
{
    use HasTranslations, CastsTranslatable; // <-- REQUIRED
    protected $fillable = [
        'name',
        'slug',
    ];
    protected array $translatable = ['name'];

    public function translations()
    {
        return $this->morphMany(\App\Models\Translation::class, 'translatable');
    }
    /**
     * Get the courses for the category.
     */
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }
}
