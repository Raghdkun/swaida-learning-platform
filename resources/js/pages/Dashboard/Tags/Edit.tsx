import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { index, update } from '@/routes/dashboard/tags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { ArrowLeft, Save } from 'lucide-react';

interface Tag {
  id: number;
  name: string;
  slug: string;
  courses_count?: number;
  name_ar?: string; // prefilled Arabic from backend
}

interface FormData {
  name: string;
  name_ar?: string;
}

interface Props {
  tag: Tag;
}

export default function EditTag({ tag }: Props) {
  const { data, setData, put, processing, errors } = useForm<FormData>({
    name: tag.name,
    name_ar: tag.name_ar || '',
  });

  const breadcrumbs: BreadcrumbItemType[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tags', href: index.url() },
    { title: `Edit: ${tag.name}`, href: '#' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(update.url({ tag: tag.id }));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Tag: ${tag.name}`} />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={index.url()}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tags
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Tag</h1>
            <p className="text-muted-foreground">Update tag information</p>
          </div>
        </div>

        {/* Form */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Tag Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Tag Name (English) *</Label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Enter tag name in English"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                <p className="text-sm text-muted-foreground">
                  Current slug: <code className="bg-muted px-1 py-0.5 rounded text-sm">{tag.slug}</code>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name_ar">Tag Name (Arabic) — optional</Label>
                <Input
                  id="name_ar"
                  dir="rtl"
                  value={data.name_ar || ''}
                  onChange={(e) => setData('name_ar', e.target.value)}
                  placeholder="[translate:اسم الوسم باللغة العربية]"
                />
                {errors.name_ar && <p className="text-sm text-destructive">{errors.name_ar}</p>}
              </div>

              {tag.courses_count !== undefined && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    This tag is currently used by <strong>{tag.courses_count}</strong> course
                    {tag.courses_count !== 1 ? 's' : ''}.
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={processing}>
                  <Save className="mr-2 h-4 w-4" />
                  {processing ? 'Updating...' : 'Update Tag'}
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
