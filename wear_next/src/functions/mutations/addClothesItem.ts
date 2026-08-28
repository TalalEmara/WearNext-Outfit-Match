import { randomUUID } from "node:crypto";
import { driver } from "../cognoConnection";
import { type ClothingCategory } from "../../types";

interface AddClothesInput {
  itemName: string;
  category: ClothingCategory;
  color: string;
  style: string;
  imageUrl?: string;
}

/**
 * Creates a new ClothesItem node in the graph with its Color and Style links.
 * Sub-label (Top | Bottom | Shoes) is injected from `category` — safe because
 * it is validated as a ClothingCategory enum before reaching this function.
 */
export async function addClothesItem(input: AddClothesInput): Promise<string> {
  const session = driver.session();
  const id = randomUUID();

  try {
    await session.run(
      `
      MERGE (item:ClothesItem:${input.category} { id: $id })
      SET item.itemName = $itemName,
          item.imageUrl = $imageUrl
      WITH item
      MATCH (c:Color { name: $color })
      MERGE (item)-[:IN_COLOR]->(c)
      WITH item
      MATCH (s:Style { name: $style })
      MERGE (item)-[:HAS_STYLE]->(s)
      `,
      {
        id,
        itemName: input.itemName,
        imageUrl: input.imageUrl ?? null,
        color: input.color,
        style: input.style,
      },
    );

    return id;
  } finally {
    await session.close();
  }
}
