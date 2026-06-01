"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { listAdminBrands } from "@/services/adminBrands";
import { listAdminCategories } from "@/services/adminCategories";
import type { AdminProduct } from "@/types/admin";
import type { ProductPayload } from "@/services/adminProducts";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Field,
  inputClass,
  selectClass,
  textareaClass,
  CheckboxRow,
} from "./fields";

const idString = z.string().refine((v) => v !== "" && Number(v) > 0, "Requerido");
const priceString = z
  .string()
  .refine(
    (v) => v.trim() !== "" && !Number.isNaN(Number(v)) && Number(v) >= 0,
    "Ingresa un precio válido (>= 0)",
  );
const optionalPriceString = z
  .string()
  .refine(
    (v) => v.trim() === "" || (!Number.isNaN(Number(v)) && Number(v) >= 0),
    "Precio inválido",
  );

const schema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(180),
  slug: z.string().max(200),
  brandId: idString,
  categoryId: idString,
  flavor: z.string().max(120),
  presentation: z.string().max(120),
  containerType: z.string().max(60),
  shortDescription: z.string().max(300, "Máximo 300 caracteres"),
  description: z.string().max(5000),
  currentPrice: priceString,
  oldPrice: optionalPriceString,
  currency: z.string().max(3),
  sortOrder: z.string(),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  isPromo: z.boolean(),
  isVisible: z.boolean(),
  active: z.boolean(),
});
type FormValues = z.infer<typeof schema>;

function initialValues(p?: AdminProduct): FormValues {
  return {
    name: p?.name ?? "",
    slug: p?.slug ?? "",
    brandId: p?.brand ? String(p.brand.id) : "",
    categoryId: p?.category ? String(p.category.id) : "",
    flavor: p?.flavor ?? "",
    presentation: p?.presentation ?? "",
    containerType: p?.containerType ?? "",
    shortDescription: p?.shortDescription ?? "",
    description: p?.description ?? "",
    currentPrice: p ? String(p.currentPrice) : "",
    oldPrice: p?.oldPrice != null ? String(p.oldPrice) : "",
    currency: p?.currency ?? "COP",
    sortOrder: p ? String(p.sortOrder) : "0",
    isFeatured: p?.isFeatured ?? false,
    isNew: p?.isNew ?? false,
    isPromo: p?.isPromo ?? false,
    isVisible: p?.isVisible ?? true,
    active: p?.active ?? true,
  };
}

