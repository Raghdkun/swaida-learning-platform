import { router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageSwitcherProps {
  currentLocale: string;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const page = usePage();
  const actualLocale = (page.props.locale as string) || currentLocale;
  
  // DEBUG - Remove these after checking
  console.log('LanguageSwitcher Props:', {
    currentLocale,
    pagePropsLocale: page.props.locale,
    actualLocale,
    allProps: page.props
  });
  
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  ];

  const handleLanguageChange = (locale: string) => {
    console.log('Switching to:', locale);
    router.post(
      '/language',
      { locale },
      {
        preserveState: false,
        preserveScroll: false,
        onSuccess: () => {
          console.log('Language switched successfully');
        },
        onError: (errors) => {
          console.error('Language switch error:', errors);
        }
      }
    );
  };

  const currentLanguage = languages.find((lang) => lang.code === actualLocale) || languages[0];

  console.log('Current language object:', currentLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
          <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => {
          const isActive = actualLocale === language.code;
          console.log(`Language ${language.code} - Active: ${isActive}, actualLocale: ${actualLocale}`);
          
          return (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={isActive ? 'bg-accent font-semibold' : ''}
              disabled={isActive}
            >
              <span className="mr-2">{language.nativeName}</span>
              {isActive && (
                <span className="ml-auto text-xs text-muted-foreground">✓</span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
