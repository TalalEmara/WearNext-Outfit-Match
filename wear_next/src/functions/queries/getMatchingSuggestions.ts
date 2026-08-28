import { driver } from "../cognoConnection";
import { type ClothesItem, type ClothingCategory } from "../../types";
import { getAllClothes } from "./getAllClothes";
import { getImageUrl } from "../getImageUrl";

/**
 * Returns clothing items that match the already-selected items.
 *
 * Rules:
 *  - Candidate must be a DIFFERENT category than any selected item
 *  - Scored by:
 *      +3  exact same color
 *      +2  same style
 *      +N  color compatibility via COLOR_MATCHES { rate: 1..5 }
 *  - If no items are selected → returns all clothes (no filter)
 */
export async function getMatchingSuggestions(
  selectedIds: string[],
): Promise<ClothesItem[]> {
  // Nothing selected — show everything
  if (selectedIds.length === 0) {
    return getAllClothes();
  }

  const session = driver.session();
  try {
    const result = await session.run(
      `
      // ── 1. Gather context from selected items ───────────────────
      MATCH (sel:ClothesItem)
      WHERE sel.id IN $selectedIds
      MATCH (sel)-[:IN_COLOR]->(selColor:Color)
      MATCH (sel)-[:HAS_STYLE]->(selStyle:Style)
      WITH
        collect(DISTINCT
          CASE WHEN sel:Top THEN 'Top' WHEN sel:Bottom THEN 'Bottom' ELSE 'Shoes' END
        ) AS usedCats,
        collect(DISTINCT selColor) AS selColors,
        collect(DISTINCT selStyle) AS selStyles

      // ── 2. Candidate items in a DIFFERENT category ──────────────
      MATCH (item:ClothesItem)-[:IN_COLOR]->(c:Color), (item)-[:HAS_STYLE]->(s:Style)
      WHERE NOT (
        CASE WHEN item:Top THEN 'Top' WHEN item:Bottom THEN 'Bottom' ELSE 'Shoes' END
        IN usedCats
      )

      // ── 3. Pre-compute exact-match booleans (before aggregation) ─
      WITH item, c, s,
        (c IN selColors) AS sameColor,
        (s IN selStyles) AS sameStyle,
        selColors

      // ── 4. Score color compatibility via COLOR_MATCHES ──────────
      OPTIONAL MATCH (c)-[cm:COLOR_MATCHES]->(matched:Color)
      WHERE matched IN selColors

      WITH item, c, s, sameColor, sameStyle,
        max(coalesce(cm.rate, 0)) AS colorCompatRate

      // ── 5. Total score and filter ───────────────────────────────
      WITH item, c, s,
        (CASE WHEN sameColor    THEN 3 ELSE 0 END) +
        (CASE WHEN sameStyle    THEN 2 ELSE 0 END) +
        colorCompatRate AS score

      WHERE score > 0

      RETURN
        item.id       AS id,
        item.itemName AS itemName,
        CASE WHEN item:Top THEN 'Top' WHEN item:Bottom THEN 'Bottom' ELSE 'Shoes' END AS category,
        c.name        AS color,
        s.name        AS style,
        score         AS matchScore
      ORDER BY matchScore DESC, itemName
      `,
      { selectedIds },
    );

    return result.records.map((r) => {
      const itemName = r.get("itemName");
      return {
        id:       r.get("id"),
        itemName,
        category: r.get("category") as ClothingCategory,
        color:    r.get("color"),
        style:    r.get("style"),
        imageUrl: getImageUrl(itemName),
      };
    });
  } finally {
    await session.close();
  }
}
