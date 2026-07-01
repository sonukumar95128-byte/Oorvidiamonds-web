import { NextResponse } from "next/server";
import fs from "fs";

const PATHS_TO_CHECK = [
  "/home/u771790581/product-images",
  "/home/u771790581/domains/lakshiraah.com/product-images",
  "/home/u771790581/domains/lakshiraah.com/public_html/product-images",
  "/home/u771790581/domains/lakshiraah.com/public_html/Product-images",
];

export async function GET() {
  const result: Record<string, string> = {};
  for (const p of PATHS_TO_CHECK) {
    try {
      const files = fs.readdirSync(p);
      result[p] = `EXISTS — ${files.length} files, first: ${files[0]}`;
    } catch {
      result[p] = "NOT FOUND";
    }
  }
  return NextResponse.json(result);
}
