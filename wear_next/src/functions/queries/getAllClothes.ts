import { driver } from "../cognoConnection";
import { type ClothesItem, type ClothingCategory } from "../../types";
import { getImageUrl } from "../getImageUrl";

export async function getAllClothes(): Promise<ClothesItem[]> {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (item:ClothesItem)-[:IN_COLOR]->(c:Color), (item)-[:HAS_STYLE]->(s:Style)
      RETURN
        item.id       AS id,
        item.itemName AS itemName,
        CASE
          WHEN item:Top    THEN 'Top'
          WHEN item:Bottom THEN 'Bottom'
          ELSE 'Shoes'
        END           AS category,
        c.name        AS color,
        s.name        AS style
      ORDER BY category, itemName
    `);

    return result.records.map((r) => {
      const itemName = r.get("itemName");
      return {
        id: r.get("id"),
        itemName,
        category: r.get("category") as ClothingCategory,
        color: r.get("color"),
        style: r.get("style"),
        imageUrl: getImageUrl(itemName),
      };
    });
  } finally {
    await session.close();
  }
}
