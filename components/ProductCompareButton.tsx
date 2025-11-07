import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ChartColumnStacked } from "lucide-react";
import ProductCompareDrawer from "@/components/ProductCompareDrawer";
const ProductCompareButton = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="
            fixed bottom-6 right-6 z-50 
            bg-primary text-white font-medium
            px-4 py-3 rounded-full shadow-lg
            hover:bg-chart-4 transition
            flex items-center gap-2"
        >
          <ChartColumnStacked className="h-4 w-4" />
          So sánh
        </Button>
      </DrawerTrigger>
      <ProductCompareDrawer />
    </Drawer>
  );
};
export default ProductCompareButton;
