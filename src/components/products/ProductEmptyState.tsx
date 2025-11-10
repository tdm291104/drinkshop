import Link from "next/link";

interface ProductEmptyStateProps {
    activeSearchQuery: string;
    setSearchQuery: (value: string) => void;
    setUrlSearchQuery: (value: string) => void;
    setCurrentPage: (page: number) => void;
}

export default function ProductEmptyState({
    activeSearchQuery,
    setSearchQuery,
    setUrlSearchQuery,
    setCurrentPage,
}: ProductEmptyStateProps) {
    return (
        <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">
                {activeSearchQuery
                    ? `Không tìm thấy sản phẩm nào cho "${activeSearchQuery}"`
                    : "Không có sản phẩm nào"}
            </p>
            <p className="text-sm text-gray-500 mb-6">
                Thử tìm kiếm với từ khóa khác hoặc duyệt qua các danh mục khác.
            </p>
            <div className="flex gap-4 justify-center">
                {activeSearchQuery && (
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            setUrlSearchQuery("");
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                    >
                        Xóa bộ lọc tìm kiếm
                    </button>
                )}
                <Link
                    href="/products"
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                    Xem tất cả sản phẩm
                </Link>
            </div>
        </div>
    );
}
