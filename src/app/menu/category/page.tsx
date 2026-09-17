import { CategoryMenu } from "@/components/menu/CategoryMenu";
import { menuCategories } from "@/data/menu";

export default function MenuCategoryPage() {
  return <CategoryMenu categories={menuCategories} />;
}
