import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { index, update } from '@/routes/dashboard/categories';
import type { BreadcrumbItem } from '@/types';

interface Category {
  id: number;
  name: string; // localized by backend; safe to display
  slug: string;
  courses_count?: number;
  name_ar?: string; // ← add this
  // Optional: include existing Arabic translation from controller if you want to prefill
  // translations?: Array<{ locale: string; field: string; value: string }>;
}

interface FormData {
  name: string;
  name_ar?: string;
}

interface Props {
  category: Category;
}

export default function EditCategory({ category }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categories', href: '/dashboard/categories' },
    { title: `Edit ${category.name}`, href: `/dashboard/categories/${category.id}/edit` },
  ];

  const { data, setData, put, processing, errors } = useForm<FormData>({
    name: category.name,
    name_ar: category.name_ar || '', // set if you preload Arabic via props; otherwise leave blank
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(update.url(category.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Category: ${category.name}`} />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={index.url()}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
            <p className="text-muted-foreground">Update category information</p>
          </div>
        </div>

        {/* Form */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name (English) *</Label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Enter category name in English"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                <p className="text-sm text-muted-foreground">
                  Current slug: <code className="bg-muted px-1 py-0.5 rounded text-sm">{category.slug}</code>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name_ar">Category Name (Arabic) — optional</Label>
                <Input
                  id="name_ar"
                  dir="rtl"
                  value={data.name_ar || ''}
                  onChange={(e) => setData('name_ar', e.target.value)}
                  placeholder="[translate:اسم التصنيف باللغة العربية]"
                />
                {errors.name_ar && <p className="text-sm text-destructive">{errors.name_ar}</p>}
              </div>

              {category.courses_count !== undefined && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    This category is currently used by <strong>{category.courses_count}</strong> course
                    {category.courses_count !== 1 ? 's' : ''}.
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={processing}>
                  <Save className="mr-2 h-4 w-4" />
                  {processing ? 'Updating...' : 'Update Category'}
                </Button>
                <Link href={index.url()}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
