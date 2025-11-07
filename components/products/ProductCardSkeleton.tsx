import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
    return (
        <Card className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
                <Skeleton className="w-full h-48 lg:h-64 mb-4" />
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-5 w-1/2 mx-auto mb-4" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    );
}
