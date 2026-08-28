import React from "react";
import { type ClothingCategory } from "../../types";
import styles from "./CategorySelector.module.css";

export interface CategorySelectorProps {
  value: ClothingCategory;
  onChange: (category: ClothingCategory) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
}) => {
  const categories: { label: ClothingCategory; icon: React.ReactNode }[] = [
    {
      label: "Top",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
        </svg>
      ),
    },
    {
      label: "Bottom",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 2h16v3l-2 17H6L4 5V2z" />
          <line x1="12" y1="22" x2="12" y2="7" />
        </svg>
      ),
    },
    {
      label: "Shoes",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-2a4 4 0 0 1 4-4h4a2 2 0 0 0 2-2V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.grid}>
      {categories.map((cat) => {
        const isSelected = value === cat.label;
        return (
          <div
            key={cat.label}
            className={`${styles.card} ${isSelected ? styles.cardActive : ""}`}
            onClick={() => onChange(cat.label)}
          >
            <div className={styles.iconWrapper}>{cat.icon}</div>
            <span className={styles.label}>{cat.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default CategorySelector;
