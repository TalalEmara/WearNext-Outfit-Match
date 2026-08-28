/**
 * Map of known catalog items to their static image paths with extensions.
 * for testing only
 */
const KNOWN_IMAGE_MAP: Record<string, string> = {
  "Classic Oxford White Shirt": "/images/Classic Oxford White Shirt.jpeg",
  "Navy Merino Wool Sweater": "/images/Navy Merino Wool Sweater.jpeg",
  "Black Heavyweight Oversized Tee": "/images/Black Heavyweight Oversized Tee.webp",
  "Olive Green Utility Overshirt": "/images/Olive Green Utility Overshirt.jpeg",
  "Light Blue Linen Button-Down": "/images/Light Blue Linen Button-Down.webp",
  "Slim Fit Beige Chinos": "/images/Slim Fit Beige Chinos.jpeg",
  "Dark Navy Tailored Trousers": "/images/Dark Navy Tailored Trousers.webp",
  "Charcoal Wool Pleated Pants": "/images/Charcoal Wool Pleated Pants.jpeg",
  "Baggy Faded Black Denim": "/images/Baggy Faded Black Denim.jpeg",
  "Olive Cargo Utility Pants": "/images/Olive Cargo Utility Pants.webp",
  "Clean Minimalist White Sneakers": "/images/Clean Minimalist White Sneakers.jpeg",
  "Rich Tan Leather Derby Shoes": "/images/Rich Tan Leather Derby Shoes.jpeg",
  "Chunky Black Streetwear Boots": "/images/Chunky Black Streetwear Boots.jpeg",
  "Brown Suede Casual Loafers": "/images/Brown Suede Casual Loafers.jpeg",
};

/**
 * Returns the public image URL for a clothing item name.
 * If not in the pre-defined map, defaults to /images/<itemName>.
 */
export function getImageUrl(itemName: string): string {
  if (KNOWN_IMAGE_MAP[itemName]) {
    return KNOWN_IMAGE_MAP[itemName];
  }
  return `/images/${itemName}`;
}

export default getImageUrl;
