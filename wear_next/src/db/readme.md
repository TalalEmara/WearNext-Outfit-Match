# Database Architecture & Design Decision Log

## 1. Graph Data Model

### Labels
* `:ClothesItem` — Base label for all apparel items (properties: `id`, `itemName`).
* `:Top` — Sublabel for top garments (shirts, sweaters, jackets, tees).
* `:Bottom` — Sublabel for lower garments (trousers, chinos, jeans, skirts).
* `:Shoes` — Sublabel for footwear (sneakers, boots, loafers, oxfords).
* `:Color` — First-class entity for color palettes (properties: `name`, `hex`).
* `:Style` — First-class entity for aesthetic categories (properties: `name`, `description`).

---

### Relationships
![graph](graph.png)

* **`(:ClothesItem)-[:IN_COLOR]->(:Color)`**: Connects an item to its primary color node.
* **`(:ClothesItem)-[:HAS_STYLE]->(:Style)`**: Connects an item to its aesthetic style (`Formal`, `Casual`, `Streetwear`, `Minimalist`).
* **`(:Color)-[:COLOR_MATCHES {rate: 1..5}]->(:Color)`**: Symmetric color compatibility matrix with harmony ratings (1 to 5). Queried undirected (`-[:COLOR_MATCHES]-`).
* **`(:ClothesItem)-[:DIRECT_OVERRIDE {rate: 1..5, note: '...'}]->(:ClothesItem)`**: Explicit stylist-curated capsule pairings that override default algorithmic matching.

---

## 2. Architectural Decision Record (ADR)

### Context & Problem Statement
In apparel recommendation engines, items must be matched across multiple aesthetic dimensions (color harmony, occasion appropriateness, and silhouette style). How should item attributes like color and style be modeled to optimize query latency and minimize maintenance overhead?

### Considered Options
1. **Property-Based Storage:** Store color and style as string properties directly on `ClothesItem` nodes.
2. **Graph-Based First-Class Entities:** Extract `Color` and `Style` into separate nodes connected via semantic edges (`:IN_COLOR`, `:HAS_STYLE`, `:COLOR_MATCHES`).

---

### Decision Outcome: Graph-Based First-Class Entities

#### The Property-Based Anti-Pattern (`item.color = "Navy"`, `item.style = "Formal"`)
* **Inefficient Recommendation Queries:** Finding matching items requires scanning the entire catalog or running nested filtering over $N$ items ($O(N)$ full graph scan).
* **Combinatorial Complexity:** Computing color harmony across dynamic wardrobe combinations inside application code requires nested iterations at $O(N \times M)$ complexity.
* **Maintenance Bottleneck:** Adding a new item requires manually creating $O(N)$ direct relationship edges to every compatible garment in the catalog.

#### The Graph-Based Pattern (Index-Free Adjacency)
* **Localized Graph Traversal ($O(d)$ Complexity):** Finding matching bottoms for a given top only traverses adjacent edges of the top's `:Color` and `:Style` nodes. Query complexity drops from $O(N)$ (total items) to $O(d)$ (degree of connected attribute nodes).
* **Declarative Recommendation Deduction:** Outfit compatibility is resolved natively in Cypher by traversing:
  $$\text{Top} \xrightarrow{\text{:IN\_COLOR}} \text{Color}_1 \xrightarrow{\text{:COLOR\_MATCHES}} \text{Color}_2 \xleftarrow{\text{:IN\_COLOR}} \text{Bottom}$$
  intersected with:
  $$\text{Top} \xrightarrow{\text{:HAS\_STYLE}} \text{Style} \xleftarrow{\text{:HAS\_STYLE}} \text{Bottom}$$
* **Zero-Maintenance Catalog Expansion:** When a new `ClothesItem` is created, it only needs edges to its corresponding `:Color` and `:Style`. All 2-hop and 3-hop outfit combinations are inferred automatically.
* **Dynamic Stylist Overrides:** High-priority direct pairings (`:DIRECT_OVERRIDE`) allow editorial capsules to bypass the algorithmic inference engine without altering underlying data.

---
