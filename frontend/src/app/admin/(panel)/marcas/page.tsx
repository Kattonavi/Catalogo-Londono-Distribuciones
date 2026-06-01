"use client";

import { CatalogEntityManager } from "@/components/admin/CatalogEntityManager";
import {
  listAdminBrands,
  createBrand,
  updateBrand,
  toggleBrandActive,
  deleteBrand,
} from "@/services/adminBrands";
import type { AdminBrand } from "@/types/admin";

export default function MarcasPage() {
  return (
    <CatalogEntityManager<AdminBrand>
      config={{
        singular: "marca",
        plural: "Marcas",
        queryKey: "admin-brands",
        list: listAdminBrands,
        create: createBrand,
        update: updateBrand,
        toggleActive: toggleBrandActive,
        remove: deleteBrand,
      }}
    />
  );
}
