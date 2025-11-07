import { Skeleton } from "@/components/ui/skeleton";

export default function GallerySkeleton() {
    return (
        <div className="grid grid-cols-12 grid-rows-4 gap-2 h-[600px] lg:h-[800px]">
            {Array(7).fill(0).map((_, i) => (
                <div key={i} className={i % 2 === 0 ? "col-span-6 md:col-span-3 row-span-2" : "col-span-6 md:col-span-6 row-span-2"}>
                    <Skeleton className="w-full h-full rounded-lg" />
                </div>
            ))}
        </div>
    );
}
