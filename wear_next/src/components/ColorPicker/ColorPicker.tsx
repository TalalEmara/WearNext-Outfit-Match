import React from "react";
import { type ColorEntity } from "../../types";
import styles from "./ColorPicker.module.css";

export const PRESET_COLORS: ColorEntity[] = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Black", hex: "#000000" },
  { name: "Navy Blue", hex: "#001F3F" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Olive Green", hex: "#556B2F" },
  { name: "Charcoal Grey", hex: "#36454F" },
  { name: "Light Blue", hex: "#ADD8E6" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Tan/Brown", hex: "#8B4513" },
];

export interface ColorPickerProps {
  value: string;
  onChange: (colorName: string) => void;
  colors?: ColorEntity[];
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  colors = PRESET_COLORS,
}) => {
  return (
    <div className={styles.colorGrid}>
      {colors.map((c) => {
        const isSelected = value === c.name;
        return (
          <button
            key={c.name}
            type="button"
            className={`${styles.colorChip} ${isSelected ? styles.chipActive : ""}`}
            onClick={() => onChange(c.name)}
          >
            <span
              className={styles.colorDot}
              style={{ backgroundColor: c.hex }}
            />
            <span>{c.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ColorPicker;
