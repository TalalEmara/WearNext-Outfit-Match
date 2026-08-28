import { driver } from "../cognoConnection";
import { type ClothesItem, type ClothingCategory } from "../../types";

export async function getClothesByCategory(category: ClothingCategory): Promise<ClothesItem[]> {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (item:ClothesItem)-[:IN_COLOR]->(c:Color), (item)-[:HAS_STYLE]->(s:Style)
      WHERE item:${category}
      RETURN
        item.id       AS id,
        item.itemName AS itemName,
        $category     AS category,
        c.name        AS color,
        s.name        AS style
      ORDER BY itemName
    `, { category });

    return result.records.map((r) => ({
      id:       r.get("id"),
      itemName: r.get("itemName"),
      category: r.get("category") as ClothingCategory,
      color:    r.get("color"),
      style:    r.get("style"),
    }));
  } finally {
    await session.close();
  }
}
