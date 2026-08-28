import React, { useState } from 'react'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { type ClothingCategory } from '../types'
import { addClothesItem } from '../functions/mutations/addClothesItem'
import { logError } from '../functions/logger'
import { Input } from '../components/Input/Input'
import { ColorPicker } from '../components/ColorPicker/ColorPicker'
import { StyleSelector } from '../components/StyleSelector/StyleSelector'
import { CategorySelector } from '../components/CategorySelector/CategorySelector'
import { Button } from '../components/Button/Button'
import styles from './clothes.add.module.css'

// ── Server functions ──────────────────────────────────────────────────────────

/**
 * Saves an uploaded image to public/images/<itemName> on the server.
 * Logs any file system failures to logs/errors.txt.
 */
const uploadImage = createServerFn({ method: 'POST' })
  .validator((data: { base64: string; itemName: string }) => data)
  .handler(async ({ data }) => {
    try {
      const { writeFile, mkdir } = await import('node:fs/promises')
      const { join } = await import('node:path')
      const { cwd } = await import('node:process')

      const dir = join(cwd(), 'public', 'images')
      await mkdir(dir, { recursive: true })

      const filePath = join(dir, data.itemName)
      await writeFile(filePath, Buffer.from(data.base64, 'base64'))

      return `/images/${data.itemName}`
    } catch (error) {
      await logError('ServerFn: uploadImage', error)
      throw new Error('Image upload failed. Please try again.')
    }
  })

/**
 * Creates the ClothesItem node in CognoDB with centralized error logging.
 */
const createClothesItem = createServerFn({ method: 'POST' })
  .validator((data: {
    itemName: string
    category: ClothingCategory
    color: string
    style: string
  }) => data)
  .handler(async ({ data }) => {
    try {
      return await addClothesItem(data)
    } catch (error) {
      await logError('ServerFn: createClothesItem', error)
      throw new Error('Failed to save item to database. Please check connection.')
    }
  })

// ── Route ─────────────────────────────────────────────────────────────────────

export const Route = createFileRoute('/clothes/add')({ component: AddClothes })

// ── Component ─────────────────────────────────────────────────────────────────

interface FormState {
  itemName: string
  category: ClothingCategory
  color: string
  style: string
}

function AddClothes() {
  const navigate = useNavigate()
  const router = useRouter()

  const [form, setForm] = useState<FormState>({
    itemName: '',
    category: 'Top',
    color: '',
    style: '',
  })

  // Image stored separately: preview URL (blob) + raw file for upload
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')

  // ── Image pick ────────────────────────────────────────────────
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreviewUrl(URL.createObjectURL(file))
  }

  // ── Submit ────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // 1. Upload image if selected (saved to public/images/<itemName>)
      if (imageFile) {
        const base64 = await fileToBase64(imageFile)
        await uploadImage({
          data: { base64, itemName: form.itemName },
        })
      }

      // 2. Create the graph node in DB
      await createClothesItem({ data: form })

      // 3. Invalidate router cache so the homepage loads the newly added item
      await router.invalidate()

      // 4. Navigate back to home
      await navigate({ to: '/' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
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

          {/* ── Item Name ───────────────────────────────────── */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="itemName">Item Name</label>
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

          {/* ── Category ────────────────────────────────────── */}
          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <CategorySelector
              value={form.category}
              onChange={(cat) => setForm((p) => ({ ...p, category: cat }))}
            />
          </div>

          {/* ── Color ───────────────────────────────────────── */}
          <div className={styles.field}>
            <label className={styles.label}>Color</label>
            <ColorPicker
              value={form.color}
              onChange={(color) => setForm((p) => ({ ...p, color }))}
            />
          </div>

          {/* ── Style ───────────────────────────────────────── */}
          <div className={styles.field}>
            <label className={styles.label}>Style</label>
            <StyleSelector
              value={form.style}
              onChange={(style) => setForm((p) => ({ ...p, style }))}
            />
          </div>

          {/* ── Image ───────────────────────────────────────── */}
          <div className={styles.field}>
            <label className={styles.label}>Image (optional)</label>
            <div className={styles.imageUpload}>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreviewUrl ? (
                <img src={imagePreviewUrl} alt="Preview" className={styles.imagePreview} />
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

          {/* ── Error ───────────────────────────────────────── */}
          {error && <p className={styles.errorText}>{error}</p>}

          {/* ── Submit ──────────────────────────────────────── */}
          <div className={styles.submitRow}>
            <Button
              type="submit"
              label={isSubmitting ? 'Saving…' : 'Add to Wardrobe'}
              variant="gradient"
              size="md"
              disabled={!isValid || isSubmitting}
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
