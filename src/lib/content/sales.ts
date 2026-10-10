type SaleImage = { image_url: string; is_cover: boolean; sort_order: number };

/** Sale photos, cover first then by owner order. */
export function saleImages(s: Record<string, unknown>): SaleImage[] {
  return ((s.sale_images as SaleImage[]) ?? [])
    .slice()
    .sort((a, b) => Number(b.is_cover) - Number(a.is_cover) || a.sort_order - b.sort_order);
}

export const saleCover = (s: Record<string, unknown>) => saleImages(s)[0]?.image_url ?? null;
