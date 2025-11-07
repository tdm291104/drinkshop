import CategoryList from "./CategoryList"
import ProductCompare from "./ProductCompare"
import TagList from "./TagList"
import PromotionalBanner from "./PromotionalBanner"

interface ProductSidebarProps {
    categories: Array<{ name: string; value: string; count: number }>;
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    tags: string[];
}

export default function ProductSidebar({
    categories,
    selectedCategory,
    onSelectCategory,
    tags
}: ProductSidebarProps) {
    return (
        <div className="lg:w-1/4">
            <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={onSelectCategory}
            />
            <ProductCompare />
            <TagList tags={tags} />
            <PromotionalBanner />
        </div>
    )
}
