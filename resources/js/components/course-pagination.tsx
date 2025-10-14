import { ChevronLeft, ChevronRight, MoreHorizontal, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaginationMeta } from '@/types';
import { useTranslation } from '@/hooks/use-translation';

interface CoursePaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function CoursePagination({ meta, onPageChange, loading = false }: CoursePaginationProps) {
  const { t } = useTranslation();
  const { current_page, last_page, from, to, total } = meta;

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;

    if (last_page <= maxVisiblePages) {
      for (let i = 1; i <= last_page; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current_page > 3) pages.push('...');
      const start = Math.max(2, current_page - 1);
      const end = Math.min(last_page - 1, current_page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (current_page < last_page - 2) pages.push('...');
      if (last_page > 1) pages.push(last_page);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  if (last_page <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-muted/20 to-muted/10 rounded-lg border">
      {/* Results info */}
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        {t('courses.results.showing', { from, to, total }) ||
          `Showing ${from} - ${to} of ${total} results`}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page <= 1 || loading}
          className="flex items-center gap-1 transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{t('pagination.previous') ?? 'Previous'}</span>
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-2">
          {pageNumbers.map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <div className="flex items-center justify-center w-8 h-8">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground animate-pulse" />
                </div>
              ) : (
                <Button
                  variant={current_page === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  disabled={loading}
                  className={`w-8 h-8 p-0 transition-all duration-200 hover:scale-110 active:scale-95 ${
                    current_page === page 
                      ? 'shadow-lg hover:shadow-xl' 
                      : 'hover:border-primary/50 hover:bg-primary/5'
                  }`}
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
          className="flex items-center gap-1 transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
        >
          <span className="hidden sm:inline">{t('pagination.next') ?? 'Next'}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick jump */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Jump to:</span>
        <select 
          className="bg-background border rounded px-2 py-1 text-sm transition-all duration-200 hover:border-primary/50 focus:border-primary"
          value={current_page}
          onChange={(e) => onPageChange(Number(e.target.value))}
          disabled={loading}
        >
          {Array.from({ length: last_page }, (_, i) => i + 1).map(page => (
            <option key={page} value={page}>
              Page {page}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}