export function ProductForm({
  product,
  submitLabel,
  onSubmit,
}: {
  product?: AdminProduct;
  submitLabel: string;
  onSubmit: (payload: ProductPayload) => Promise<void>;
}) {
  const brandsQuery = useQuery({
    queryKey: ["admin-brands"],
    queryFn: listAdminBrands,
  });
  const categoriesQuery = useQuery({
    queryKey: ["admin-categories"],
    queryFn: listAdminCategories,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues(product),
  });

  // useWatch en lugar de watch(): compatible con el React Compiler.
  const cp = Number(useWatch({ control, name: "currentPrice" }));
  const op = Number(useWatch({ control, name: "oldPrice" }));
  const currencyValue = useWatch({ control, name: "currency" });
  const discount =
    !Number.isNaN(cp) && !Number.isNaN(op) && op > cp && op > 0
      ? Math.round(((op - cp) / op) * 100)
      : null;

  async function submit(values: FormValues) {
    const payload: ProductPayload = {
      name: values.name,
      slug: values.slug || undefined,
      brandId: Number(values.brandId),
      categoryId: Number(values.categoryId),
      flavor: values.flavor || null,
      presentation: values.presentation || null,
      containerType: values.containerType || null,
      shortDescription: values.shortDescription || null,
      description: values.description || null,
      currentPrice: Number(values.currentPrice),
      oldPrice: values.oldPrice.trim() === "" ? null : Number(values.oldPrice),
      currency: values.currency || "COP",
      sortOrder: Number(values.sortOrder || "0"),
      isFeatured: values.isFeatured,
      isNew: values.isNew,
      isPromo: values.isPromo,
      isVisible: values.isVisible,
      active: values.active,
    };
    await onSubmit(payload);
  }

  const noBrands = !brandsQuery.isLoading && (brandsQuery.data ?? []).length === 0;
  const noCategories =
    !categoriesQuery.isLoading && (categoriesQuery.data ?? []).length === 0;

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      {(noBrands || noCategories) && (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
          Debes crear al menos una marca y una categoría antes de guardar un
          producto.
        </p>
      )}

      <Section title="Información básica">
        <Field label="Nombre" htmlFor="name" required error={errors.name?.message} className="sm:col-span-2">
          <input id="name" className={inputClass} {...register("name")} />
        </Field>
        <Field
          label="Slug"
          htmlFor="slug"
          hint="Opcional: se genera del nombre si se deja vacío"
          error={errors.slug?.message}
          className="sm:col-span-2"
        >
          <input id="slug" className={inputClass} {...register("slug")} />
        </Field>
        <Field label="Marca" htmlFor="brandId" required error={errors.brandId?.message}>
          <select id="brandId" className={selectClass} {...register("brandId")}>
            <option value="">Selecciona una marca</option>
            {(brandsQuery.data ?? []).map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Categoría"
          htmlFor="categoryId"
          required
          error={errors.categoryId?.message}
        >
          <select
            id="categoryId"
            className={selectClass}
            {...register("categoryId")}
          >
            <option value="">Selecciona una categoría</option>
            {(categoriesQuery.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <Section title="Atributos">
        <Field label="Sabor" htmlFor="flavor" error={errors.flavor?.message}>
          <input id="flavor" className={inputClass} {...register("flavor")} />
        </Field>
        <Field
          label="Presentación"
          htmlFor="presentation"
          hint="Ej. 400 ml"
          error={errors.presentation?.message}
        >
          <input
            id="presentation"
            className={inputClass}
            {...register("presentation")}
          />
        </Field>
        <Field
          label="Tipo de envase"
          htmlFor="containerType"
          hint="Ej. Botella PET"
          error={errors.containerType?.message}
        >
          <input
            id="containerType"
            className={inputClass}
            {...register("containerType")}
          />
        </Field>
        <Field
          label="Orden"
          htmlFor="sortOrder"
          hint="Menor aparece primero"
          error={errors.sortOrder?.message}
        >
          <input
            id="sortOrder"
            type="number"
            min={0}
            className={inputClass}
            {...register("sortOrder")}
          />
        </Field>
      </Section>

      <Section title="Precios">
        <Field
          label="Precio actual"
          htmlFor="currentPrice"
          required
          error={errors.currentPrice?.message}
        >
          <input
            id="currentPrice"
            type="number"
            min={0}
            step="1"
            className={inputClass}
            {...register("currentPrice")}
          />
        </Field>
        <Field
          label="Precio anterior"
          htmlFor="oldPrice"
          hint="Opcional, para mostrar descuento"
          error={errors.oldPrice?.message}
        >
          <input
            id="oldPrice"
            type="number"
            min={0}
            step="1"
            className={inputClass}
            {...register("oldPrice")}
          />
        </Field>
        <Field label="Moneda" htmlFor="currency" error={errors.currency?.message}>
          <input id="currency" className={inputClass} {...register("currency")} />
        </Field>
        <div className="flex items-end">
          {discount != null ? (
            <div className="flex items-center gap-2">
              <Badge variant="discount" className="text-sm">
                -{discount}%
              </Badge>
              <span className="text-sm text-slate-500">
                Ahorro {formatPrice(op - cp, currencyValue || "COP")}
              </span>
            </div>
          ) : (
            <span className="text-sm text-slate-400">Sin descuento</span>
          )}
        </div>
      </Section>

      <Section title="Descripciones">
        <Field
          label="Descripción corta"
          htmlFor="shortDescription"
          hint="Máximo 300 caracteres"
          error={errors.shortDescription?.message}
          className="sm:col-span-2"
        >
          <input
            id="shortDescription"
            className={inputClass}
            {...register("shortDescription")}
          />
        </Field>
        <Field
          label="Descripción"
          htmlFor="description"
          error={errors.description?.message}
          className="sm:col-span-2"
        >
          <textarea
            id="description"
            rows={4}
            className={textareaClass}
            {...register("description")}
          />
        </Field>
      </Section>

      <Section title="Estados">
        <CheckboxRow label="Visible" description="Aparece en el sitio público" {...register("isVisible")} />
        <CheckboxRow label="Activo" description="Desactivar = borrado lógico" {...register("active")} />
        <CheckboxRow label="Destacado" {...register("isFeatured")} />
        <CheckboxRow label="Nuevo" {...register("isNew")} />
        <CheckboxRow label="En promoción" {...register("isPromo")} />
      </Section>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}
