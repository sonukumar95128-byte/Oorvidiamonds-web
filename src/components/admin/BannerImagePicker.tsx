"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useAdmin } from "@/lib/admin-store";

type BannerImagePickerProps = {
  value: string;
  onChange: (image: string) => void;
  recommended?: string;
};

type Tab = "upload" | "products";

export function BannerImagePicker({ value, onChange, recommended }: BannerImagePickerProps) {
  const { products } = useAdmin();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("upload");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 60);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: form, credentials: "same-origin" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
      } else {
        onChange(data.url);
        setOpen(false);
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-xs text-gold underline hover:text-brand"
      >
        Change image
      </button>

      {open && (
        /* Fixed modal overlay — escapes overflow:hidden parent containers */
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
        <div
          className="w-full max-w-sm rounded-xl border border-beige bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
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
                <div className="mb-3 rounded-lg bg-beige/50 px-3 py-2 text-xs text-ink/60 leading-relaxed">
                  <p className="font-medium text-brand mb-0.5">Recommended size</p>
                  <p>{recommended ?? "1920 × 700 px"}</p>
                  <p className="mt-0.5">Format: JPG · PNG · WebP · Max 5 MB</p>
                </div>

                <label className={
                  "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 transition-colors " +
                  (uploading ? "border-beige opacity-60 cursor-not-allowed" : "border-beige hover:border-gold cursor-pointer")
                }>
                  <span className="text-2xl">{uploading ? "⏳" : "🖼"}</span>
                  <span className="text-sm font-medium text-brand">
                    {uploading ? "Uploading…" : "Click to choose file"}
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

                {value && !value.startsWith("data:") && (
                  <div className="mt-3">
                    <p className="text-xs text-ink/50 mb-1">Current image:</p>
                    <div className="relative h-14 w-full rounded-lg overflow-hidden bg-beige">
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
        </div>
      )}
    </div>
  );
}
