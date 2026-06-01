"use client";

import { CatalogEntityManager } from "@/components/admin/CatalogEntityManager";
import {
  listAdminCategories,
  createCategory,
  updateCategory,
  toggleCategoryActive,
  deleteCategory,
} from "@/services/adminCategories";
import type { AdminCategory } from "@/types/admin";

export default function CategoriasPage() {
  return (
    <CatalogEntityManager<AdminCategory>
      config={{
        singular: "categoría",
        plural: "Categorías",
        queryKey: "admin-categories",
        list: listAdminCategories,
        create: createCategory,
        update: updateCategory,
        toggleActive: toggleCategoryActive,
        remove: deleteCategory,
      }}
    />
  );
}
