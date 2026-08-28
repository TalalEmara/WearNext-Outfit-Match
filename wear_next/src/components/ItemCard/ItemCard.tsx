import React from "react";
import { type ClothesItem } from "../../types";
import { Button } from "../Button/Button";
import styles from "./ItemCard.module.css";

export interface ItemCardProps {
  item: ClothesItem;
  onSelect: (item: ClothesItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onSelect }) => {
  return (
    <div className={styles.itemCard} onClick={() => onSelect(item)}>
      <div className={styles.itemImageWrapper}>
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.itemName}
            className={styles.itemImage}
            loading="lazy"
          />
        ) : (
          <div className={styles.noImage}>No Image</div>
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
