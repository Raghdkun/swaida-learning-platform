<?php

namespace App\Models\Concerns;

trait CastsTranslatable
{
    public function attributesToArray(): array
    {
        $array = parent::attributesToArray();

        if (property_exists($this, 'translatable') && is_array($this->translatable)) {
            foreach ($this->translatable as $field) {
                if (array_key_exists($field, $array)) {
                    // Force accessor resolution during array casting
                    $array[$field] = $this->getAttribute($field);
                }
            }
        }

        return $array;
    }
}
