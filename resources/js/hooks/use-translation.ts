import { usePage } from '@inertiajs/react';

export function useTranslation() {
  const { props } = usePage();
  const translations = (props.translations as any)?.translations || {};
  const locale = (props.locale as string) || 'en';

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Handle replacements like :count, :name, etc.
    if (replacements) {
      Object.entries(replacements).forEach(([placeholder, replacement]) => {
        value = value.replace(new RegExp(`:${placeholder}`, 'g'), String(replacement));
      });
    }

    return value;
  };

  const isRTL = locale === 'ar';

  return { t, locale, isRTL };
}
