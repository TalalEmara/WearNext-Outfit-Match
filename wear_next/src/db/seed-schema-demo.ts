import { driver } from "../functions/cognoConnection";
import { initDatabase } from "./init";
import { clearDatabase } from "./seed";

/**
 * Minimal Schema Demo Seed Script:
 * Populates exactly one node of each type and one of each relationship type
 * so you can clearly visualize the schema structure in CognoDB Graph Viewer.
 */
export async function seedSchemaDemo() {
  await clearDatabase();
  await initDatabase();

  const session = driver.session();
  console.log("==================================================");
  console.log("🔍 Seeding Minimal Schema Demo (1 of each Entity & Relation)");
  console.log("==================================================");

  try {
    await session.run(`
      // 1. Single Style Node
      MERGE (style:Style {
        name: 'Formal'
      })
      SET style.description = 'Tailored elegant business attire'

      // 2. Color Nodes
      MERGE (colorWhite:Color {
        name: 'Color1'
      })
      SET colorWhite.hex = '#FFFFFF'

      MERGE (colorNavy:Color {
        name: 'Color2'
      })
      SET colorNavy.hex = '#001F3F'

      // 3. COLOR_MATCHES Relationship
      MERGE (colorWhite)-[cm1:COLOR_MATCHES]->(colorNavy)
      SET cm1.rate = 5
      MERGE (colorNavy)-[cm2:COLOR_MATCHES]->(colorWhite)
      SET cm2.rate = 5

      // 4. ClothesItem Nodes (Top, Bottom, Shoes)
      MERGE (top:ClothesItem:Top {
        id: 'top'
      })
      SET top.itemName = 'Classic Oxford White Shirt'

      MERGE (bottom:ClothesItem:Bottom {
        id: 'bottom'
      })
      SET bottom.itemName = 'Dark Navy Tailored Trousers'

      MERGE (shoes:ClothesItem:Shoes {
        id: 'shoes'
      })
      SET shoes.itemName = 'Rich Tan Derby Shoes'

      // 5. IN_COLOR Relationships
      MERGE (top)-[:IN_COLOR]->(colorWhite)
      MERGE (bottom)-[:IN_COLOR]->(colorNavy)
      MERGE (shoes)-[:IN_COLOR]->(colorNavy)

      // 6. HAS_STYLE Relationships
      MERGE (top)-[:HAS_STYLE]->(style)
      MERGE (bottom)-[:HAS_STYLE]->(style)
      MERGE (shoes)-[:HAS_STYLE]->(style)

      // 7. DIRECT_OVERRIDE Relationship (Stylist Capsule Pairing)
      MERGE (top)-[do1:DIRECT_OVERRIDE]->(bottom)
      SET do1.rate = 5, do1.note = 'Iconic Capsule Match'
      MERGE (bottom)-[do2:DIRECT_OVERRIDE]->(top)
      SET do2.rate = 5, do2.note = 'Iconic Capsule Match'
    `);

    console.log("==================================================");
    console.log("✅ Minimal Schema Demo seeded successfully!");
    console.log("==================================================");
  } catch (error) {
    console.error("❌ Error seeding schema demo:", error);
    throw error;
  } finally {
    await session.close();
  }
}

// Allow direct execution
const isMain = process.argv[1]?.replace(/\\/g, "/").endsWith("seed-schema-demo.ts");
if (isMain) {
  seedSchemaDemo()
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
