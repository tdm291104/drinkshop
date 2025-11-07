import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BackButtonProps {
    href: string
    text?: string
    variant?: "default" | "outline" | "ghost"
    className?: string
}

const BackButton = ({
    href,
    text = "Quay lại",
    variant = "outline",
    className = ""
}: BackButtonProps) => {
    return (
        <Link href={href}>
            <Button
                variant={variant}
                className={`bg-transparent ${className}`}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {text}
            </Button>
        </Link>
    )
}

export default BackButton