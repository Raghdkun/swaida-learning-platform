import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, X } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { update as courseUpdate } from '@/routes/dashboard/courses';

interface Course {
  id: number;
  title: string;
  description: string;
  external_url: string;
  duration: string | null;
  platform: string;
  image: string | null;
  image_url?: string | null;
  level: 'beginner' | 'intermediate' | 'advanced';
  have_cert: boolean;
  price: number | null;
  category: { id: number; name: string; };
  tags: Array<{ id: number; name: string; }>;
  // Arabic prefill from backend
  title_ar?: string | null;
  description_ar?: string | null;
  platform_ar?: string | null;
  level_ar?: string | null;
}

interface Category { id: number; name: string; }
interface Tag { id: number; name: string; }

interface Props {
  course: Course;
  categories: Category[];
  tags: Tag[];
}

interface FormData {
  title: string;
  description: string;
  external_url: string;
  duration: string;
  platform: string;
  image: File | null;
  category_id: string;
  level: string;
  have_cert: boolean;
  tags: number[];
  price: string;
  // Arabic fields
  title_ar?: string;
  description_ar?: string;
  platform_ar?: string;
  level_ar?: string;
}

const levels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function EditCourse({ course, categories, tags }: Props) {
  const [selectedTags, setSelectedTags] = useState<number[]>(course.tags.map(tag => tag.id));

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Courses', href: '/dashboard/courses' },
    { title: course.title, href: `/dashboard/courses/${course.id}` },
    { title: 'Edit', href: `/dashboard/courses/${course.id}/edit` },
  ];

  const { data, setData, post, processing, errors } = useForm<FormData>({
    title: course.title,
    description: course.description,
    external_url: course.external_url,
    duration: course.duration || '',
    platform: course.platform,
    image: null,
    category_id: course.category.id.toString(),
    level: course.level,
    have_cert: course.have_cert,
    tags: course.tags.map(tag => tag.id),
    price: course.price?.toString() || '',
    // Arabic prefill
    title_ar: (course.title_ar as string) || '',
    description_ar: (course.description_ar as string) || '',
    platform_ar: (course.platform_ar as string) || '',
    level_ar: (course.level_ar as string) || '',
  });

  useEffect(() => {
    setData('tags', selectedTags);
  }, [selectedTags]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(courseUpdate.url(course.id), {
      data: { ...data, tags: selectedTags },
      forceFormData: true,
    });
  };

  const toggleTag = (tagId: number) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId];
      return newTags;
    });
  };

  const removeTag = (tagId: number) => {
    setSelectedTags(prev => prev.filter(id => id !== tagId));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit ${course.title}`} />

      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/courses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Course</h1>
            <p className="text-muted-foreground">
              Update course information
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title *</Label>
                    <Input
                      id="title"
                      value={data.title}
                      onChange={(e) => setData('title', e.target.value)}
                      placeholder="Enter course title"
                      className={errors.title ? 'border-destructive' : ''}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title}</p>
                    )}
                  </div>

                  {/* Arabic title */}
                  <div className="space-y-2">
                    <Label htmlFor="title_ar">Course Title (Arabic) — optional</Label>
                    <Input
                      id="title_ar"
                      dir="rtl"
                      value={data.title_ar || ''}
                      onChange={(e) => setData('title_ar', e.target.value)}
                      placeholder="[translate:عنوان الدورة باللغة العربية]"
                    />
                    {errors.title_ar && (
                      <p className="text-sm text-destructive">{errors.title_ar}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      placeholder="Enter course description"
                      rows={4}
                      className={errors.description ? 'border-destructive' : ''}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive">{errors.description}</p>
                    )}
                  </div>

                  {/* Arabic description */}
                  <div className="space-y-2">
                    <Label htmlFor="description_ar">Description (Arabic) — optional</Label>
                    <Textarea
                      id="description_ar"
                      dir="rtl"
                      rows={4}
                      value={data.description_ar || ''}
                      onChange={(e) => setData('description_ar', e.target.value)}
                      placeholder="[translate:وصف الدورة باللغة العربية]"
                    />
                    {errors.description_ar && (
                      <p className="text-sm text-destructive">{errors.description_ar}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="external_url">Course URL *</Label>
                    <Input
                      id="external_url"
                      type="url"
                      value={data.external_url}
                      onChange={(e) => setData('external_url', e.target.value)}
                      placeholder="https://example.com/course"
                      className={errors.external_url ? 'border-destructive' : ''}
                    />
                    {errors.external_url && (
                      <p className="text-sm text-destructive">{errors.external_url}</p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="platform">Platform *</Label>
                      <Input
                        id="platform"
                        value={data.platform}
                        onChange={(e) => setData('platform', e.target.value)}
                        placeholder="e.g., Udemy, Coursera"
                        className={errors.platform ? 'border-destructive' : ''}
                      />
                      {errors.platform && (
                        <p className="text-sm text-destructive">{errors.platform}</p>
                      )}
                    </div>

                    {/* Arabic platform */}
                    <div className="space-y-2">
                      <Label htmlFor="platform_ar">Platform (Arabic) — optional</Label>
                      <Input
                        id="platform_ar"
                        dir="rtl"
                        value={data.platform_ar || ''}
                        onChange={(e) => setData('platform_ar', e.target.value)}
                        placeholder="[translate:المنصة]"
                      />
                      {errors.platform_ar && (
                        <p className="text-sm text-destructive">{errors.platform_ar}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={data.duration}
                        onChange={(e) => setData('duration', e.target.value)}
                        placeholder="e.g., 10 hours, 5 weeks"
                        className={errors.duration ? 'border-destructive' : ''}
                      />
                      {errors.duration && (
                        <p className="text-sm text-destructive">{errors.duration}</p>
                      )}
                    </div>

                    {/* Arabic level */}
                    <div className="space-y-2">
                      <Label htmlFor="level_ar">Level (Arabic) — optional</Label>
                      <Input
                        id="level_ar"
                        dir="rtl"
                        value={data.level_ar || ''}
                        onChange={(e) => setData('level_ar', e.target.value)}
                        placeholder="[translate:المستوى]"
                      />
                      {errors.level_ar && (
                        <p className="text-sm text-destructive">{errors.level_ar}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={data.price}
                      onChange={(e) => setData('price', e.target.value)}
                      placeholder="0.00"
                      className={errors.price ? 'border-destructive' : ''}
                    />
                    {errors.price && (
                      <p className="text-sm text-destructive">{errors.price}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Leave empty or set to 0 for free courses.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Course Image</Label>
                    {(course as any)?.image || (course as any)?.image_url ? (
                      <div className="mb-2">
                        <p className="text-sm text-muted-foreground mb-2">Current image:</p>
                        <img
                          src={(course as any).image ? `/storage/${(course as any).image}` : (course as any).image_url || ''}
                          alt="Current course image"
                          className="w-32 h-20 object-cover rounded border"
                        />
                      </div>
                    ) : null}
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setData('image', e.target.files?.[0] || null)}
                      className={errors.image ? 'border-destructive' : ''}
                    />
                    {errors.image && (
                      <p className="text-sm text-destructive">{errors.image}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Supported formats: JPEG, PNG, JPG, GIF, SVG. Max size: 2MB. Leave empty to keep current image.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tagId) => {
                        const tag = tags.find(t => t.id === tagId);
                        return tag ? (
                          <Badge key={tag.id} variant="secondary" className="gap-1">
                            {tag.name}
                            <button
                              type="button"
                              onClick={() => removeTag(tag.id)}
                              className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}

                  <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {tags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag.id}`}
                          checked={selectedTags.includes(tag.id)}
                          onCheckedChange={() => toggleTag(tag.id)}
                        />
                        <Label htmlFor={`tag-${tag.id}`} className="text-sm">
                          {tag.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={data.category_id}
                      onValueChange={(value) => setData('category_id', value)}
                    >
                      <SelectTrigger className={errors.category_id ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category_id && (
                      <p className="text-sm text-destructive">{errors.category_id}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Level *</Label>
                    <Select
                      value={data.level}
                      onValueChange={(value) => setData('level', value)}
                    >
                      <SelectTrigger className={errors.level ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.level && (
                      <p className="text-sm text-destructive">{errors.level}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="have_cert"
                      checked={data.have_cert}
                      onCheckedChange={(checked) => setData('have_cert', !!checked)}
                    />
                    <Label htmlFor="have_cert">Offers Certificate</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={processing}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {processing ? 'Updating...' : 'Update Course'}
                    </Button>

                    <Link href="/dashboard/courses" className="block">
                      <Button variant="outline" className="w-full">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
