import type { BarcodeType } from "@prisma/client";

export function generateBarcodeValue(sku: string, type: BarcodeType = "CODE128"): string {
  if (type === "EAN13") {
    const base = sku.replace(/\D/g, "").padStart(12, "0").slice(0, 12);
    const checkDigit = calculateEAN13CheckDigit(base);
    return base + checkDigit;
  }
  return `SM${sku.replace(/[^A-Z0-9]/gi, "").toUpperCase()}`;
}

function calculateEAN13CheckDigit(base12: string): string {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(base12[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const check = (10 - (sum % 10)) % 10;
  return check.toString();
}

export async function renderBarcodeSVG(
  code: string,
  type: BarcodeType = "CODE128"
): Promise<string> {
  const JsBarcode = (await import("jsbarcode")).default;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  const format = type === "EAN13" ? "EAN13" : "CODE128";

  JsBarcode(svg, code, {
    format,
    width: 2,
    height: 80,
    displayValue: true,
    fontSize: 14,
    margin: 10,
    background: "#ffffff",
    lineColor: "#000000",
  });

  return new XMLSerializer().serializeToString(svg);
}

export function getBarcodeFormat(type: BarcodeType): string {
  switch (type) {
    case "EAN13":
      return "EAN13";
    case "QR":
      return "QR";
    default:
      return "CODE128";
  }
}
