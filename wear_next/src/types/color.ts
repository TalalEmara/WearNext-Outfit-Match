export interface ColorEntity {
  name: string;
  hex: string;
}

export interface ColorMatchRelation {
  color1: string;
  color2: string;
  rate: number; // 1..5
}
