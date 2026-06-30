"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useAdmin } from "@/lib/admin-store";

type BannerImagePickerProps = {
  value: string;
  onChange: (image: string) => void;
};

type Tab = "upload" | "products";

const MAX_SIZE_MB = 2;
const RECOMMENDED = "1920 × 700 px (hero) · 1600 × 500 px (promo strip)";

export function BannerImagePicker({ value, onChange }: BannerImagePickerProps) {
  const { products } = useAdmin();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("upload");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 60);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, WebP, or AVIF images are supported.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large — please upload under ${MAX_SIZE_MB} MB.`);
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      onChange(dataUrl);
      setOpen(false);
      setUploading(false);
    };
    reader.onerror = () => {
      setError("Failed to read file. Please try again.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-xs text-gold underline hover:text-brand"
      >
        Change image
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-80 rounded-xl border border-beige bg-white shadow-lg">
          {/* Tabs */}
          <div className="flex border-b border-beige">
            {(["upload", "products"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={
                  "flex-1 py-2 text-xs font-medium capitalize transition-colors " +
                  (tab === t ? "text-brand border-b-2 border-gold -mb-px" : "text-ink/50 hover:text-brand")
                }
              >
                {t === "upload" ? "Upload from PC" : "Product photos"}
              </button>
            ))}
          </div>

          <div className="p-3">
            {tab === "upload" && (
              <div>
                {/* Size guidance */}
                <div className="mb-3 rounded-lg bg-beige/50 px-3 py-2 text-xs text-ink/60 leading-relaxed">
                  <p className="font-medium text-brand mb-0.5">Recommended size</p>
                  <p>{RECOMMENDED}</p>
                  <p className="mt-0.5">Format: JPG · PNG · WebP · Max {MAX_SIZE_MB} MB</p>
                </div>

                <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-beige hover:border-gold transition-colors cursor-pointer py-6 px-4">
                  <span className="text-2xl">🖼</span>
                  <span className="text-sm font-medium text-brand">
                    {uploading ? "Reading file…" : "Click to choose file"}
                  </span>
                  <span className="text-xs text-ink/40">JPG, PNG, WebP accepted</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleFile}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>

                {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

                {value?.startsWith("data:") && (
                  <div className="mt-3">
                    <p className="text-xs text-ink/50 mb-1">Current (uploaded):</p>
                    <div className="relative h-16 w-full rounded-lg overflow-hidden bg-beige">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={value} alt="Current banner" className="h-full w-full object-cover" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === "products" && (
              <>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="mb-2 w-full rounded-lg border border-beige px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto">
                  {filtered.map((p) => (
                    <button
                      key={p.slug}
                      type="button"
                      onClick={() => {
                        onChange(p.image);
                        setOpen(false);
                      }}
                      className={
                        "relative aspect-square rounded-lg overflow-hidden border-2 " +
                        (value === p.image ? "border-gold" : "border-transparent")
                      }
                      title={p.name}
                    >
                      <Image src={p.image} alt={p.name} fill sizes="64px" className="object-cover" />
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <p className="col-span-4 py-4 text-center text-xs text-ink/40">No products match.</p>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="px-3 pb-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full rounded-full border border-beige px-3 py-1.5 text-xs text-ink/60 hover:border-gold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
