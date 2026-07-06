import { NextResponse } from "next/server";

// Converts international gold spot price (USD/troy oz) to INR/gram for 22kt gold
export async function GET() {
  try {
    // Fetch gold spot price in USD/troy oz
    const goldRes = await fetch("https://metals.live/api/spot/gold", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!goldRes.ok) throw new Error("Gold price fetch failed");
    const goldData = await goldRes.json();
    // metals.live returns { price: number, ... }
    const usdPerTroyOz: number = goldData.price ?? goldData[0]?.price;
    if (!usdPerTroyOz) throw new Error("Invalid gold price response");

    // Fetch USD → INR exchange rate
    const fxRes = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    });
    if (!fxRes.ok) throw new Error("Exchange rate fetch failed");
    const fxData = await fxRes.json();
    const inrPerUsd: number = fxData.rates?.INR;
    if (!inrPerUsd) throw new Error("Invalid exchange rate response");

    // 1 troy oz = 31.1035 grams; 22kt purity = 22/24 = 0.9167
    const inrPerGram22kt = Math.round((usdPerTroyOz * inrPerUsd) / 31.1035 * 0.9167);

    return NextResponse.json({
      ratePerGram: inrPerGram22kt,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Gold rate fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch gold rate" }, { status: 500 });
  }
}
