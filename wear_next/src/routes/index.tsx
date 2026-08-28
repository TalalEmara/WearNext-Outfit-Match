import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { type ClothesItem, type ClothingCategory, type OutfitState } from '../types'
import { getAllClothes, getMatchingSuggestions } from '../functions/queries'
import { CatalogGrid } from '../components/CatalogGrid/CatalogGrid'
import { MatchedOutfitPreview } from '../components/MatchedOutfitPreview/MatchedOutfitPreview'
import styles from './index.module.css'

// ── Server functions ──────────────────────────────────────────────────────────

/** Load all clothes on initial page load */
const fetchAllClothes = createServerFn({ method: 'GET' }).handler(() =>
  getAllClothes(),
)

/** Load matching suggestions given the IDs of already-selected items */
const fetchSuggestions = createServerFn({ method: 'GET' })
  .validator((ids: string[]) => ids)
  .handler(({ data: selectedIds }) => getMatchingSuggestions(selectedIds))

// ── Route ─────────────────────────────────────────────────────────────────────

export const Route = createFileRoute('/')({
  loader: () => fetchAllClothes(),
  component: App,
})

// ── Component ─────────────────────────────────────────────────────────────────

function App() {
  const allClothes = Route.useLoaderData()

  // ── Outfit state ───────────────────────────────────────────────
  const [outfit, setOutfit] = useState<OutfitState>({
    Top: null,
    Bottom: null,
    Shoes: null,
  })

  // ── Catalog items (start with everything, swap for matches) ────
  const [catalogItems, setCatalogItems] = useState<ClothesItem[]>(allClothes)
  const [isLoading, setIsLoading] = useState(false)

  // ── Filter tab state (All / Top / Bottom / Shoes) ──────────────
  const [selectedCategory, setSelectedCategory] = useState<'All' | ClothingCategory>('All')

  // ── Mobile view ────────────────────────────────────────────────
  const [mobileView, setMobileView] = useState<'outfit' | 'catalog'>('outfit')
  const [activeSlot, setActiveSlot] = useState<ClothingCategory | null>(null)

  // ── Filtered items (client-side category tab) ──────────────────
  const filteredItems =
    selectedCategory === 'All'
      ? catalogItems
      : catalogItems.filter((item) => item.category === selectedCategory)

  // ── Refresh suggestions whenever outfit changes ────────────────
  async function refreshSuggestions(updatedOutfit: OutfitState) {
    const selectedIds = Object.values(updatedOutfit)
      .filter(Boolean)
      .map((item) => (item as ClothesItem).id)

    setIsLoading(true)
    try {
      const suggestions = await fetchSuggestions({ data: selectedIds })
      setCatalogItems(suggestions.length > 0 ? suggestions : allClothes)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Handlers ───────────────────────────────────────────────────

  function handleSlotClick(category: ClothingCategory) {
    setActiveSlot(category)
    setSelectedCategory(category)
    setMobileView('catalog')
  }

  async function handleSelectItem(item: ClothesItem) {
    const updatedOutfit = { ...outfit, [item.category]: item }
    setOutfit(updatedOutfit)
    setMobileView('outfit')
    setActiveSlot(null)
    await refreshSuggestions(updatedOutfit)
  }

  async function handleClearSlot(category: ClothingCategory, e: React.MouseEvent) {
    e.stopPropagation()
    const updatedOutfit = { ...outfit, [category]: null }
    setOutfit(updatedOutfit)
    await refreshSuggestions(updatedOutfit)
  }

  async function handleResetOutfit() {
    setOutfit({ Top: null, Bottom: null, Shoes: null })
    setActiveSlot(null)
    setCatalogItems(allClothes)
  }

  function handleMobileBack() {
    setMobileView('outfit')
    setActiveSlot(null)
  }

  const isMobileCatalog = mobileView === 'catalog'

  return (
    <main className={styles.page}>
      <div className={styles.grid}>
        {/* ── Left: Catalog ───────────────────────────────── */}
        <div className={`${styles.catalogPanel} ${isMobileCatalog ? styles.mobileVisible : ''}`}>
          <CatalogGrid
            items={isLoading ? [] : filteredItems}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onSelectItem={handleSelectItem}
            onMobileBack={handleMobileBack}
            title={activeSlot ? `Choose ${activeSlot}` : 'Wardrobe Catalog'}
          />
        </div>

        {/* ── Right: Outfit Preview ────────────────────────── */}
        <div className={`${styles.outfitPanel} ${isMobileCatalog ? styles.mobileHidden : ''}`}>
          <MatchedOutfitPreview
            outfit={outfit}
            onSlotClick={handleSlotClick}
            onClearSlot={handleClearSlot}
            onResetOutfit={handleResetOutfit}
          />
        </div>
      </div>
    </main>
  )
}
