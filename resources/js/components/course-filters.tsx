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
}

function CourseFiltersComponent({
  filters,
  filterOptions,
  onFiltersChange,
  onResetFilters,
  loading = false,
}: Props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (value: string) => onFiltersChange({ search: value || undefined });
  const handleCategoryChange = (value: string) => onFiltersChange({ category: value === 'all' ? undefined : value });
  const handlePlatformChange = (value: string) => onFiltersChange({ platform: value === 'all' ? undefined : value });
  const handleLevelChange = (value: string) => onFiltersChange({ level: value === 'all' ? undefined : (value as any) });
  const handleCourseTypeChange = (value: string) =>
    onFiltersChange({ course_type: value === 'all' ? undefined : (value as 'free' | 'paid') });
  const handleCertificateChange = (checked: boolean) => onFiltersChange({ have_cert: checked ? true : undefined });

  const handleTagToggle = (tagSlug: string) => {
    const current = filters?.tags || [];
    const next = current.includes(tagSlug) ? current.filter((t) => t !== tagSlug) : [...current, tagSlug];
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

  return (
    <>
      <div className="space-y-6">
        {/* Search */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-background to-muted/20 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 transition-colors duration-200 group-focus-within:text-primary" />
              <Input
                placeholder={t('filters.search_placeholder')}
                value={filters?.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-12 h-14 text-base border-2 focus:border-primary/50 bg-background/80 backdrop-blur-sm transition-all duration-200 focus:scale-[1.02] group"
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Toggle */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-primary/30 transition-all duration-300 cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:scale-95">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform duration-300">
                      <Filter className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{t('filters.advanced_filters')}</h3>
                      <p className="text-sm text-muted-foreground">{t('filters.refine_search')}</p>
                    </div>
                    {!!activeCount && (
                      <Badge variant="default" className="ml-2 px-3 py-1 bg-primary text-primary-foreground animate-pulse">
                        {t('filters.active', { count: activeCount })}
                      </Badge>
                    )}
                  </div>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </CardContent>
            </Card>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-6 animate-in fade-in-50 duration-300">
            <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    {t('filters.filter_options')}
                  </CardTitle>
                  {!!activeCount && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={onResetFilters} 
                      className="border-dashed hover:bg-destructive/5 hover:border-destructive/20 hover:text-destructive transition-all duration-200"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
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
                      <SelectTrigger className="h-11 transition-all duration-200 hover:border-primary/50 hover:scale-105">
                        <SelectValue placeholder={t('filters.course_type.all')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="transition-colors duration-150 hover:bg-primary/10">
                          {t('filters.course_type.all')}
                        </SelectItem>
                        <SelectItem value="free" className="transition-colors duration-150 hover:bg-green-50">
                          <div className="flex items-center gap-2">
                            <span>{t('filters.course_type.free')}</span>
                            {!!filterOptions?.course_types?.free && (
                              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">{filterOptions.course_types.free}</Badge>
                            )}
                          </div>
                        </SelectItem>
                        <SelectItem value="paid" className="transition-colors duration-150 hover:bg-blue-50">
                          <div className="flex items-center gap-2">
                            <span>{t('filters.course_type.paid')}</span>
                            {!!filterOptions?.course_types?.paid && (
                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">{filterOptions.course_types.paid}</Badge>
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
                      <SelectTrigger className="h-11 transition-all duration-200 hover:border-primary/50 hover:scale-105">
                        <SelectValue placeholder={t('sidebar_filters.all_categories')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="transition-colors duration-150 hover:bg-primary/10">
                          {t('sidebar_filters.all_categories')}
                        </SelectItem>
                        {filterOptions?.categories?.map((c) => (
                          <SelectItem key={c.id} value={c.slug} className="transition-colors duration-150 hover:bg-primary/10">
                            <div className="flex items-center justify-between w-full">
                              <span>{c.name}</span>
                              {typeof c.courses_count === 'number' && (
                                <Badge variant="secondary" className="text-xs ml-2">{c.courses_count}</Badge>
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
                      <SelectTrigger className="h-11 transition-all duration-200 hover:border-primary/50 hover:scale-105">
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
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">{t('filters.level.label')}</Label>
                    <Select value={filters?.level || 'all'} onValueChange={handleLevelChange} disabled={loading}>
                      <SelectTrigger className="h-11 transition-all duration-200 hover:border-primary/50 hover:scale-105">
                        <SelectValue placeholder={t('sidebar_filters.all_levels')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="transition-colors duration-150 hover:bg-primary/10">
                          {t('sidebar_filters.all_levels')}
                        </SelectItem>
                        <SelectItem value="beginner" className="transition-colors duration-150 hover:bg-green-50">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 border transition-all duration-200 hover:scale-105">
                            {t('filters.level.beginner')}
                          </Badge>
                        </SelectItem>
                        <SelectItem value="intermediate" className="transition-colors duration-150 hover:bg-yellow-50">
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 border transition-all duration-200 hover:scale-105">
                            {t('filters.level.intermediate')}
                          </Badge>
                        </SelectItem>
                        <SelectItem value="advanced" className="transition-colors duration-150 hover:bg-red-50">
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 transition-all duration-200 hover:scale-105">
                            {t('filters.level.advanced')}
                          </Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Certificate */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    {t('filters.certificate.label')}
                  </Label>
                  <Card className="p-4 bg-muted/30 border-dashed hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="certificate"
                        checked={!!filters?.have_cert}
                        onCheckedChange={(v: boolean) => handleCertificateChange(!!v)}
                        disabled={loading}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-200 group-hover:scale-110"
                      />
                      <Label htmlFor="certificate" className="text-sm font-medium cursor-pointer flex items-center gap-2 transition-colors duration-200 group-hover:text-primary">
                        <Award className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
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
                    <Card className="p-4 bg-muted/20 border-dashed hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
                      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                        {filterOptions.tags.map((tag) => {
                          const active = !!filters?.tags?.includes(tag.slug);
                          return (
                            <Badge
                              key={tag.id}
                              variant={active ? 'default' : 'outline'}
                              className={`cursor-pointer transition-all duration-200 text-sm px-3 py-2 hover:scale-110 active:scale-95 ${
                                active 
                                  ? 'bg-primary text-primary-foreground shadow-lg animate-pulse' 
                                  : 'hover:bg-primary/10 hover:border-primary/50 hover:text-primary'
                              }`}
                              onClick={() => handleTagToggle(tag.slug)}
                            >
                              {tag.name}
                              {typeof tag.courses_count === 'number' && (
                                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded transition-colors duration-200 ${
                                  active ? 'bg-primary-foreground/20' : 'bg-background/20'
                                }`}>
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
        <Card className="border-l-4 border-l-primary bg-primary/5 hover:bg-primary/10 transition-all duration-300 animate-in slide-in-from-bottom-5">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-sm font-semibold text-primary">{t('courses.filters.active_filters')}</span>
                  <Badge variant="secondary" className="text-xs">{t('filters.active', { count: activeCount })}</Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={onResetFilters} className="text-xs h-7 px-3 hover:bg-destructive/10 hover:text-destructive transition-all duration-200">
                  <X className="h-3 w-3 mr-1" />
                  {t('courses.filters.clear') || t('sidebar_filters.clear_filters')}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {filters?.search && (
                  <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border hover:scale-105 transition-all duration-200 cursor-pointer">
                    <Search className="h-3 w-3" />
                    <span className="text-xs font-medium">{t('common.search')}:</span>
                    <span className="text-xs">
                      {filters.search.length > 20 ? `${filters.search.substring(0, 20)}...` : filters.search}
                    </span>
                    <X className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors duration-200" onClick={() => onFiltersChange({ search: undefined })} />
                  </Badge>
                )}
                {filters?.course_type && (
                  <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border hover:scale-105 transition-all duration-200 cursor-pointer">
                    <DollarSign className="h-3 w-3" />
                    <span className="text-xs font-medium">{t('filters.course_type.label')}:</span>
                    <span className="text-xs capitalize">{filters.course_type}</span>
                    <X className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors duration-200" onClick={() => onFiltersChange({ course_type: undefined })} />
                  </Badge>
                )}
                {filters?.category && (
                  <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border hover:scale-105 transition-all duration-200 cursor-pointer">
                    <BookOpen className="h-3 w-3" />
                    <span className="text-xs font-medium">{t('filters.category.label')}:</span>
                    <span className="text-xs">
                      {filterOptions?.categories?.find((c) => c.slug === filters.category)?.name ?? filters.category}
                    </span>
                    <X className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors duration-200" onClick={() => onFiltersChange({ category: undefined })} />
                  </Badge>
                )}
                {filters?.platform && (
                  <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border hover:scale-105 transition-all duration-200 cursor-pointer">
                    <span className="text-xs font-medium">{t('filters.platform.label')}:</span>
                    <span className="text-xs">{filters.platform}</span>
                    <X className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors duration-200" onClick={() => onFiltersChange({ platform: undefined })} />
                  </Badge>
                )}
                {filters?.level && (
                  <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border hover:scale-105 transition-all duration-200 cursor-pointer">
                    <span className="text-xs font-medium">{t('filters.level.label')}:</span>
                    <span className="text-xs capitalize">{filters.level}</span>
                    <X className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors duration-200" onClick={() => onFiltersChange({ level: undefined })} />
                  </Badge>
                )}
                {filters?.have_cert && (
                  <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border hover:scale-105 transition-all duration-200 cursor-pointer">
                    <Award className="h-3 w-3" />
                    <span className="text-xs">{t('filters.with_certificate')}</span>
                    <X className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors duration-200" onClick={() => onFiltersChange({ have_cert: undefined })} />
                  </Badge>
                )}
                {!!filters?.tags?.length && (
                  <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5 bg-background border hover:scale-105 transition-all duration-200 cursor-pointer">
                    <TagIcon className="h-3 w-3" />
                    <span className="text-xs font-medium">{t('filters.tags.label')}:</span>
                    <span className="text-xs">
                      {filters.tags.length} {t('filters.selected', { count: filters.tags.length })}
                    </span>
                    <X className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors duration-200" onClick={() => onFiltersChange({ tags: undefined })} />
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

export { CourseFiltersComponent as CourseFilters };