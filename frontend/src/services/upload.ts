/**
 * Upload service (stubbed): will send an image to backend OCR endpoint when available.
 * TODO: Wire to backend route (e.g., POST /api/ocr/upload) once implemented.
 */

export interface UploadResult {
  ocrJobId?: string
  imageUrl?: string
  message?: string
  text?: string
  latex_styled?: string
  confidence?: number
}

export async function uploadImage(file: File, signal?: AbortSignal): Promise<UploadResult> {
  const form = new FormData()
  form.append('file', file)

  const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000'
  const url = `${base}/api/ocr/upload`

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: form,
      signal,
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(text || `Upload failed (${res.status})`)
    }
    const data = (await res.json()) as UploadResult
    return {
      ...data,
      message: data.message || 'Încărcare reușită.',
    }
  } catch (err) {
    // Graceful fallback when backend isn’t running yet
    await new Promise((r) => setTimeout(r, 400))
    return {
      ocrJobId: 'stub-job-123',
      imageUrl: URL.createObjectURL(file),
      message: 'Upload simulativ. Pornește backend-ul pentru OCR real.',
      text: 'Simulare: ax^2 + bx + c = 0',
      latex_styled: 'a x^2 + b x + c = 0',
      confidence: 0.5,
    }
  }
}
