<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Concerns\CastsTranslatable;
class Tag extends Model
{
    use HasTranslations, CastsTranslatable;
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
     * Get the courses that belong to the tag.
     */
    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class);
    }
}
