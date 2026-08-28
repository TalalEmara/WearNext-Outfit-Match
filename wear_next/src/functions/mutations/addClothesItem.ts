import { randomUUID } from "node:crypto";
import { driver } from "../cognoConnection";
import { type ClothingCategory } from "../../types";

interface AddClothesInput {
  itemName: string;
  category: ClothingCategory;
  color: string;
  style: string;
}

/**
 * Creates a new ClothesItem node in the graph with its Color and Style links.
 * No image URL is stored in the database.
 */
export async function addClothesItem(input: AddClothesInput): Promise<string> {
  const session = driver.session();
  const id = randomUUID();

  try {
    await session.run(
      `
      MERGE (item:ClothesItem:${input.category} { id: $id })
      SET item.itemName = $itemName
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
        color: input.color,
        style: input.style,
      },
    );

    return id;
  } finally {
    await session.close();
  }
}
