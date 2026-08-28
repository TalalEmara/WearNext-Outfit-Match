import React from "react";
import { type ClothesItem } from "../../types";
import { Button } from "../Button/Button";
import styles from "./ItemCard.module.css";

export interface ItemCardProps {
  item: ClothesItem;
  onSelect: (item: ClothesItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onSelect }) => {
  const [imgError, setImgError] = React.useState(false);

  // Reset imgError if item changes
  React.useEffect(() => {
    setImgError(false);
  }, [item.imageUrl, item.id]);

  return (
    <div className={styles.itemCard} onClick={() => onSelect(item)}>
      <div className={styles.itemImageWrapper}>
        {item.imageUrl && !imgError ? (
          <img
            src={item.imageUrl}
            alt={item.itemName}
            className={styles.itemImage}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.noImage}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>{item.itemName}</span>
          </div>
        )}
        <span className={styles.categoryBadge}>{item.category}</span>
      </div>

      <div className={styles.itemContent}>
        <h3 className={styles.itemName}>{item.itemName}</h3>
        <div className={styles.itemMeta}>
          <span className={styles.metaPill}>{item.color}</span>
          <span className={styles.metaPill}>{item.style}</span>
        </div>
        <Button
          label={`Select ${item.category}`}
          variant="outline"
          size="sm"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item);
          }}
        />
      </div>
    </div>
  );
};

export default ItemCard;
