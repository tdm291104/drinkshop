export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  description: string
  rating: number
  reviews: number
  inStock: boolean
  features: string[]
}

export const products: Product[] = [
  {
    id: 1,
    name: "LA CAPRA VIOGNIER",
    price: 450000,
    originalPrice: 520000,
    image: "/Product/1.jpg",
    category: "Rượu Vang Trắng",
    description:
      "Rượu vang trắng Viognier với hương thơm đặc trưng của hoa và trái cây nhiệt đới. Vị cân bằng giữa độ chua tự nhiên và độ ngọt nhẹ.",
    rating: 4,
    reviews: 23,
    inStock: true,
    features: ["Xuất xứ: Tây Ban Nha", "Độ cồn: 13.5%", "Dung tích: 750ml", "Nhiệt độ phục vụ: 8-10°C"],
  },
  {
    id: 2,
    name: "RAMONDA ROURES",
    price: 680000,
    originalPrice: 750000,
    image: "/Product/2.jpg",
    category: "Rượu Vang Đỏ",
    description:
      "Rượu vang đỏ cao cấp với thiết kế nhãn nghệ thuật độc đáo. Hương vị phức hợp với note của trái cây chín và gia vị.",
    rating: 5,
    reviews: 18,
    inStock: true,
    features: ["Xuất xứ: Tây Ban Nha", "Độ cồn: 14%", "Dung tích: 750ml", "Thời gian ủ: 12 tháng"],
  },
  {
    id: 3,
    name: "TORELLO MOSAICS 05",
    price: 590000,
    originalPrice: 650000,
    image: "/Product/3.jpg",
    category: "Rượu Vang Trắng",
    description:
      "Rượu vang trắng với thiết kế nhãn hiện đại, hương vị tươi mát và cân bằng. Phù hợp với hải sản và món ăn nhẹ.",
    rating: 4,
    reviews: 31,
    inStock: true,
    features: ["Xuất xứ: Tây Ban Nha", "Độ cồn: 12.5%", "Dung tích: 750ml", "Phong cách: Hiện đại"],
  },
  {
    id: 4,
    name: "TORELLO DOLÇ",
    price: 720000,
    originalPrice: 800000,
    image: "/Product/4.jpg",
    category: "Rượu Vang Ngọt",
    description:
      "Rượu vang ngọt cao cấp với bọt khí tự nhiên, hương vị ngọt ngào và thanh thoát. Lý tưởng cho tráng miệng.",
    rating: 5,
    reviews: 12,
    inStock: true,
    features: ["Xuất xứ: Tây Ban Nha", "Độ cồn: 11%", "Dung tích: 750ml", "Loại: Sparkling Sweet"],
  },
  {
    id: 5,
    name: "TORELLO MARC",
    price: 850000,
    image: "/Product/5.jpg",
    category: "Champagne",
    description:
      "Champagne cao cấp với bọt khí mịn màng và hương vị phức tạp. Được ủ lâu để tạo nên độ tinh tế đặc biệt.",
    rating: 5,
    reviews: 27,
    inStock: true,
    features: ["Xuất xứ: Tây Ban Nha", "Độ cồn: 12%", "Dung tích: 750ml", "Phương pháp: Méthode Champenoise"],
  },
  {
    id: 6,
    name: "TORELLO BRUT RESERVA",
    price: 920000,
    image: "/Product/6.jpg",
    category: "Champagne",
    description: "Champagne Brut Reserva với chất lượng cao cấp, bọt khí tinh tế và hương vị cân bằng hoàn hảo.",
    rating: 5,
    reviews: 35,
    inStock: true,
    features: ["Xuất xứ: Tây Ban Nha", "Độ cồn: 12%", "Dung tích: 750ml", "Thời gian ủ: 24 tháng"],
  },
  {
    id: 7,
    name: "PETJADES ROSÉ",
    price: 380000,
    originalPrice: 420000,
    image: "/Product/7.jpg",
    category: "Rượu Vang Rosé",
    description:
      "Rượu vang rosé tươi mát với màu hồng quyến rũ, hương vị nhẹ nhàng và thanh thoát. Hoàn hảo cho mùa hè.",
    rating: 4,
    reviews: 19,
    inStock: true,
    features: ["Xuất xứ: Tây Ban Nha", "Độ cồn: 12.5%", "Dung tích: 750ml", "Phong cách: Tươi mát"],
  },
  {
    id: 8,
    name: "CAMPERCHI TOSCANA",
    price: 1250000,
    originalPrice: 1400000,
    image: "/Product/8.jpg",
    category: "Rượu Vang Đỏ",
    description:
      "Rượu vang đỏ Toscana cao cấp từ Italia với hương vị phức hợp và tannin mềm mại. Thể hiện tinh hoa của vùng đất nổi tiếng.",
    rating: 5,
    reviews: 41,
    inStock: true,
    features: ["Xuất xứ: Italia", "Độ cồn: 14.5%", "Dung tích: 750ml", "Vùng: Toscana IGT"],
  },
  {
    id: 9,
    name: "ROOT:1 CABERNET SAUVIGNON",
    price: 1580000,
    originalPrice: 1750000,
    image: "/Product/9.jpg",
    category: "Rượu Vang Đỏ",
    description:
      "Rượu vang đỏ cao cấp từ nho Cabernet Sauvignon, ủ trong thùng gỗ sồi với thiết kế chai sang trọng và hương vị đẳng cấp.",
    rating: 5,
    reviews: 8,
    inStock: true,
    features: ["Xuất xứ: Úc", "Độ cồn: 14.5%", "Dung tích: 750ml", "Thời gian ủ: 18 tháng"],
  },
  {
    id: 10,
    name: "PRIMARIO PUGLIA 2000",
    price: 890000,
    originalPrice: 980000,
    image: "/Product/10.jpg",
    category: "Rượu Vang Đỏ",
    description:
      "Rượu vang đỏ vintage từ vùng Puglia, Italia. Được sản xuất từ năm 2000 với hương vị đậm đà và truyền thống.",
    rating: 4,
    reviews: 15,
    inStock: true,
    features: ["Xuất xứ: Italia", "Độ cồn: 13.5%", "Dung tích: 750ml", "Năm sản xuất: 2000"],
  },
  {
    id: 11,
    name: "ADMIT ONE RED BLEND",
    price: 750000,
    originalPrice: 850000,
    image: "/Product/11.jpg",
    category: "Rượu Vang Đỏ",
    description:
      "Rượu vang đỏ blend hiện đại với thiết kế nhãn độc đáo. Hương vị cân bằng giữa các giống nho khác nhau tạo nên sự phức hợp thú vị.",
    rating: 4,
    reviews: 22,
    inStock: true,
    features: ["Xuất xứ: Úc", "Độ cồn: 14%", "Dung tích: 750ml", "Phong cách: Modern Blend"],
  },
  {
    id: 12,
    name: "EL GUAPO RED WINE",
    price: 520000,
    originalPrice: 580000,
    image: "/Product/12.jpg",
    category: "Rượu Vang Đỏ",
    description:
      "Rượu vang đỏ với thiết kế nhãn nghệ thuật đầy màu sắc, thể hiện tinh thần vui tươi và sáng tạo. Hương vị trái cây đậm đà.",
    rating: 4,
    reviews: 28,
    inStock: true,
    features: ["Xuất xứ: Argentina", "Độ cồn: 13.5%", "Dung tích: 750ml", "Phong cách: Artistic"],
  },
  {
    id: 13,
    name: "IT SHOULD BE RIESLING",
    price: 480000,
    originalPrice: 540000,
    image: "/Product/13.jpg",
    category: "Rượu Vang Trắng",
    description:
      "Rượu vang trắng Riesling với hương vị tươi mát và độ chua cân bằng. Thiết kế nhãn tối giản nhưng ấn tượng.",
    rating: 4,
    reviews: 17,
    inStock: true,
    features: ["Xuất xứ: Đức", "Độ cồn: 12%", "Dung tích: 750ml", "Giống nho: Riesling"],
  },
  {
    id: 14,
    name: "ALPATACO SAUVIGNON BLANC",
    price: 420000,
    originalPrice: 480000,
    image: "/Product/14.jpg",
    category: "Rượu Vang Trắng",
    description:
      "Rượu vang trắng Sauvignon Blanc từ Argentina với hương thơm tươi mát của trái cây nhiệt đới và thảo mộc. Vị chua thanh khiết.",
    rating: 4,
    reviews: 33,
    inStock: true,
    features: ["Xuất xứ: Argentina", "Độ cồn: 13%", "Dung tích: 750ml", "Giống nho: Sauvignon Blanc"],
  },
]

export const getProductById = (id: number): Product | undefined => {
  return products.find((product) => product.id === id)
}

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((product) => product.category === category)
}

export const getFeaturedProducts = (): Product[] => {
  return products.slice(0, 4)
}

export const getBestSellers = (): Product[] => {
  return products.slice(4, 8)
}

export const getNewProducts = (): Product[] => {
  return products.slice(10, 14) // Return the 4 newest products
}
