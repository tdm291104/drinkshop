import { Badge } from "@/components/ui/badge"

interface TagListProps {
    tags: string[];
}

export default function TagList({ tags }: TagListProps) {
    return (
        <div className="mb-6 lg:mb-8">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">
                TAG SẢN PHẨM
                <img src="/Image_Rudu/titleleft-dark.png" alt="arrow-trang-tri" />
            </h3>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-yellow-100 text-xs">
                        {tag}
                    </Badge>
                ))}
            </div>
        </div>
    )
}
