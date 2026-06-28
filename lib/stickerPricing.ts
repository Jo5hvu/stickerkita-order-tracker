// StickerKita Pricing Algorithm
// Compatible with current StickerKita Order Tracker environment
//
// Rules:
// 1. Default size = Math.ceil((width + height) / 2)
// 2. If sticker is very long, use longest side instead
// 3. Price is calculated based on material, size, and quantity
// 4. Quantity supports 100 pcs and above

export type StickerMaterial = "mirrorcoate" | "waterproof" | "transparent";

export type StickerPriceResult = {
  price: number | null;
  material: StickerMaterial;
  widthCm: number;
  heightCm: number;
  quantity: number;
  sizeUsed: number | null;
  pricingMethod: "average-size" | "longest-side" | "custom-quote";
  message: string;
};

type PriceTier = {
  500: number;
  1000: number;
};

type PriceTable = Record<StickerMaterial, Record<number, PriceTier>>;

export const stickerPriceTable: PriceTable = {
  mirrorcoate: {
    3: { 500: 17, 1000: 27 },
    4: { 500: 19, 1000: 39 },
    5: { 500: 25, 1000: 59 },
    6: { 500: 33, 1000: 69 },
    7: { 500: 45, 1000: 89 },
    8: { 500: 59, 1000: 99 },
    9: { 500: 69, 1000: 109 },
    10: { 500: 85, 1000: 139 },
    11: { 500: 99, 1000: 159 },
    12: { 500: 109, 1000: 169 },
    13: { 500: 125, 1000: 189 },
    14: { 500: 139, 1000: 209 },
    15: { 500: 159, 1000: 239 },
  },

  waterproof: {
    4: { 500: 33, 1000: 49 },
    5: { 500: 39, 1000: 59 },
    6: { 500: 49, 1000: 69 },
    7: { 500: 65, 1000: 99 },
    8: { 500: 79, 1000: 139 },
    9: { 500: 89, 1000: 149 },
    10: { 500: 109, 1000: 179 },
    11: { 500: 129, 1000: 199 },
    12: { 500: 139, 1000: 219 },
    13: { 500: 159, 1000: 249 },
    14: { 500: 179, 1000: 279 },
    15: { 500: 199, 1000: 309 },
  },

  transparent: {
    4: { 500: 33, 1000: 49 },
    5: { 500: 39, 1000: 59 },
    6: { 500: 49, 1000: 69 },
    7: { 500: 65, 1000: 99 },
    8: { 500: 79, 1000: 139 },
    9: { 500: 89, 1000: 149 },
    10: { 500: 109, 1000: 179 },
    11: { 500: 129, 1000: 199 },
    12: { 500: 139, 1000: 219 },
    13: { 500: 159, 1000: 249 },
    14: { 500: 179, 1000: 279 },
    15: { 500: 199, 1000: 309 },
  },
};

export function getMaterialGroup(material: string): StickerMaterial {
  const lowerMaterial = material.toLowerCase();

  if (lowerMaterial.includes("waterproof")) {
    return "waterproof";
  }

  if (lowerMaterial.includes("transparent")) {
    return "transparent";
  }

  return "mirrorcoate";
}

export function calculateStickerSize({
  shape,
  size,
  width,
  height,
}: {
  shape: string;
  size: number;
  width: number;
  height: number;
}) {
  const lowerShape = shape.toLowerCase();

  const finalWidth =
    width > 0 ? width : size > 0 ? size : 0;

  const finalHeight =
    height > 0 ? height : size > 0 ? size : 0;

  if (finalWidth <= 0 || finalHeight <= 0) {
    return 0;
  }

  // Circle and square use direct size if entered
  if ((lowerShape === "circle" || lowerShape === "square") && size > 0) {
    return Math.ceil(size);
  }

  const shortSide = Math.min(finalWidth, finalHeight);
  const longSide = Math.max(finalWidth, finalHeight);
  const averageSize = (finalWidth + finalHeight) / 2;
  const ratio = longSide / shortSide;

  // Very long sticker uses longest side
  if (ratio >= 2) {
    return Math.ceil(longSide);
  }

  return Math.ceil(averageSize);
}

export function calculateStickerPriceDetailed(
  material: StickerMaterial,
  widthCm: number,
  heightCm: number,
  quantity: number
): StickerPriceResult {
  if (!material || widthCm <= 0 || heightCm <= 0 || quantity <= 0) {
    return {
      price: null,
      material,
      widthCm,
      heightCm,
      quantity,
      sizeUsed: null,
      pricingMethod: "custom-quote",
      message: "Please enter a valid material, size, and quantity.",
    };
  }

  const shortSide = Math.min(widthCm, heightCm);
  const longSide = Math.max(widthCm, heightCm);
  const averageSize = (widthCm + heightCm) / 2;
  const ratio = longSide / shortSide;

  let sizeUsed = Math.ceil(averageSize);
  let pricingMethod: StickerPriceResult["pricingMethod"] = "average-size";

  if (ratio >= 2) {
    sizeUsed = Math.ceil(longSide);
    pricingMethod = "longest-side";
  }

  const tier = stickerPriceTable[material]?.[sizeUsed];

  if (!tier) {
    return {
      price: null,
      material,
      widthCm,
      heightCm,
      quantity,
      sizeUsed,
      pricingMethod: "custom-quote",
      message: `Custom quote required for ${sizeUsed}cm ${material} sticker.`,
    };
  }

  const price500 = tier[500];
  const price1000 = tier[1000];

  let price = 0;

  if (quantity <= 100) {
    price = price500 * 0.4;
  } else if (quantity <= 200) {
    price = price500 * 0.55;
  } else if (quantity <= 300) {
    price = price500 * 0.7;
  } else if (quantity <= 400) {
    price = price500 * 0.85;
  } else if (quantity <= 500) {
    price = price500;
  } else if (quantity <= 1000) {
    price = price500 + ((quantity - 500) / 500) * (price1000 - price500);
  } else {
    price = price1000 * (quantity / 1000);
  }

  const roundedPrice = Math.round(price);

  return {
    price: roundedPrice,
    material,
    widthCm,
    heightCm,
    quantity,
    sizeUsed,
    pricingMethod,
    message: `Estimated price is RM${roundedPrice} using ${sizeUsed}cm pricing.`,
  };
}

// This keeps your current OrderForm.tsx compatible
export function calculateStickerPrice({
  material,
  size,
  quantity,
  width,
  height,
}: {
  material: string;
  size: number;
  quantity: number;
  width?: number;
  height?: number;
}) {
  const normalizedMaterial = getMaterialGroup(material);

  const finalWidth =
    width && width > 0 ? width : size > 0 ? size : 0;

  const finalHeight =
    height && height > 0 ? height : size > 0 ? size : 0;

  const result = calculateStickerPriceDetailed(
    normalizedMaterial,
    finalWidth,
    finalHeight,
    quantity
  );

  return result.price || 0;
}