import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaginationMeta } from '@/types';

interface CoursePaginationProps {
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
    loading?: boolean;
}

export function CoursePagination({ meta, onPageChange, loading = false }: CoursePaginationProps) {
    const { current_page, last_page, from, to, total } = meta;

    const generatePageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 7;
        
        if (last_page <= maxVisiblePages) {
            // Show all pages if total pages is small
            for (let i = 1; i <= last_page; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            if (current_page > 3) {
                pages.push('...');
            }
            
            // Show pages around current page
            const start = Math.max(2, current_page - 1);
            const end = Math.min(last_page - 1, current_page + 1);
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            if (current_page < last_page - 2) {
                pages.push('...');
            }
            
            // Always show last page
            if (last_page > 1) {
                pages.push(last_page);
            }
        }
        
        return pages;
    };

    const pageNumbers = generatePageNumbers();

    if (last_page <= 1) {
        return null;
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Results info */}
            <div className="text-sm text-muted-foreground">
                Showing {from} to {to} of {total} results
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-1">
                {/* Previous button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(current_page - 1)}
                    disabled={current_page <= 1 || loading}
                    className="flex items-center gap-1"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1 mx-2">
                    {pageNumbers.map((page, index) => (
                        <div key={index}>
                            {page === '...' ? (
                                <div className="flex items-center justify-center w-8 h-8">
                                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                </div>
                            ) : (
                                <Button
                                    variant={current_page === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onPageChange(page as number)}
                                    disabled={loading}
                                    className="w-8 h-8 p-0"
                                >
                                    {page}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Next button */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(current_page + 1)}
                    disabled={current_page >= last_page || loading}
                    className="flex items-center gap-1"
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}