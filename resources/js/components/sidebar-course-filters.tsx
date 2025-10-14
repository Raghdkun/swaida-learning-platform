import { useState } from 'react';
import { Search, Filter, X, ChevronDown, DollarSign, Award, BookOpen, Tag as TagIcon, Sparkles, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import type { CourseFilters, FilterOptions } from '@/types';
import { useTranslation } from '@/hooks/use-translation';

interface Props {
  filters: CourseFilters;
  filterOptions: FilterOptions | null;
  onFiltersChange: (filters: Partial<CourseFilters>) => void;
  onResetFilters: () => void;
  loading?: boolean;
  variant?: 'sidebar' | 'full';
}

function SidebarCourseFilters({
  filters,
  filterOptions,
  onFiltersChange,
  onResetFilters,
  loading = false,
  variant = 'sidebar',
}: Props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);

  const handleSearchChange = (value: string) => onFiltersChange({ search: value || undefined });
  const handleCategoryChange = (value: string) => onFiltersChange({ category: value === 'all' ? undefined : value });
  const handlePlatformChange = (value: string) => onFiltersChange({ platform: value === 'all' ? undefined : value });
  const handleLevelChange = (value: string) => onFiltersChange({ level: value === 'all' ? undefined : (value as any) });
  const handleCourseTypeChange = (value: string) => onFiltersChange({ course_type: value === 'all' ? undefined : (value as 'free' | 'paid') });
  const handleCertificateChange = (checked: boolean) => onFiltersChange({ have_cert: checked ? true : undefined });

  const handleTagToggle = (tagSlug: string) => {
    const current = filters?.tags || [];
    const next = current.includes(tagSlug)
      ? current.filter((t) => t !== tagSlug)
      : [...current, tagSlug];
    onFiltersChange({ tags: next.length ? next : undefined });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters?.search) count++;
    if (filters?.category) count++;
    if (filters?.platform) count++;
    if (filters?.level) count++;
    if (filters?.course_type) count++;
    if (filters?.have_cert) count++;
    if (filters?.tags?.length) count++;
    if (filters?.min_price !== undefined || filters?.max_price !== undefined) count++;
    if (filters?.sort) count++;
    return count;
  };

  const activeCount = getActiveFiltersCount();

  // Sidebar variant - simplified and optimized for narrow layout
  if (variant === 'sidebar') {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary animate-pulse" />
            <h3 className="font-semibold text-lg">{t('sidebar_filters.filters')}</h3>
          </div>
          {activeCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {t('filters.active', { count: activeCount })}
            </Badge>
          )}
        </div>

        {/* Search */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            {t('common.search')}
          </Label>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors duration-200 group-focus-within:text-primary" />
            <Input
              placeholder={t('filters.search_placeholder')}
              value={filters?.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 h-10 text-sm border focus:border-primary/50 transition-all duration-200 group-focus-within:scale-105"
              disabled={loading}
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="space-y-4">
          {/* Course Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              {t('filters.course_type.label')}
            </Label>
            <Select value={filters?.course_type || 'all'} onValueChange={handleCourseTypeChange} disabled={loading}>
              <SelectTrigger className="h-9 text-sm transition-all duration-200 hover:border-primary/50 hover:scale-105">
                <SelectValue placeholder={t('filters.course_type.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="transition-colors duration-150 hover:bg-primary/10">
                  {t('filters.course_type.all')}
                </SelectItem>
                <SelectItem value="free" className="transition-colors duration-150 hover:bg-green-50">
                  <div className="flex items-center justify-between w-full">
                    <span>{t('filters.course_type.free')}</span>
                    {!!filterOptions?.course_types?.free && (
                      <Badge variant="secondary" className="text-xs ml-2 bg-green-100 text-green-700">
                        {filterOptions.course_types.free}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
                <SelectItem value="paid" className="transition-colors duration-150 hover:bg-blue-50">
                  <div className="flex items-center justify-between w-full">
                    <span>{t('filters.course_type.paid')}</span>
                    {!!filterOptions?.course_types?.paid && (
                      <Badge variant="secondary" className="text-xs ml-2 bg-blue-100 text-blue-700">
                        {filterOptions.course_types.paid}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              {t('filters.category.label')}
            </Label>
            <Select
              value={filters?.category || 'all'}
              onValueChange={handleCategoryChange}
              disabled={loading || !filterOptions?.categories?.length}
            >
              <SelectTrigger className="h-9 text-sm transition-all duration-200 hover:border-primary/50 hover:scale-105">
                <SelectValue placeholder={t('sidebar_filters.all_categories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="transition-colors duration-150 hover:bg-primary/10">
                  {t('sidebar_filters.all_categories')}
                </SelectItem>
                {filterOptions?.categories?.map((c) => (
                  <SelectItem key={c.id} value={c.slug} className="transition-colors duration-150 hover:bg-primary/10">
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate">{c.name}</span>
                      {typeof c.courses_count === 'number' && (
                        <Badge variant="secondary" className="text-xs ml-2 shrink-0">
                          {c.courses_count}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Platform */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t('filters.platform.label')}</Label>
            <Select
              value={filters?.platform || 'all'}
              onValueChange={handlePlatformChange}
              disabled={loading || !filterOptions?.platforms?.length}
            >
              <SelectTrigger className="h-9 text-sm transition-all duration-200 hover:border-primary/50 hover:scale-105">
                <SelectValue placeholder={t('sidebar_filters.all_platforms')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="transition-colors duration-150 hover:bg-primary/10">
                  {t('sidebar_filters.all_platforms')}
                </SelectItem>
                {filterOptions?.platforms?.map((p) => (
                  <SelectItem key={p} value={p} className="transition-colors duration-150 hover:bg-primary/10">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Level */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t('filters.level.label')}</Label>
            <Select value={filters?.level || 'all'} onValueChange={handleLevelChange} disabled={loading}>
              <SelectTrigger className="h-9 text-sm transition-all duration-200 hover:border-primary/50 hover:scale-105">
                <SelectValue placeholder={t('sidebar_filters.all_levels')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="transition-colors duration-150 hover:bg-primary/10">
                  {t('sidebar_filters.all_levels')}
                </SelectItem>
                <SelectItem value="beginner" className="transition-colors duration-150 hover:bg-green-50">
                  {t('filters.level.beginner')}
                </SelectItem>
                <SelectItem value="intermediate" className="transition-colors duration-150 hover:bg-yellow-50">
                  {t('filters.level.intermediate')}
                </SelectItem>
                <SelectItem value="advanced" className="transition-colors duration-150 hover:bg-red-50">
                  {t('filters.level.advanced')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Additional Options */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between h-8 text-sm font-normal transition-all duration-200 hover:bg-primary/5 hover:scale-105">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                {t('filters.more_options')}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-4 pt-2 animate-in fade-in-50 duration-300">
            {/* Certificate */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 group cursor-pointer p-2 rounded-lg hover:bg-primary/5 transition-all duration-200">
                <Checkbox
                  id="certificate-sidebar"
                  checked={!!filters?.have_cert}
                  onCheckedChange={(v: boolean) => handleCertificateChange(!!v)}
                  disabled={loading}
                  className="h-4 w-4 transition-all duration-200 group-hover:scale-110 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="certificate-sidebar" className="text-sm font-medium cursor-pointer flex items-center gap-1 transition-colors duration-200 group-hover:text-primary">
                  <Award className="h-3 w-3 transition-transform duration-200 group-hover:scale-110" />
                  {t('filters.certificate.checkbox_label')}
                </Label>
              </div>
            </div>

            {/* Tags */}
            {!!filterOptions?.tags?.length && (
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <TagIcon className="h-4 w-4 text-primary" />
                  {t('sidebar_filters.popular_tags')}
                </Label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
                  {filterOptions.tags.map((tag) => {
                    const active = !!filters?.tags?.includes(tag.slug);
                    return (
                      <Badge
                        key={tag.id}
                        variant={active ? 'default' : 'outline'}
                        className={`cursor-pointer text-xs px-2 py-1 transition-all duration-200 hover:scale-110 active:scale-95 ${
                          active 
                            ? 'bg-primary text-primary-foreground shadow-lg animate-pulse' 
                            : 'hover:bg-primary/10 hover:border-primary/50 hover:text-primary'
                        }`}
                        onClick={() => handleTagToggle(tag.slug)}
                      >
                        {tag.name}
                        {typeof tag.courses_count === 'number' && (
                          <span className="ml-1 text-xs opacity-70">({tag.courses_count})</span>
                        )}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Reset Button */}
        {activeCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="w-full border-dashed hover:bg-destructive/5 hover:border-destructive/20 hover:text-destructive transition-all duration-200 hover:scale-105 active:scale-95"
            disabled={loading}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('sidebar_filters.clear_filters')}
          </Button>
        )}
      </div>
    );
  }

  // Full-width variant remains the same as enhanced version above
  // ... (include the full-width variant from the enhanced course-filters.tsx)
}

export default SidebarCourseFilters;