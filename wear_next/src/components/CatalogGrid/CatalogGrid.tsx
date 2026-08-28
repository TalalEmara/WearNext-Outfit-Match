import React from "react";
import { type ClothesItem, type ClothingCategory } from "../../types";
import { Button } from "../Button/Button";
import { ItemCard } from "../ItemCard/ItemCard";
import styles from "./CatalogGrid.module.css";

export interface CatalogGridProps {
  items: ClothesItem[];
  selectedCategory: "All" | ClothingCategory;
  onCategoryChange: (category: "All" | ClothingCategory) => void;
  onSelectItem: (item: ClothesItem) => void;
  onMobileBack?: () => void;
  title?: string;
}

export const CatalogGrid: React.FC<CatalogGridProps> = ({
  items,
  selectedCategory,
  onCategoryChange,
  onSelectItem,
  onMobileBack,
  title = "Wardrobe Catalog",
}) => {
  const categories: ("All" | ClothingCategory)[] = ["All", "Top", "Bottom", "Shoes"];

  return (
    <section className={styles.catalogContainer}>
      <div className={styles.catalogHeader}>
        <div className={styles.titleArea}>
          {onMobileBack && (
            <div className={styles.mobileBackButton}>
              <Button
                label="← Back to Outfit"
                variant="secondary"
                size="sm"
                onClick={onMobileBack}
              />
            </div>
          )}
          <h2 className={styles.sectionTitle}>{title}</h2>
        </div>

        {/* Category Filter Tabs using Button */}
        <div className={styles.categoryTabs}>
          {categories.map((cat) => (
            <Button
              key={cat}
              label={cat}
              variant={selectedCategory === cat ? "primary" : "ghost"}
              size="sm"
              onClick={() => onCategoryChange(cat)}
            />
          ))}
        </div>
      </div>

      {/* Auto-scaling Grid of Item Cards */}
      <div className={styles.itemsGrid}>
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onSelect={onSelectItem} />
        ))}
      </div>
    </section>
  );
};

export default CatalogGrid;
