import { driver } from "../functions/cognoConnection";

/**
 * Initializes database constraints and indexes for:
 * - Labels: :ClothesItem, :Top, :Bottom, :Shoes
 * - Label: :Color
 * - Label: :Style
 */
export async function initDatabase() {
  const session = driver.session();
  console.log("==================================================");
  console.log("⚡ Initializing CognoDB Schema (ClothesItem, Top, Bottom, Shoes, Color, Style)");
  console.log("==================================================");

  try {
    // 1. Unique Constraints
    console.log("1. Creating unique constraints...");
    
    // ClothesItem unique ID
    await session.run(`
      CREATE CONSTRAINT clothes_item_id_unique IF NOT EXISTS
      FOR (item:ClothesItem) REQUIRE item.id IS UNIQUE
    `);

    // Color unique name
    await session.run(`
      CREATE CONSTRAINT color_name_unique IF NOT EXISTS
      FOR (c:Color) REQUIRE c.name IS UNIQUE
    `);

    // Style unique name
    await session.run(`
      CREATE CONSTRAINT style_name_unique IF NOT EXISTS
      FOR (s:Style) REQUIRE s.name IS UNIQUE
    `);

    // 2. Indexes for fast search
    console.log("2. Creating performance indexes on labels and itemName...");
    
    await session.run(`
      CREATE INDEX clothes_item_name_idx IF NOT EXISTS
      FOR (item:ClothesItem) ON (item.itemName)
    `);

    await session.run(`
      CREATE INDEX top_name_idx IF NOT EXISTS
      FOR (t:Top) ON (t.itemName)
    `);

    await session.run(`
      CREATE INDEX bottom_name_idx IF NOT EXISTS
      FOR (b:Bottom) ON (b.itemName)
    `);

    await session.run(`
      CREATE INDEX shoes_name_idx IF NOT EXISTS
      FOR (s:Shoes) ON (s.itemName)
    `);

    console.log("✅ Schema constraints & indexes initialized successfully!");
  } catch (error) {
    console.error("❌ Error during database initialization:", error);
    throw error;
  } finally {
    await session.close();
  }
}

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.includes("init")) {
  initDatabase()
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
