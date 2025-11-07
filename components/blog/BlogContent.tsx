interface BlogContentProps {
    content: string
    className?: string
}

const BlogContent = ({ content, className = "" }: BlogContentProps) => {
    return (
        <div className={`prose max-w-none ${className}`}>
            {content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed text-sm lg:text-base">
                    {paragraph}
                </p>
            ))}
        </div>
    )
}

export default BlogContent