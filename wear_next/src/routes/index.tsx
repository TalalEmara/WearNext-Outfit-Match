import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { type ClothesItem, type ClothingCategory, type OutfitState } from '../types'
import { MOCK_CLOTHES } from '../mocks/clothes.mock'
import { CatalogGrid } from '../components/CatalogGrid/CatalogGrid'
import { MatchedOutfitPreview } from '../components/MatchedOutfitPreview/MatchedOutfitPreview'
import styles from './index.module.css'

export const Route = createFileRoute('/')({ component: App })

function App() {
  // ── Outfit state ─────────────────────────────────────────────
  const [outfit, setOutfit] = useState<OutfitState>({
    Top: null,
    Bottom: null,
    Shoes: null,
  })

  // ── Catalog filter ────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState<'All' | ClothingCategory>('All')

  // ── Mobile view: "outfit" is default, "catalog" opens on slot click
  const [mobileView, setMobileView] = useState<'outfit' | 'catalog'>('outfit')

  // ── Which slot was clicked (auto-filters the catalog) ─────────
  const [activeSlot, setActiveSlot] = useState<ClothingCategory | null>(null)

  // ── Filtered items ────────────────────────────────────────────
  const filteredItems =
    selectedCategory === 'All'
      ? MOCK_CLOTHES
      : MOCK_CLOTHES.filter((item) => item.category === selectedCategory)

  // ── Handlers ─────────────────────────────────────────────────

  /** When the user clicks an outfit slot → open catalog filtered to that slot */
  function handleSlotClick(category: ClothingCategory) {
    setActiveSlot(category)
    setSelectedCategory(category)
    setMobileView('catalog')
  }

  /** When an item is selected from the catalog → fill the slot, return to outfit on mobile */
  function handleSelectItem(item: ClothesItem) {
    setOutfit((prev) => ({ ...prev, [item.category]: item }))
    setMobileView('outfit')
    setActiveSlot(null)
  }

  /** Remove a single slot's item */
  function handleClearSlot(category: ClothingCategory, e: React.MouseEvent) {
    e.stopPropagation()
    setOutfit((prev) => ({ ...prev, [category]: null }))
  }

  /** Reset entire outfit */
  function handleResetOutfit() {
    setOutfit({ Top: null, Bottom: null, Shoes: null })
    setActiveSlot(null)
  }

  /** Mobile "Back to Outfit" from catalog */
  function handleMobileBack() {
    setMobileView('outfit')
    setActiveSlot(null)
  }

  const isMobileCatalog = mobileView === 'catalog'

  return (
    <main className={styles.page}>
      <div className={styles.grid}>
        {/* ── Left: Catalog ───────────────────────────────── */}
        <div
          className={`${styles.catalogPanel} ${isMobileCatalog ? styles.mobileVisible : ''}`}
        >
          <CatalogGrid
            items={filteredItems}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onSelectItem={handleSelectItem}
            onMobileBack={handleMobileBack}
            title={activeSlot ? `Choose ${activeSlot}` : 'Wardrobe Catalog'}
          />
        </div>

        {/* ── Right: Outfit Preview ────────────────────────── */}
        <div
          className={`${styles.outfitPanel} ${isMobileCatalog ? styles.mobileHidden : ''}`}
        >
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
