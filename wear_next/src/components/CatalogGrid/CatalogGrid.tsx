import React from "react";
import { Link } from "@tanstack/react-router";
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
  isLoading?: boolean;
}

export const CatalogGrid: React.FC<CatalogGridProps> = ({
  items,
  selectedCategory,
  onCategoryChange,
  onSelectItem,
  onMobileBack,
  title = "Wardrobe Catalog",
  isLoading = false,
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

      {/* ── Loading Skeleton State ─────────────────────────── */}
      {isLoading ? (
        <div className={styles.itemsGrid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={styles.skeletonCard}>
              <div className={styles.skeletonImage} />
              <div className={styles.skeletonContent}>
                <div className={styles.skeletonLineTitle} />
                <div className={styles.skeletonPills}>
                  <div className={styles.skeletonPill} />
                  <div className={styles.skeletonPill} />
                </div>
                <div className={styles.skeletonBtn} />
              </div>
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        /* ── Populated Grid ────────────────────────────────── */
        <div className={styles.itemsGrid}>
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onSelect={onSelectItem} />
          ))}
        </div>
      ) : (
        /* ── Empty State ───────────────────────────────────── */
        <div className={styles.emptyState}>
          <svg
            className={styles.emptyIcon}
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <h3 className={styles.emptyTitle}>No items found</h3>
          <p className={styles.emptySubtitle}>
            {selectedCategory === "All"
              ? "Your wardrobe is empty. Add new items to start matching."
              : `No matching items available in the ${selectedCategory} category.`}
          </p>
          <Link to="/clothes/add" style={{ textDecoration: "none" }}>
            <Button label="+ Add Clothes" variant="primary" size="sm" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default CatalogGrid;
