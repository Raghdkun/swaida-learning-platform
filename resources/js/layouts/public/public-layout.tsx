import { ReactNode } from 'react';
import { PublicHeader } from './public-header';
import { PublicFooter } from './public-footer';
import { useTranslation } from '@/hooks/use-translation';

interface PublicLayoutProps {
    children: ReactNode;
    auth?: {
        user: any;
    };
    className?: string;
}

export default function PublicLayout({ children, auth, className }: PublicLayoutProps) {
    const { isRTL } = useTranslation();

    return (
        <div 
            className="min-h-screen flex flex-col" 
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <PublicHeader auth={auth} />
            
            <main className={`flex-1 ${className || ''}`}>
                {children}
            </main>
            
            <PublicFooter />
        </div>
    );
}
