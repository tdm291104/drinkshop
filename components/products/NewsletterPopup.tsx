"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

// Tạo interface để định nghĩa cấu trúc của ảnh
interface PopupImage {
  src: string;
  alt: string;
}

// Tạo mảng chứa thông tin các ảnh
const NEWSLETTER_IMAGES: PopupImage[] = [
  {
    src: "/Product/3.jpg",
    alt: "White Wine"
  },
  {
    src: "/Product/2.jpg",
    alt: "Red Wine"
  }
]

interface NewsletterPopupProps {
  // Cho phép tùy chỉnh ảnh từ bên ngoài nếu cần
  images?: PopupImage[];
}

export default function NewsletterPopup({ images = NEWSLETTER_IMAGES }: NewsletterPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem("newsletter-popup-seen")
      if (!hasSeenPopup) {
        setIsVisible(true)
      }
    }, 3000) // Show after 3 seconds

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem("newsletter-popup-seen", "true")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleClose()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-sm lg:max-w-md w-full relative overflow-hidden">
        <Button
          onClick={handleClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-white rounded-full shadow-lg hover:bg-gray-100"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="flex flex-col lg:flex-row">
          {/* Render các ảnh từ mảng */}
          {images.map((image, index) => (
            <div key={index} className="w-full lg:w-1/3 hidden lg:block">
              <Image
                src={image.src}
                alt={image.alt}
                width={150}
                height={300}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          <div className="w-full lg:w-1/3 p-4 lg:p-6 flex flex-col justify-center">
            <h2 className="text-lg lg:text-xl font-bold mb-2">Gửi Email</h2>
            <p className="text-sm text-gray-600 mb-4">
              Đăng ký nhận bản tin để nhận thông tin về các sản phẩm mới và ưu đãi đặc biệt từ Wine House.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-black">
                ĐĂNG KÝ
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
