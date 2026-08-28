import React from "react";
import { type ClothingCategory, type OutfitState } from "../../types";
import { Button } from "../Button/Button";
import { OutfitSlotCard } from "../OutfitSlotCard/OutfitSlotCard";
import styles from "./MatchedOutfitPreview.module.css";

export interface MatchedOutfitPreviewProps {
  outfit: OutfitState;
  onSlotClick: (category: ClothingCategory) => void;
  onClearSlot: (category: ClothingCategory, e: React.MouseEvent) => void;
  onResetOutfit?: () => void;
  title?: string;
}

export const MatchedOutfitPreview: React.FC<MatchedOutfitPreviewProps> = ({
  outfit,
  onSlotClick,
  onClearSlot,
  onResetOutfit,
  title = "Matched Outfit",
}) => {
  const hasSelectedItems = Boolean(outfit.Top || outfit.Bottom || outfit.Shoes);
  const categories: ClothingCategory[] = ["Top", "Bottom", "Shoes"];

  return (
    <aside className={styles.rightPanel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>{title}</h2>
        {hasSelectedItems && onResetOutfit && (
          <Button
            label="Reset"
            variant="ghost"
            size="sm"
            onClick={onResetOutfit}
          />
        )}
      </div>

      <div className={styles.outfitCardsContainer}>
        {categories.map((cat) => (
          <OutfitSlotCard
            key={cat}
            category={cat}
            item={outfit[cat]}
            onClick={() => onSlotClick(cat)}
            onClear={(e) => {
              e.stopPropagation();
              onClearSlot(cat, e);
            }}
          />
        ))}
      </div>
    </aside>
  );
};

export default MatchedOutfitPreview;
