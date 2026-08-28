import React, { useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { type ClothingCategory } from '../types'
import { Input } from '../components/Input/Input'
import { ColorPicker } from '../components/ColorPicker/ColorPicker'
import { StyleSelector } from '../components/StyleSelector/StyleSelector'
import { CategorySelector } from '../components/CategorySelector/CategorySelector'
import { Button } from '../components/Button/Button'
import styles from './clothes.add.module.css'

export const Route = createFileRoute('/clothes/add')({ component: AddClothes })

interface FormState {
  itemName: string
  category: ClothingCategory
  color: string
  style: string
  imageUrl: string
}

function AddClothes() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormState>({
    itemName: '',
    category: 'Top',
    color: '',
    style: '',
    imageUrl: '',
  })

  // ── Image preview ─────────────────────────────────────────────
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setForm((prev) => ({ ...prev, imageUrl: url }))
  }

  // ── Submit (UI only) ──────────────────────────────────────────
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log('Submitted item (UI preview):', form)
    alert(`✅ "${form.itemName}" added! (UI only — no backend yet)`)
  }

  const isValid = form.itemName.trim() && form.color && form.style

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.pageTitle}>Add Clothes</h1>
        <p className={styles.pageSubtitle}>
          Fill in the details below to add a new item to your wardrobe.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>

          {/* ── Item Name ─────────────────────────────────── */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="itemName">
              Item Name
            </label>
            <Input
              id="itemName"
              placeholder="e.g. Classic Oxford White Shirt"
              value={form.itemName}
              onChange={(e) => setForm((p) => ({ ...p, itemName: e.target.value }))}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              }
            />
          </div>

          {/* ── Category ──────────────────────────────────── */}
          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <CategorySelector
              value={form.category}
              onChange={(cat) => setForm((p) => ({ ...p, category: cat }))}
            />
          </div>

          {/* ── Color ─────────────────────────────────────── */}
          <div className={styles.field}>
            <label className={styles.label}>Color</label>
            <ColorPicker
              value={form.color}
              onChange={(color) => setForm((p) => ({ ...p, color }))}
            />
          </div>

          {/* ── Style ─────────────────────────────────────── */}
          <div className={styles.field}>
            <label className={styles.label}>Style</label>
            <StyleSelector
              value={form.style}
              onChange={(style) => setForm((p) => ({ ...p, style }))}
            />
          </div>

          {/* ── Image ─────────────────────────────────────── */}
          <div className={styles.field}>
            <label className={styles.label}>Image (optional)</label>
            <div className={styles.imageUpload}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className={styles.imagePreview}
                />
              ) : (
                <>
                  <svg className={styles.uploadIcon} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className={styles.uploadText}>Click to upload a photo</span>
                  <span className={styles.uploadHint}>PNG, JPG, WEBP up to 10 MB</span>
                </>
              )}
            </div>
          </div>

          {/* ── Submit ────────────────────────────────────── */}
          <div className={styles.submitRow}>
            <Button
              type="submit"
              label="Add to Wardrobe"
              variant="gradient"
              size="md"
              disabled={!isValid}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              }
            />
          </div>

        </form>
      </div>
    </main>
  )
}
