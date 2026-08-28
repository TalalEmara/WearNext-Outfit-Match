import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { type ClothesItem, type ClothingCategory, type OutfitState } from '../types'
import { getAllClothes, getMatchingSuggestions } from '../functions/queries'
import { logError } from '../functions/logger'
import { CatalogGrid } from '../components/CatalogGrid/CatalogGrid'
import { MatchedOutfitPreview } from '../components/MatchedOutfitPreview/MatchedOutfitPreview'
import styles from './index.module.css'

// ── Server functions ──────────────────────────────────────────────────────────

/** Load all clothes on initial page load with centralized error handling */
const fetchAllClothes = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    return await getAllClothes()
  } catch (error) {
    await logError('ServerFn: fetchAllClothes', error)
    // Return empty list gracefully without breaking client render
    return []
  }
})

/** Load matching suggestions with centralized error handling */
const fetchSuggestions = createServerFn({ method: 'GET' })
  .validator((ids: string[]) => ids)
  .handler(async ({ data: selectedIds }) => {
    try {
      return await getMatchingSuggestions(selectedIds)
    } catch (error) {
      await logError('ServerFn: fetchSuggestions', error)
      return []
    }
  })

// ── Route ─────────────────────────────────────────────────────────────────────

export const Route = createFileRoute('/')({
  loader: () => fetchAllClothes(),
  staleTime: 0,
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

  // Synchronize catalogItems when allClothes updates from server loader
  React.useEffect(() => {
    const hasSelected = Object.values(outfit).some(Boolean)
    if (!hasSelected) {
      setCatalogItems(allClothes)
    }
  }, [allClothes])

  // ── Filter tab state (All / Top / Bottom / Shoes) ──────────────
  const [selectedCategory, setSelectedCategory] = useState<'All' | ClothingCategory>('All')

  // ── Mobile view ────────────────────────────────────────────────
  const [mobileView, setMobileView] = useState<'outfit' | 'catalog'>('outfit')
  const [activeSlot, setActiveSlot] = useState<ClothingCategory | null>(null)

  const CATEGORY_ORDER: ClothingCategory[] = ['Top', 'Bottom', 'Shoes']

  function getNextEmptyCategory(currentCat: ClothingCategory, currentOutfit: OutfitState): ClothingCategory | null {
    const currentIndex = CATEGORY_ORDER.indexOf(currentCat)
    for (let i = 1; i <= CATEGORY_ORDER.length; i++) {
      const nextCat = CATEGORY_ORDER[(currentIndex + i) % CATEGORY_ORDER.length]
      if (!currentOutfit[nextCat]) {
        return nextCat
      }
    }
    return null
  }

  // ── Filtered items (client-side category tab with fallback) ────
  const categoryMatchedItems =
    selectedCategory === 'All'
      ? catalogItems
      : catalogItems.filter((item) => item.category === selectedCategory)

  // Fallback to all clothes for category if no match suggestions found in that category
  const filteredItems =
    categoryMatchedItems.length > 0
      ? categoryMatchedItems
      : selectedCategory === 'All'
        ? allClothes
        : allClothes.filter((item) => item.category === selectedCategory)

  // ── Refresh suggestions whenever outfit changes ────────────────
  async function refreshSuggestions(updatedOutfit: OutfitState) {
    const selectedIds = Object.values(updatedOutfit)
      .filter(Boolean)
      .map((item) => (item as ClothesItem).id)

    setIsLoading(true)
    try {
      const suggestions = await fetchSuggestions({ data: selectedIds })
      setCatalogItems(suggestions.length > 0 ? suggestions : allClothes)
    } catch (err) {
      // Fallback to all clothes on client failure
      setCatalogItems(allClothes)
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

    const nextCategory = getNextEmptyCategory(item.category, updatedOutfit)

    if (nextCategory) {
      setActiveSlot(nextCategory)
      setSelectedCategory(nextCategory)
      setMobileView('catalog')
    } else {
      setActiveSlot(null)
      setSelectedCategory('All')
      setMobileView('outfit')
    }

    await refreshSuggestions(updatedOutfit)
  }

  async function handleClearSlot(category: ClothingCategory, e: React.MouseEvent) {
    e.stopPropagation()
    const updatedOutfit = { ...outfit, [category]: null }
    setOutfit(updatedOutfit)
    setActiveSlot(category)
    setSelectedCategory(category)
    await refreshSuggestions(updatedOutfit)
  }

  async function handleResetOutfit() {
    setOutfit({ Top: null, Bottom: null, Shoes: null })
    setActiveSlot(null)
    setSelectedCategory('All')
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
            items={filteredItems}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onSelectItem={handleSelectItem}
            onMobileBack={handleMobileBack}
            title={activeSlot ? `Choose ${activeSlot}` : 'Wardrobe Catalog'}
            isLoading={isLoading}
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
