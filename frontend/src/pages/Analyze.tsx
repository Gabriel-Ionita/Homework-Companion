import React from 'react'
import clsx from 'clsx'
import { Card, CardBody, CardHeader, CardTitle, CardFooter } from '../components/Card'
import Button from '../components/Button'
import { uploadImage } from '../services/upload'

export default function Analyze() {
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [msg, setMsg] = React.useState<null | { type: 'info' | 'error' | 'success'; text: string }>(null)
  const [loading, setLoading] = React.useState(false)
  const abortRef = React.useRef<AbortController | null>(null)

  function onPickClick() {
    inputRef.current?.click()
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setMsg({ type: 'error', text: 'Te rugăm să selectezi o imagine (PNG/JPG).' })
      return
    }
    // ~5MB client-side limit
    if (f.size > 5 * 1024 * 1024) {
      setMsg({ type: 'error', text: 'Fișierul este prea mare. Limita este ~5MB.' })
      return
    }
    setFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
    setMsg({ type: 'success', text: 'Imagine pregătită pentru analiză.' })
  }

  function onClear() {
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
    setMsg({ type: 'info', text: 'Selecția a fost ștearsă.' })
  }

  function handleDropFile(f: File | undefined) {
    if (!f) return
    // mimic input handler
    if (!f.type.startsWith('image/')) {
      setMsg({ type: 'error', text: 'Te rugăm să selectezi o imagine (PNG/JPG).' })
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setMsg({ type: 'error', text: 'Fișierul este prea mare. Limita este ~5MB.' })
      return
    }
    setFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
    setMsg({ type: 'success', text: 'Imagine adăugată prin drag & drop.' })
  }

  function onDragEnter(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }
  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }
  function onDragLeave(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const f = e.dataTransfer?.files?.[0]
    handleDropFile(f)
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Analizează problemă</h1>
      <p className="text-gray-700">Încarcă o imagine a problemei. Vom extrage textul și îți vom oferi ghidaj.</p>

      {/* Live region for non-blocking status messages */}
      <div aria-live="polite" className="sr-only" id="upload-status" />

      <Card>
        <CardHeader>
          <CardTitle>Încărcare imagine</CardTitle>
        </CardHeader>
        <CardBody>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
            aria-label="Selectează o imagine pentru analiză"
          />

          {!preview ? (
            <div
              role="button"
              tabIndex={0}
              aria-label="Zonă de încărcare. Trage și plasează o imagine sau apasă pentru a selecta." 
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPickClick()}
              onClick={onPickClick}
              onDragEnter={onDragEnter}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={clsx(
                'flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-8 text-center outline-none',
                isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
              )}
            >
              <div className="text-sm text-gray-600">Trage și plasează o imagine aici sau</div>
              <Button aria-label="Deschide selectorul de fișiere" className="w-full sm:w-auto">
                Selectează fișier
              </Button>
              <div className="text-xs text-gray-500">PNG, JPG. Max ~5MB</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <img
                src={preview}
                alt="Previzualizare problemă"
                className="aspect-video w-full rounded-lg border object-contain bg-gray-50"
              />
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  Fișier: <span className="font-medium">{file?.name}</span>
                </p>
                <p>Dimensiune: {(file!.size / 1024).toFixed(1)} KB</p>
                <div className="flex flex-col gap-2 sm:flex-row" aria-busy={loading}>
                  <Button
                    onClick={async () => {
                      if (!file || loading) return
                      try {
                        setMsg(null)
                        setLoading(true)
                        abortRef.current?.abort()
                        abortRef.current = new AbortController()
                        const res = await uploadImage(file, abortRef.current.signal)
                        setMsg({ type: 'success', text: res.message || 'Încărcare reușită. În curând analiză OCR.' })
                      } catch (e: any) {
                        setMsg({ type: 'error', text: e?.message || 'Upload nereușit. Te rugăm încearcă din nou.' })
                      } finally {
                        setLoading(false)
                      }
                    }}
                    disabled={!file || loading}
                    className="sm:w-auto w-full"
                  >
                    Încarcă și analizează
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      abortRef.current?.abort()
                      onClear()
                    }}
                    disabled={loading}
                    className="sm:w-auto w-full"
                  >
                    Șterge
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Inline status message */}
          {msg && (
            <div
              role="status"
              aria-atomic="true"
              aria-live="polite"
              className={clsx(
                'mt-4 rounded-md px-3 py-2 text-sm',
                msg.type === 'error' && 'bg-red-50 text-red-700 border border-red-200',
                msg.type === 'success' && 'bg-green-50 text-green-700 border border-green-200',
                msg.type === 'info' && 'bg-blue-50 text-blue-700 border border-blue-200'
              )}
            >
              {msg.text}
            </div>
          )}
        </CardBody>
        <CardFooter className="text-xs text-gray-500">
          Notă: Upload-ul real va fi conectat la serviciul OCR (Mathpix) în etapa următoare.
        </CardFooter>
      </Card>
    </section>
  )
}
