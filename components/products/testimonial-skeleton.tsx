import { Skeleton } from "@/components/ui/skeleton";

export default function TestimonialSkeleton() {
    return (
        <div className="bg-yellow-100 rounded-lg p-6 lg:p-8 max-w-md mx-auto text-center">
            <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
            <Skeleton className="h-4 w-3/4 mx-auto mb-1" />
            <Skeleton className="h-4 w-2/3 mx-auto mb-4" />
            <Skeleton className="h-5 w-1/3 mx-auto mb-1" />
            <Skeleton className="h-4 w-1/4 mx-auto" />
        </div>
    );
}
