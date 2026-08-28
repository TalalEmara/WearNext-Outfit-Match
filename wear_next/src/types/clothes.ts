export type ClothingCategory = "Top" | "Bottom" | "Shoes";

export interface ClothesItem {
  id: string;
  itemName: string;
  category: ClothingCategory;
  color: string;
  style: string;
  imageUrl?: string;
}

export interface OutfitState {
  Top: ClothesItem | null;
  Bottom: ClothesItem | null;
  Shoes: ClothesItem | null;
}
