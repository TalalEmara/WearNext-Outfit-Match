export type StyleName = "Formal" | "Casual" | "Streetwear" | "Minimalist" | string;

export interface StyleEntity {
  name: StyleName;
  description?: string;
}
