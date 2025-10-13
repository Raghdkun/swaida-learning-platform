import { useState } from 'react';
import { Search, Filter, X, ChevronDown, DollarSign, Award, BookOpen, Tag as TagIcon } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(true); // Default open for sidebar

  const handleSearchChange = (value: string) => onFiltersChange({ search: value || undefined });

  const handleCategoryChange = (value: string) =>
    onFiltersChange({ category: value === 'all' ? undefined : value });

  const handlePlatformChange = (value: string) =>
    onFiltersChange({ platform: value === 'all' ? undefined : value });

  const handleLevelChange = (value: string) =>
    onFiltersChange({ level: value === 'all' ? undefined : (value as any) });

  const handleCourseTypeChange = (value: string) =>
    onFiltersChange({ course_type: value === 'all' ? undefined : (value as 'free' | 'paid') });

  const handleCertificateChange = (checked: boolean) =>
    onFiltersChange({ have_cert: checked ? true : undefined });

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
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
          <Label className="text-sm font-medium">{t('common.search')}</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('filters.search_placeholder')}
              value={filters?.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 h-10 text-sm border focus:border-primary/50"
              disabled={loading}
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="space-y-4">
          {/* Course Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t('filters.course_type.label')}</Label>
            <Select value={filters?.course_type || 'all'} onValueChange={handleCourseTypeChange} disabled={loading}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder={t('filters.course_type.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.course_type.all')}</SelectItem>
                <SelectItem value="free">
                  <div className="flex items-center justify-between w-full">
                    <span>{t('filters.course_type.free')}</span>
                    {!!filterOptions?.course_types?.free && (
                      <Badge variant="secondary" className="text-xs ml-2">
                        {filterOptions.course_types.free}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
                <SelectItem value="paid">
                  <div className="flex items-center justify-between w-full">
                    <span>{t('filters.course_type.paid')}</span>
                    {!!filterOptions?.course_types?.paid && (
                      <Badge variant="secondary" className="text-xs ml-2">
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
            <Label className="text-sm font-medium">{t('filters.category.label')}</Label>
            <Select
              value={filters?.category || 'all'}
              onValueChange={handleCategoryChange}
              disabled={loading || !filterOptions?.categories?.length}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder={t('sidebar_filters.all_categories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('sidebar_filters.all_categories')}</SelectItem>
                {filterOptions?.categories?.map((c) => (
                  <SelectItem key={c.id} value={c.slug}>
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
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder={t('sidebar_filters.all_platforms')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('sidebar_filters.all_platforms')}</SelectItem>
                {filterOptions?.platforms?.map((p) => (
                  <SelectItem key={p} value={p}>
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
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder={t('sidebar_filters.all_levels')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('sidebar_filters.all_levels')}</SelectItem>
                <SelectItem value="beginner">{t('filters.level.beginner')}</SelectItem>
                <SelectItem value="intermediate">{t('filters.level.intermediate')}</SelectItem>
                <SelectItem value="advanced">{t('filters.level.advanced')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Additional Options */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between h-8 text-sm font-normal">
              <span>{t('filters.more_options')}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-4 pt-2">
            {/* Certificate */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="certificate-sidebar"
                  checked={!!filters?.have_cert}
                  onCheckedChange={(v: boolean) => handleCertificateChange(!!v)}
                  disabled={loading}
                  className="h-4 w-4"
                />
                <Label htmlFor="certificate-sidebar" className="text-sm font-medium cursor-pointer flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {t('filters.certificate.checkbox_label')}
                </Label>
              </div>
            </div>

            {/* Tags */}
            {!!filterOptions?.tags?.length && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('sidebar_filters.popular_tags')}</Label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
                  {filterOptions.tags.map((tag) => {
                    const active = !!filters?.tags?.includes(tag.slug);
                    return (
                      <Badge
                        key={tag.id}
                        variant={active ? 'default' : 'outline'}
                        className={`cursor-pointer text-xs px-2 py-1 ${
                          active ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10 hover:border-primary/50'
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
            className="w-full border-dashed"
            disabled={loading}
          >
            <X className="h-4 w-4 mr-2" />
            {t('sidebar_filters.clear_filters')}
          </Button>
        )}
      </div>
    );
  }

  // Full-width variant
  return (
    <>
      <div className="space-y-6">
        {/* Search */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-background to-muted/20">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder={t('filters.search_placeholder')}
                value={filters?.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-12 h-14 text-base border-2 focus:border-primary/50 bg-background/80 backdrop-blur-sm"
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Toggle */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Filter className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{t('filters.advanced_filters')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('filters.refine_search')}
                      </p>
                    </div>
                    {!!activeCount && (
                      <Badge variant="default" className="ml-2 px-3 py-1 bg-primary text-primary-foreground">
                        {t('filters.active', { count: activeCount })}
                      </Badge>
                    )}
                  </div>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </CardContent>
            </Card>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-6">
            <Card className="border-2 shadow-lg">
              <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    {t('filters.filter_options')}
                  </CardTitle>
                  {!!activeCount && (
                    <Button variant="outline" size="sm" onClick={onResetFilters} className="border-dashed">
                      <X className="h-4 w-4 mr-2" />
                      {t('courses.filters.clear_all') || t('courses.filters.clear') || t('sidebar_filters.clear_filters')}
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-8">
                {/* Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Course Type */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      {t('filters.course_type.label')}
                    </Label>
                    <Select value={filters?.course_type || 'all'} onValueChange={handleCourseTypeChange} disabled={loading}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={t('filters.course_type.all')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('filters.course_type.all')}</SelectItem>
                        <SelectItem value="free">
                          <div className="flex items-center gap-2">
                            <span>{t('filters.course_type.free')}</span>
                            {!!filterOptions?.course_types?.free && (
                              <Badge variant="secondary" className="text-xs">
                                {filterOptions.course_types.free}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                        <SelectItem value="paid">
                          <div className="flex items-center gap-2">
                            <span>{t('filters.course_type.paid')}</span>
                            {!!filterOptions?.course_types?.paid && (
                              <Badge variant="secondary" className="text-xs">
                                {filterOptions.course_types.paid}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Category */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      {t('filters.category.label')}
                    </Label>
                    <Select
                      value={filters?.category || 'all'}
                      onValueChange={handleCategoryChange}
                      disabled={loading || !filterOptions?.categories?.length}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={t('sidebar_filters.all_categories')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('sidebar_filters.all_categories')}</SelectItem>
                        {filterOptions?.categories?.map((c) => (
                          <SelectItem key={c.id} value={c.slug}>
                            <div className="flex items-center justify-between w-full">
                              <span>{c.name}</span>
                              {typeof c.courses_count === 'number' && (
                                <Badge variant="secondary" className="text-xs ml-2">
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
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">{t('filters.platform.label')}</Label>
                    <Select
                      value={filters?.platform || 'all'}
                      onValueChange={handlePlatformChange}
                      disabled={loading || !filterOptions?.platforms?.length}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={t('sidebar_filters.all_platforms')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('sidebar_filters.all_platforms')}</SelectItem>
                        {filterOptions?.platforms?.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Level */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">{t('filters.level.label')}</Label>
                    <Select value={filters?.level || 'all'} onValueChange={handleLevelChange} disabled={loading}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={t('sidebar_filters.all_levels')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('sidebar_filters.all_levels')}</SelectItem>
                        <SelectItem value="beginner">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 border">
                            {t('filters.level.beginner')}
                          </Badge>
                        </SelectItem>
                        <SelectItem value="intermediate">
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 border">
                            {t('filters.level.intermediate')}
                          </Badge>
                        </SelectItem>
                        <SelectItem value="advanced">
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            {t('filters.level.advanced')}
                          </Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Certificate */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    {t('filters.certificate.label')}
                  </Label>
                  <Card className="p-4 bg-muted/30 border-dashed">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="certificate"
                        checked={!!filters?.have_cert}
                        onCheckedChange={(v: boolean) => handleCertificateChange(!!v)}
                        disabled={loading}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label htmlFor="certificate" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        {t('filters.certificate.checkbox_label')}
                      </Label>
                    </div>
                  </Card>
                </div>

                {/* Tags */}
                {!!filterOptions?.tags?.length && (
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <TagIcon className="h-4 w-4 text-primary" />
                      {t('filters.tags.label')}
                    </Label>
                    <Card className="p-4 bg-muted/20 border-dashed">
                      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                        {filterOptions.tags.map((tag) => {
                          const active = !!filters?.tags?.includes(tag.slug);
                          return (
                            <Badge
                              key={tag.id}
                              variant={active ? 'default' : 'outline'}
                              className={`cursor-pointer transition-all duration-200 text-sm px-3 py-2 hover:scale-105 ${
                                active ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-primary/10 hover:border-primary/50'
                              }`}
                              onClick={() => handleTagToggle(tag.slug)}
                            >
                              {tag.name}
                              {typeof tag.courses_count === 'number' && (
                                <span className="ml-2 text-xs opacity-70 bg-background/20 px-1.5 py-0.5 rounded">
                                  {tag.courses_count}
                                </span>
                              )}
                            </Badge>
                          );
                        })}
                      </div>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Active filters bar */}
      {!!activeCount && (
        <Card className="border-l-4 border-l-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    {t('courses.filters.active_filters')}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {t('filters.active', { count: activeCount })}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={onResetFilters} className="text-xs h-7 px-3">
                  <X className="h-3 w-3 mr-1" />
                  {t('courses.filters.clear')}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {filters?.search && (
                  <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border">
                    <Search className="h-3 w-3" />
                    <span className="text-xs font-medium">{t('common.search')}:</span>
                    <span className="text-xs">
                      {filters.search.length > 20 ? `${filters.search.substring(0, 20)}...` : filters.search}
                    </span>
                    <X className="h-3 w-3 cursor-pointer" onClick={() => onFiltersChange({ search: undefined })} />
                  </Badge>
                )}
                {filters?.course_type && (
                  <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border">
                    <DollarSign className="h-3 w-3" />
                    <span className="text-xs font-medium">{t('filters.course_type.label')}:</span>
                    <span className="text-xs capitalize">{filters.course_type}</span>
                    <X className="h-3 w-3 cursor-pointer" onClick={() => onFiltersChange({ course_type: undefined })} />
                  </Badge>
                )}
                {filters?.category && (
                  <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border">
                    <BookOpen className="h-3 w-3" />
                    <span className="text-xs font-medium">{t('filters.category.label')}:</span>
                    <span className="text-xs">
                      {filterOptions?.categories?.find((c) => c.slug === filters.category)?.name ?? filters.category}
                    </span>
                    <X className="h-3 w-3 cursor-pointer" onClick={() => onFiltersChange({ category: undefined })} />
                  </Badge>
                )}
                {filters?.platform && (
                  <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border">
                    <span className="text-xs font-medium">{t('filters.platform.label')}:</span>
                    <span className="text-xs">{filters.platform}</span>
                    <X className="h-3 w-3 cursor-pointer" onClick={() => onFiltersChange({ platform: undefined })} />
                  </Badge>
                )}
                {filters?.level && (
                  <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border">
                    <span className="text-xs font-medium">{t('filters.level.label')}:</span>
                    <span className="text-xs capitalize">{filters.level}</span>
                    <X className="h-3 w-3 cursor-pointer" onClick={() => onFiltersChange({ level: undefined })} />
                  </Badge>
                )}
                {filters?.have_cert && (
                  <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border">
                    <Award className="h-3 w-3" />
                    <span className="text-xs">{t('filters.with_certificate')}</span>
                    <X className="h-3 w-3 cursor-pointer" onClick={() => onFiltersChange({ have_cert: undefined })} />
                  </Badge>
                )}
                {!!filters?.tags?.length && (
                  <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border">
                    <TagIcon className="h-3 w-3" />
                    <span className="text-xs font-medium">{t('filters.tags.label')}:</span>
                    <span className="text-xs">{filters.tags.length} {t('filters.selected', { count: filters.tags.length })}</span>
                    <X className="h-3 w-3 cursor-pointer" onClick={() => onFiltersChange({ tags: undefined })} />
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default SidebarCourseFilters;
