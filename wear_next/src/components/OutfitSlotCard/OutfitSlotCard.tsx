import React from "react";
import { type ClothesItem, type ClothingCategory } from "../../types";
import { Button } from "../Button/Button";
import styles from "./OutfitSlotCard.module.css";

export interface OutfitSlotCardProps {
  category: ClothingCategory;
  item: ClothesItem | null;
  onClick: () => void;
  onClear: (e: React.MouseEvent) => void;
  fallbackIcon?: React.ReactNode;
}

export const OutfitSlotCard: React.FC<OutfitSlotCardProps> = ({
  category,
  item,
  onClick,
  onClear,
  fallbackIcon,
}) => {
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [item?.imageUrl, item?.id]);

  const defaultFallbackIcons: Record<ClothingCategory, React.ReactNode> = {
    Top: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
      </svg>
    ),
    Bottom: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 2h16v3l-2 17H6L4 5V2z" />
        <line x1="12" y1="22" x2="12" y2="7" />
      </svg>
    ),
    Shoes: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 18v-2a4 4 0 0 1 4-4h4a2 2 0 0 0 2-2V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    ),
  };

  return (
    <div
      className={`${styles.slotCard} ${item ? styles.slotCardFilled : ""}`}
      onClick={onClick}
    >
      <div className={styles.slotThumb}>
        {item?.imageUrl && !imgError ? (
          <img
            src={item.imageUrl}
            alt={item.itemName}
            className={styles.slotThumbImg}
            onError={() => setImgError(true)}
          />
        ) : (
          fallbackIcon || defaultFallbackIcons[category]
        )}
      </div>

      <div className={styles.slotInfo}>
        <span className={styles.slotLabel}>{category} Slot</span>
        {item ? (
          <>
            <h4 className={styles.slotItemName}>{item.itemName}</h4>
            <span className={styles.slotSubText}>
              {item.color} • {item.style}
            </span>
          </>
        ) : (
          <span className={styles.emptySlotText}>+ Choose {category}</span>
        )}
      </div>

      {item && (
        <Button
          label="✕"
          variant="ghost"
          size="sm"
          styling={styles.clearSlotBtn}
          onClick={onClear}
          title="Remove"
        />
      )}
    </div>
  );
};

export default OutfitSlotCard;
