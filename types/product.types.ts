export interface Product {
  status: string
  reviewCount: number
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  description: string
  rating: number
  reviews: number
  stock: number
  features: string[]
  discount?: number
}
