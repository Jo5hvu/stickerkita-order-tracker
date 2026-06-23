type MaterialGroup = "mirrorcoate" | "waterproofTransparent";

type PriceTable = {
  [size: number]: {
    [quantity: number]: number;
  };
};

const mirrorcoatePrices: PriceTable = {
  3: { 500: 17, 1000: 27 },
  4: { 500: 19, 1000: 29 },
  5: { 500: 25, 1000: 49 },
  6: { 500: 33, 1000: 59 },
  7: { 500: 45, 1000: 69 },
  8: { 500: 59, 1000: 99 },
  9: { 500: 69, 1000: 109 },
};

const waterproofTransparentPrices: PriceTable = {
  4: { 500: 33, 1000: 49 },
  5: { 500: 39, 1000: 59 },
  6: { 500: 49, 1000: 69 },
  7: { 500: 65, 1000: 99 },
  8: { 500: 79, 1000: 139 },
  9: { 500: 89, 1000: 149 },
};

export function getMaterialGroup(material: string): MaterialGroup {
  const lowerMaterial = material.toLowerCase();

  if (
    lowerMaterial.includes("waterproof") ||
    lowerMaterial.includes("transparent")
  ) {
    return "waterproofTransparent";
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

  if (lowerShape === "circle" || lowerShape === "square") {
    return Math.round(size);
  }

  const calculatedSize = (width + height) / 2;

  return Math.round(calculatedSize);
}

export function calculateStickerPrice({
  material,
  size,
  quantity,
}: {
  material: string;
  size: number;
  quantity: number;
}) {
  const materialGroup = getMaterialGroup(material);

  const priceTable =
    materialGroup === "mirrorcoate"
      ? mirrorcoatePrices
      : waterproofTransparentPrices;

  const roundedSize = Math.round(size);
  const sizePrices = priceTable[roundedSize];

  if (!sizePrices || quantity < 100 || quantity > 100000) {
    return 0;
  }

  // Exact package prices
  if (sizePrices[quantity]) {
    return sizePrices[quantity];
  }

  let calculatedPrice = 0;

  // 100pcs to 499pcs
  // Based on 500pcs price
  if (quantity < 500) {
    calculatedPrice = (quantity / 500) * sizePrices[500];
  }

  // 501pcs to 999pcs
  // Based on 1000pcs price
  else if (quantity < 1000) {
    calculatedPrice = (quantity / 1000) * sizePrices[1000];
  }

  // 1001pcs to 100,000pcs
  // Based on 1000pcs price
  else {
    calculatedPrice = (quantity / 1000) * sizePrices[1000];
  }

  return Number(calculatedPrice.toFixed(2));
}