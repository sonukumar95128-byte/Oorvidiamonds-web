"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/lib/admin-store";

export function AnnouncementBar() {
  const { settings, updateSettings } = useAdmin();
  const [liveRate, setLiveRate] = useState<number | null>(null);

  useEffect(() => {
    if (settings.goldRateMode !== "auto") return;
    fetch("/api/gold-rate")
      .then((r) => r.json())
      .then((data) => {
        if (data.ratePerGram) {
          setLiveRate(data.ratePerGram);
          updateSettings({ goldRatePerGram: data.ratePerGram });
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.goldRateMode]);

  const rate = settings.goldRateMode === "auto" ? (liveRate ?? settings.goldRatePerGram) : settings.goldRatePerGram;
  const text = settings.announcementText || "";

  const displayText = settings.showGoldRateInBar
    ? text.replace(/₹[\d,]+\/g/g, `₹${rate.toLocaleString("en-IN")}/g`)
    : text.replace(/·?\s*Today'?s gold rate ₹[\d,]+\/g\s*·?/gi, "").replace(/·\s*·/g, "·").trim().replace(/^·|·$/g, "").trim();

  if (!displayText) return null;

  return (
    <div className="bg-brand text-gold-light text-center text-[13px] uppercase tracking-[2.5px] font-light py-2.5 px-4">
      {displayText}
    </div>
  );
}
