import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, BookOpen, TrendingUp, Users, Award } from 'lucide-react';
import { index, show } from '@/routes/dashboard/levels';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Levels', href: '/dashboard/levels' },
];

interface LevelData {
    level: 'beginner' | 'intermediate' | 'advanced';
    courses_count: number;
    description: string;
}

interface Props {
    levels: LevelData[];
}

export default function LevelsIndex({ levels }: Props) {
    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'beginner':
                return <Users className="h-6 w-6" />;
            case 'intermediate':
                return <TrendingUp className="h-6 w-6" />;
            case 'advanced':
                return <Award className="h-6 w-6" />;
            default:
                return <BookOpen className="h-6 w-6" />;
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'beginner':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'advanced':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getLevelGradient = (level: string) => {
        switch (level) {
            case 'beginner':
                return 'from-green-500 to-green-600';
            case 'intermediate':
                return 'from-yellow-500 to-yellow-600';
            case 'advanced':
                return 'from-red-500 to-red-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const totalCourses = levels.reduce((sum, level) => sum + level.courses_count, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Levels Management" />
            
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Course Levels</h1>
                        <p className="text-muted-foreground">
                            Overview of course difficulty levels and distribution
                        </p>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <BookOpen className="h-8 w-8 text-muted-foreground" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                                    <p className="text-2xl font-bold">{totalCourses}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {levels.map((levelData) => (
                        <Card key={levelData.level}>
                            <CardContent className="pt-6">
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getLevelGradient(levelData.level)} text-white`}>
                                        {getLevelIcon(levelData.level)}
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-muted-foreground capitalize">{levelData.level}</p>
                                        <p className="text-2xl font-bold">{levelData.courses_count}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Levels Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {levels.map((levelData) => (
                        <Card key={levelData.level} className="relative overflow-hidden">
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getLevelGradient(levelData.level)}`} />
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-gradient-to-r ${getLevelGradient(levelData.level)} text-white`}>
                                            {getLevelIcon(levelData.level)}
                                        </div>
                                        <div>
                                            <CardTitle className="capitalize">{levelData.level}</CardTitle>
                                            <Badge className={getLevelColor(levelData.level)}>
                                                {levelData.courses_count} course{levelData.courses_count !== 1 ? 's' : ''}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    {levelData.description}
                                </p>
                                
                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Course Distribution</span>
                                        <span>{totalCourses > 0 ? Math.round((levelData.courses_count / totalCourses) * 100) : 0}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                                        <div 
                                            className={`h-2 rounded-full bg-gradient-to-r ${getLevelGradient(levelData.level)}`}
                                            style={{ 
                                                width: totalCourses > 0 ? `${(levelData.courses_count / totalCourses) * 100}%` : '0%' 
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Link href={show.url(levelData.level)}>
                                        <Button variant="outline" className="w-full">
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Courses
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {levels.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-8">
                            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-2 text-sm font-medium text-muted-foreground">No level data available</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Create some courses to see level distribution.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}