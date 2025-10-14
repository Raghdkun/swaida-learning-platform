<?php

namespace App\Models\Concerns;

use Illuminate\Support\Facades\App;

trait HasTranslations
{
    protected function currentLocale(): string
    {
        $loc = App::getLocale();
        return in_array($loc, ['en','ar']) ? $loc : 'en';
    }

    public function translations()
    {
        return $this->morphMany(\App\Models\Translation::class, 'translatable');
    }

    protected function translatedValue(string $field, $baseValue): mixed
    {
        $locale = $this->currentLocale();

        if ($locale === 'en') {
            return $baseValue;
        }

        // SAFEST: query by field+locale per-instance to avoid cross-model bleed
        $locValue = $this->translations()
            ->where('field', $field)
            ->where('locale', $locale)
            ->value('value');

        return ($locValue !== null && $locValue !== '') ? $locValue : $baseValue;
    }

    public function getAttribute($key)
    {
        $value = parent::getAttribute($key);

        if (isset($this->translatable) && in_array($key, $this->translatable, true)) {
            return $this->translatedValue($key, $value);
        }

        return $value;
    }

    // Writer for admin forms
    public function setTranslated(string $field, string $locale, ?string $value): void
    {
        if ($locale === 'en') {
            $this->setAttribute($field, $value);
            $this->saveQuietly();
            return;
        }

        if (!isset($this->translatable) || !in_array($field, $this->translatable, true)) {
            throw new \InvalidArgumentException("Field '{$field}' is not declared translatable on ".static::class);
        }

        if ($value === null || $value === '') {
            $this->translations()
                ->where('field', $field)
                ->where('locale', $locale)
                ->delete();
            return;
        }

        $this->translations()->updateOrCreate(
            ['field' => $field, 'locale' => $locale],
            ['value' => $value]
        );
    }
}
