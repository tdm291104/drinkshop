import { Calendar, User, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BlogMetaProps {
    date: string
    author: string
    views: number
    category: string
    className?: string
}

const BlogMeta = ({ date, author, views, category, className = "" }: BlogMetaProps) => {
    return (
        <div className={`flex flex-wrap items-center text-sm text-gray-500 gap-2 lg:gap-4 ${className}`}>
            <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(date).toLocaleDateString("vi-VN")}</span>
            </div>
            <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{author}</span>
            </div>
            <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{views} lượt xem</span>
            </div>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                {category}
            </Badge>
        </div>
    )
}

export default BlogMeta