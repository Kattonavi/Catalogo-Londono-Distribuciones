"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, RefreshCw, Trash2, ImageIcon } from "lucide-react";
import {
  uploadProductImage,
  replaceProductImage,
  deleteProductImage,
} from "@/services/adminProducts";
import type { AdminProduct } from "@/types/admin";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "./Dialog";
import { useToast } from "./Toast";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

function validate(file: File): string | null {
  if (!ALLOWED.includes(file.type)) {
    return "Formato no permitido. Usa jpg, png o webp.";
  }
  if (file.size > MAX_BYTES) {
    return "La imagen supera el tamaño máximo de 5 MB.";
  }
  return null;
}

export function ProductImageManager({
  product,
  onChanged,
}: {
  product: AdminProduct;
  onChanged: () => void;
}) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const hasImage = Boolean(product.imageUrl);

  function pick() {
    inputRef.current?.click();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    const error = validate(selected);
    if (error) {
      toast.error(error);
      e.target.value = "";
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  function reset() {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function save() {
    if (!file) return;
    setBusy(true);
    try {
      if (hasImage) {
        await replaceProductImage(product.id, file);
        toast.success("Imagen reemplazada");
      } else {
        await uploadProductImage(product.id, file);
        toast.success("Imagen subida");
      }
      reset();
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo subir la imagen");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await deleteProductImage(product.id);
      toast.success("Imagen eliminada");
      reset();
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo eliminar la imagen");
    } finally {
      setBusy(false);
      setConfirmDelete(false);
    }
  }

  const shownImage = preview ?? product.imageUrl;

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
        Imagen
      </h2>

      <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
        {shownImage ? (
          <Image
            src={shownImage}
            alt={product.name}
            fill
            sizes="320px"
            className="object-cover"
            unoptimized={Boolean(preview)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-300">
            <ImageIcon className="size-10" />
            <span className="text-xs font-medium">Sin imagen</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onFileChange}
        className="hidden"
      />

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {!file ? (
          <>
            <Button variant="secondary" size="sm" onClick={pick} disabled={busy}>
              {hasImage ? (
                <>
                  <RefreshCw className="size-4" /> Reemplazar
                </>
              ) : (
                <>
                  <Upload className="size-4" /> Subir imagen
                </>
              )}
            </Button>
            {hasImage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDelete(true)}
                disabled={busy}
              >
                <Trash2 className="size-4 text-rose-500" /> Eliminar
              </Button>
            )}
          </>
        ) : (
          <>
            <Button size="sm" onClick={save} disabled={busy}>
              {busy ? "Subiendo..." : "Confirmar"}
            </Button>
            <Button variant="ghost" size="sm" onClick={reset} disabled={busy}>
              Cancelar
            </Button>
          </>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-slate-400">
        jpg, png o webp · máx. 5 MB
      </p>

      <ConfirmDialog
        open={confirmDelete}
        title="Eliminar imagen"
        message="¿Seguro que deseas eliminar la imagen de este producto?"
        confirmLabel="Eliminar"
        loading={busy}
        onConfirm={remove}
        onClose={() => setConfirmDelete(false)}
      />
    </div>
  );
}
