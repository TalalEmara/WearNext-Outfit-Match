import { driver } from "../functions/cognoConnection";
import { initDatabase } from "./init";

/**
 * Clears all existing graph nodes and relationships.
 */
export async function clearDatabase() {
  const session = driver.session();
  console.log("🧹 Clearing existing graph data...");
  try {
    await session.run(`MATCH (n) DETACH DELETE n`);
    console.log("✅ Database cleared.");
  } catch (err) {
    console.error("Error clearing database:", err);
    throw err;
  } finally {
    await session.close();
  }
}

/**
 * Seed data for:
 * - Labels:
 *    (:ClothesItem:Top { id, itemName })
 *    (:ClothesItem:Bottom { id, itemName })
 *    (:ClothesItem:Shoes { id, itemName })
 *    (:Color { name, hex })
 *    (:Style { name, description })
 * - Relationships:
 *    (:ClothesItem)-[:IN_COLOR]->(:Color)
 *    (:ClothesItem)-[:HAS_STYLE]->(:Style)
 *    (:Color)-[:COLOR_MATCHES {rate: 1..5}]->(:Color)
 *    (:ClothesItem)-[:DIRECT_OVERRIDE {rate: 1..5, note: '...'}]->(:ClothesItem)
 */
export async function seedDatabase() {
  await clearDatabase();
  await initDatabase();

  const session = driver.session();
  console.log("==================================================");
  console.log("🌱 Seeding CognoDB with Multi-Label ClothesItem Graph");
  console.log("==================================================");

  try {
    // 1. Seed Style Nodes
    console.log("1. Creating Style Nodes (:Style)...");
    await session.run(`
      UNWIND [
        { name: 'Formal', description: 'Tailored, elegant, and business attire' },
        { name: 'Casual', description: 'Relaxed, everyday comfortable wear' },
        { name: 'Streetwear', description: 'Urban, trendy, contemporary youth style' },
        { name: 'Minimalist', description: 'Clean lines, neutral palette, timeless silhouette' }
      ] AS style
      MERGE (s:Style { name: style.name })
      SET s.description = style.description
    `);

    // 2. Seed Color Nodes
    console.log("2. Creating Color Nodes (:Color)...");
    await session.run(`
      UNWIND [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Black', hex: '#000000' },
        { name: 'Navy Blue', hex: '#001F3F' },
        { name: 'Beige', hex: '#F5F5DC' },
        { name: 'Olive Green', hex: '#556B2F' },
        { name: 'Charcoal Grey', hex: '#36454F' },
        { name: 'Light Blue', hex: '#ADD8E6' },
        { name: 'Burgundy', hex: '#800020' },
        { name: 'Tan/Brown', hex: '#8B4513' }
      ] AS color
      MERGE (c:Color { name: color.name })
      SET c.hex = color.hex
    `);

    // 3. Seed Color-to-Color COLOR_MATCHES (Bi-directional, rate: 1..5)
    console.log("3. Creating COLOR_MATCHES relationships between (:Color) nodes (rate 1..5)...");
    await session.run(`
      UNWIND [
        { c1: 'White', c2: 'Navy Blue', rate: 5 },
        { c1: 'White', c2: 'Black', rate: 5 },
        { c1: 'White', c2: 'Beige', rate: 4 },
        { c1: 'White', c2: 'Olive Green', rate: 4 },
        { c1: 'White', c2: 'Light Blue', rate: 4 },
        { c1: 'Black', c2: 'Charcoal Grey', rate: 4 },
        { c1: 'Black', c2: 'Light Blue', rate: 4 },
        { c1: 'Black', c2: 'Burgundy', rate: 5 },
        { c1: 'Navy Blue', c2: 'Beige', rate: 5 },
        { c1: 'Navy Blue', c2: 'Tan/Brown', rate: 5 },
        { c1: 'Navy Blue', c2: 'Olive Green', rate: 3 },
        { c1: 'Olive Green', c2: 'Beige', rate: 5 },
        { c1: 'Olive Green', c2: 'Tan/Brown', rate: 4 },
        { c1: 'Burgundy', c2: 'Navy Blue', rate: 4 },
        { c1: 'Burgundy', c2: 'Charcoal Grey', rate: 5 },
        { c1: 'Charcoal Grey', c2: 'Light Blue', rate: 4 }
      ] AS pair
      MATCH (a:Color { name: pair.c1 })
      MATCH (b:Color { name: pair.c2 })
      MERGE (a)-[r1:COLOR_MATCHES]->(b)
      SET r1.rate = pair.rate
      MERGE (b)-[r2:COLOR_MATCHES]->(a)
      SET r2.rate = pair.rate
    `);

    // 4. Seed ClothesItem Nodes with Labels (:ClothesItem:Top), (:ClothesItem:Bottom), (:ClothesItem:Shoes)
    console.log("4. Creating (:ClothesItem:Top), (:ClothesItem:Bottom), (:ClothesItem:Shoes) nodes...");
    
    // --- TOPS ---
    await session.run(`
      UNWIND [
        { id: 'top_1', itemName: 'Classic Oxford White Shirt', color: 'White', style: 'Formal' },
        { id: 'top_2', itemName: 'Navy Merino Wool Sweater', color: 'Navy Blue', style: 'Minimalist' },
        { id: 'top_3', itemName: 'Black Heavyweight Oversized Tee', color: 'Black', style: 'Streetwear' },
        { id: 'top_4', itemName: 'Olive Green Utility Overshirt', color: 'Olive Green', style: 'Casual' },
        { id: 'top_5', itemName: 'Light Blue Linen Button-Down', color: 'Light Blue', style: 'Casual' }
      ] AS topData
      MERGE (t:ClothesItem:Top { id: topData.id })
      SET t.itemName = topData.itemName
      WITH t, topData
      MATCH (c:Color { name: topData.color })
      MERGE (t)-[:IN_COLOR]->(c)
      WITH t, topData
      MATCH (s:Style { name: topData.style })
      MERGE (t)-[:HAS_STYLE]->(s);
    `);

    // --- BOTTOMS ---
    await session.run(`
      UNWIND [
        { id: 'bot_1', itemName: 'Slim Fit Beige Chinos', color: 'Beige', style: 'Casual' },
        { id: 'bot_2', itemName: 'Dark Navy Tailored Trousers', color: 'Navy Blue', style: 'Formal' },
        { id: 'bot_3', itemName: 'Charcoal Wool Pleated Pants', color: 'Charcoal Grey', style: 'Minimalist' },
        { id: 'bot_4', itemName: 'Baggy Faded Black Denim', color: 'Black', style: 'Streetwear' },
        { id: 'bot_5', itemName: 'Olive Cargo Utility Pants', color: 'Olive Green', style: 'Streetwear' }
      ] AS botData
      MERGE (b:ClothesItem:Bottom { id: botData.id })
      SET b.itemName = botData.itemName
      WITH b, botData
      MATCH (c:Color { name: botData.color })
      MERGE (b)-[:IN_COLOR]->(c)
      WITH b, botData
      MATCH (s:Style { name: botData.style })
      MERGE (b)-[:HAS_STYLE]->(s);
    `);

    // --- SHOES ---
    await session.run(`
      UNWIND [
        { id: 'sho_1', itemName: 'Clean Minimalist White Sneakers', color: 'White', style: 'Minimalist' },
        { id: 'sho_2', itemName: 'Rich Tan Leather Derby Shoes', color: 'Tan/Brown', style: 'Formal' },
        { id: 'sho_3', itemName: 'Chunky Black Streetwear Boots', color: 'Black', style: 'Streetwear' },
        { id: 'sho_4', itemName: 'Brown Suede Casual Loafers', color: 'Tan/Brown', style: 'Casual' }
      ] AS shoData
      MERGE (s:ClothesItem:Shoes { id: shoData.id })
      SET s.itemName = shoData.itemName
      WITH s, shoData
      MATCH (c:Color { name: shoData.color })
      MERGE (s)-[:IN_COLOR]->(c)
      WITH s, shoData
      MATCH (sStyle:Style { name: shoData.style })
      MERGE (s)-[:HAS_STYLE]->(sStyle);
    `);

    // 5. Stylist DIRECT_OVERRIDE Relationships (Capsules & Curated Outfits)
    console.log("5. Creating DIRECT_OVERRIDE relationships for stylist curated outfits...");
    await session.run(`
      UNWIND [
        // Formal Capsule: White Oxford + Navy Tailored + Tan Derby Shoes
        { item1: 'top_1', item2: 'bot_2', rate: 5, note: 'Iconic Business Smart Look' },
        { item1: 'bot_2', item2: 'sho_2', rate: 5, note: 'Classic Tailored Match' },
        { item1: 'top_1', item2: 'sho_2', rate: 5, note: 'Polished Formal Harmony' },

        // Minimalist Capsule: Navy Sweater + Charcoal Wool Pants + White Sneakers
        { item1: 'top_2', item2: 'bot_3', rate: 5, note: 'Clean Scandinavian Minimalist' },
        { item1: 'bot_3', item2: 'sho_1', rate: 5, note: 'Trousers & Minimal Sneaker Pairing' },
        { item1: 'top_2', item2: 'sho_1', rate: 5, note: 'Effortless Smart-Casual' },

        // Streetwear Capsule: Black Oversized Tee + Baggy Black Denim + Chunky Boots
        { item1: 'top_3', item2: 'bot_4', rate: 5, note: 'Full Monochrome Streetwear' },
        { item1: 'bot_4', item2: 'sho_3', rate: 5, note: 'Baggy Silhouette with Chunky Footwear' },
        { item1: 'top_3', item2: 'sho_3', rate: 5, note: 'Dark Urban Vibe' },

        // Casual Capsule: Olive Overshirt + Beige Chinos + Brown Loafers
        { item1: 'top_4', item2: 'bot_1', rate: 5, note: 'Earth-Tone Casual Harmony' },
        { item1: 'bot_1', item2: 'sho_4', rate: 5, note: 'Chinos with Suede Loafers' },
        { item1: 'top_4', item2: 'sho_4', rate: 5, note: 'Warm Palette Cohesion' }
      ] AS override
      MATCH (i1:ClothesItem { id: override.item1 })
      MATCH (i2:ClothesItem { id: override.item2 })
      MERGE (i1)-[r1:DIRECT_OVERRIDE]->(i2)
      SET r1.rate = override.rate, r1.note = override.note
      MERGE (i2)-[r2:DIRECT_OVERRIDE]->(i1)
      SET r2.rate = override.rate, r2.note = override.note
    `);

    console.log("==================================================");
    console.log("🎉 Multi-label Database seeding completed!");
    console.log("==================================================");
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
    throw error;
  } finally {
    await session.close();
  }
}

// Allow direct execution
const isMain = process.argv[1]?.replace(/\\/g, "/").endsWith("seed.ts");
if (isMain) {
  seedDatabase()
    .then(async () => {
      await driver.close();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error(err);
      await driver.close();
      process.exit(1);
    });
}
