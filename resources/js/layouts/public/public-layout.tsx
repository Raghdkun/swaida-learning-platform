import { ReactNode } from 'react';
import { PublicHeader } from './public-header';
import { PublicFooter } from './public-footer';

interface PublicLayoutProps {
    children: ReactNode;
    auth?: {
        user: any;
    };
    className?: string;
}

export default function PublicLayout({ children, auth, className }: PublicLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col ">
            <PublicHeader auth={auth} />
            
            <main className={`flex-1 ${className || ''}`}>
                {children}
            </main>
            
            <PublicFooter />
        </div>
    );
}