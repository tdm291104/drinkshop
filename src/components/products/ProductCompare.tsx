import Link from "next/dist/client/link";
import Image from "next/image";
import { useProductCompareStore } from "@/src/stores/product.compare.store";
import { IMAGE_DIMENSIONS } from "@/src/constants/image-dimensions";
export default function ProductCompare() {
  const { products } = useProductCompareStore();
  return (
    <div className="mb-6 lg:mb-8 hidden lg:block">
      <h3 className="text-lg font-bold mb-4 border-b pb-2">
        SO SÁNH SẢN PHẨM
        <Image
          src="/Image_Rudu/titleleft-dark.png"
          alt="arrow-trang-tri"
          width={IMAGE_DIMENSIONS.TITLE_DECORATION.width}
          height={IMAGE_DIMENSIONS.TITLE_DECORATION.height}
        />
      </h3>
      <div className="map">
        {products.length > 0 ? (
          products.map((product, index) => (
            <Link
              key={index}
              href={`/products/${product.id}`}
              className="block py-2 hover:underline"
            >
              {product.name}
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-600">
            Bạn chưa có sản phẩm nào để so sánh
          </p>
        )}
      </div>
    </div>
  );
}
