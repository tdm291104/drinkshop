import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedProductSkeleton() {
    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 lg:p-8 max-w-sm lg:max-w-md mx-auto text-center">
            <Skeleton className="h-8 w-20 mx-auto mb-4" />
            <Skeleton className="h-48 lg:h-64 w-full mx-auto mb-4" />
            <Skeleton className="h-6 w-40 mx-auto mb-2" />
            <Skeleton className="h-8 w-32 mx-auto mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <div className="grid grid-cols-4 gap-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    );
}
