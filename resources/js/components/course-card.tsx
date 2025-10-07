import { Link } from '@inertiajs/react';
import { Course } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
    Clock, 
    Award, 
    BookOpen, 
    ExternalLink,
    DollarSign,
    Gift,
    TrendingUp,
    Calendar
} from 'lucide-react';

interface CourseCardProps {
    course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
    const formatDuration = (duration: string | null) => {
        if (!duration) return 'Self-paced';
        
        // Convert duration to a more readable format
        const hours = parseInt(duration);
        if (hours < 1) return 'Under 1 hour';
        if (hours === 1) return '1 hour';
        return `${hours} hours`;
    };

    const formatPrice = (price: number | null) => {
        if (!price || price <= 0) return 'Free';
        return `$${Number(price).toFixed(2)}`;
    };

    const isPaid = course.price && course.price > 0;
    const isFree = !course.price || course.price <= 0;

    return (
        <Card className="group h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 border-border-/50 hover:border-primary/20">
            {/* Course Image */}
            <div className="relative overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative">
                    {course.image_url ? (
                        <img 
                            src={course.image_url} 
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <BookOpen className="h-12 w-12 mb-2 opacity-50" />
                            <span className="text-sm font-medium opacity-75">Course Preview</span>
                        </div>
                    )}
                    
                    {/* Price Badge */}
                    <div className="absolute top-3 right-3">
                        {isFree ? (
                            <Badge className="bg-green-500 hover:bg-green-600 text-white shadow-lg">
                                <Gift className="h-3 w-3 mr-1" />
                                Free
                            </Badge>
                        ) : (
                            <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                                <DollarSign className="h-3 w-3 mr-1" />
                                {formatPrice(course.price)}
                            </Badge>
                        )}
                    </div>

                    {/* Platform Badge */}
                    {course.platform && (
                        <div className="absolute top-3 left-3">
                            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm shadow-lg">
                                {course.platform}
                            </Badge>
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button size="sm" className="shadow-lg">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Preview
                        </Button>
                    </div>
                </div>
            </div>

            <CardHeader className="pb-3">
                {/* Level Badge */}
                {course.level && (
                    <div className="mb-3">
                        <Badge 
                            variant="outline" 
                            className={`text-xs font-medium ${
                                course.level.toLowerCase() === 'beginner' ? 'border-green-200 border text-green-700 bg-green-50' :
                                course.level.toLowerCase() === 'intermediate' ? 'border-yellow-200 border text-yellow-700 bg-yellow-50' :
                                course.level.toLowerCase() === 'advanced' ? 'border-red-200 text-red-700 bg-red-50' :
                                'border-blue-200 text-blue-700 bg-blue-50'
                            }`}
                        >
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {course.level}
                        </Badge>
                    </div>
                )}

                {/* Title */}
                <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
                    {course.title}
                </h3>
            </CardHeader>

            <CardContent className="flex-1 pb-4">
                {/* Description */}
                {course.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
                        {course.description}
                    </p>
                )}

                {/* Course Stats */}
                <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{formatDuration(course.duration)}</span>
                    </div>
                    
                    {course.certificate_available && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Award className="h-4 w-4 text-primary" />
                            <span>Certificate included</span>
                        </div>
                    )}
                </div>

                <Separator className="mb-4" />

                {/* Category and Tags */}
                <div className="space-y-3">
                    {course.category && (
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                                {course.category.name}
                            </Badge>
                        </div>
                    )}

                    {course.tags && course.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {course.tags.slice(0, 3).map((tag) => (
                                <Badge 
                                    key={tag.id} 
                                    variant="outline" 
                                    className="text-xs px-2 py-0.5 border-primary/20 text-primary/80 hover:bg-primary/10"
                                >
                                    {tag.name}
                                </Badge>
                            ))}
                            {course.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs px-2 py-0.5 text-muted-foreground">
                                    +{course.tags.length - 3} more
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="pt-0 pb-4">
                <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/courses/${course.id}`}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        View Details
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}