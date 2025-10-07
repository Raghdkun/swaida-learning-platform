import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { PaginatedData } from '@/types';

interface DashboardPaginationProps<T> {
    data: PaginatedData<T>;
    loading?: boolean;
}

export function DashboardPagination<T>({ data, loading = false }: DashboardPaginationProps<T>) {
    const { current_page, last_page, from, to, total, links } = data;

    const generatePageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 7;
        
        if (last_page <= maxVisiblePages) {
            for (let i = 1; i <= last_page; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            
            if (current_page > 3) {
                pages.push('...');
            }
            
            const start = Math.max(2, current_page - 1);
            const end = Math.min(last_page - 1, current_page + 1);
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            if (current_page < last_page - 2) {
                pages.push('...');
            }
            
            if (last_page > 1) {
                pages.push(last_page);
            }
        }
        
        return pages;
    };

    const getPageUrl = (page: number): string | null => {
        const pageLink = links.find(link => link.label === page.toString());
        return pageLink?.url || null;
    };

    const renderPageButton = (page: number | string, index: number) => {
        if (page === '...') {
            return (
                <div key={index} className="flex items-center justify-center w-8 h-8">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </div>
            );
        }

        const pageNumber = page as number;
        const pageUrl = getPageUrl(pageNumber);
        const isCurrentPage = current_page === pageNumber;

        if (isCurrentPage) {
            return (
                <Button
                    key={index}
                    variant="default"
                    size="sm"
                    disabled
                    className="w-8 h-8 p-0"
                >
                    {page}
                </Button>
            );
        }

        if (pageUrl) {
            return (
                <Link key={index} href={pageUrl} preserveState>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={loading}
                        className="w-8 h-8 p-0"
                    >
                        {page}
                    </Button>
                </Link>
            );
        }

        return (
            <Button
                key={index}
                variant="outline"
                size="sm"
                disabled
                className="w-8 h-8 p-0"
            >
                {page}
            </Button>
        );
    };

    if (last_page <= 1) {
        return null;
    }

    const pageNumbers = generatePageNumbers();
    const prevUrl = data.prev_page_url;
    const nextUrl = data.next_page_url;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            <div className="text-sm text-muted-foreground">
                Showing {from} to {to} of {total} results
            </div>

            <div className="flex items-center gap-1">
                {prevUrl ? (
                    <Link href={prevUrl} preserveState>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={loading}
                            className="flex items-center gap-1"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                    </Link>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="flex items-center gap-1"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                )}

                <div className="flex items-center gap-1 mx-2">
                    {pageNumbers.map((page, index) => renderPageButton(page, index))}
                </div>

                {nextUrl ? (
                    <Link href={nextUrl} preserveState>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={loading}
                            className="flex items-center gap-1"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </Link>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="flex items-center gap-1"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}