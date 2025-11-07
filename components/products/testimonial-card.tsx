import { User } from "lucide-react"
import type { Testimonial } from "@/lib/api"

interface TestimonialCardProps {
  testimonial: Testimonial
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-yellow-100 rounded-lg p-6 lg:p-8 max-w-md mx-auto text-center">
      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
        <User className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
      </div>
      <p className="text-gray-700 mb-4 text-sm lg:text-base leading-relaxed">"{testimonial.content}"</p>
      <div className="font-semibold text-sm lg:text-base">{testimonial.name}</div>
      <div className="text-xs lg:text-sm text-gray-600">{testimonial.role}</div>
    </div>
  )
}
