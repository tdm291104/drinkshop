'use client'
import { Button } from "@/components/ui/button"
import { Facebook, Twitter } from "lucide-react"

interface SocialShareProps {
    title?: string
    url?: string
    className?: string
}

const SocialShare = ({
    title = "Chia sẻ:",
    url = typeof window !== 'undefined' ? window.location.href : '',
    className = ""
}: SocialShareProps) => {
    const shareOnFacebook = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        window.open(facebookUrl, '_blank', 'width=600,height=400')
    }

    const shareOnTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`
        window.open(twitterUrl, '_blank', 'width=600,height=400')
    }

    const shareOnPinterest = () => {
        const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}`
        window.open(pinterestUrl, '_blank', 'width=600,height=400')
    }

    return (
        <div className={`mt-8 lg:mt-12 pt-6 border-t ${className}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="font-medium text-gray-700">{title}</div>
                <div className="flex space-x-2">
                    <Button
                        size="sm"
                        onClick={shareOnFacebook}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Facebook className="w-4 h-4 mr-1" />
                        Facebook
                    </Button>
                    <Button
                        size="sm"
                        onClick={shareOnTwitter}
                        className="bg-blue-400 hover:bg-blue-500 text-white"
                    >
                        <Twitter className="w-4 h-4 mr-1" />
                        Twitter
                    </Button>
                    <Button
                        size="sm"
                        onClick={shareOnPinterest}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.690 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.562-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.001 24c6.624 0 11.999-5.373 11.999-12C24 5.372 18.626.001 12.001.001z" />
                        </svg>
                        Pinterest
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SocialShare
