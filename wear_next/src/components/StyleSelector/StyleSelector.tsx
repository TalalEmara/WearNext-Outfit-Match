import React from "react";
import { type StyleName } from "../../types";
import styles from "./StyleSelector.module.css";

export const PRESET_STYLES: { name: StyleName; desc: string }[] = [
  { name: "Formal", desc: "Tailored & elegant" },
  { name: "Casual", desc: "Everyday relaxed" },
  { name: "Streetwear", desc: "Urban & oversized" },
  { name: "Minimalist", desc: "Clean & neutral" },
];

export interface StyleSelectorProps {
  value: string;
  onChange: (styleName: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className={styles.styleGrid}>
      {PRESET_STYLES.map((s) => {
        const isSelected = value === s.name;
        return (
          <div
            key={s.name}
            className={`${styles.stylePill} ${isSelected ? styles.styleActive : ""}`}
            onClick={() => onChange(s.name)}
          >
            <span className={styles.styleName}>{s.name}</span>
            <span className={styles.styleDesc}>{s.desc}</span>
          </div>
        );
      })}
    </div>
  );
};

export default StyleSelector;
