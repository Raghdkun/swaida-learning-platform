import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { ArrowLeft, Save } from 'lucide-react';
import { index, store } from '@/routes/dashboard/tags';

interface FormData {
  name: string;
  name_ar?: string;
}

export default function CreateTag() {
  const breadcrumbs: BreadcrumbItemType[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tags', href: '/dashboard/tags' },
    { title: 'Create Tag', href: '/dashboard/tags/create' }
  ];

  const { data, setData, post, processing, errors } = useForm<FormData>({
    name: '',
    name_ar: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(store.url());
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Tag" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
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
                  The slug will be automatically generated from the English name.
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

              <div className="flex gap-4">
                <Button type="submit" disabled={processing}>
                  <Save className="mr-2 h-4 w-4" />
                  {processing ? 'Creating...' : 'Create Tag'}
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
