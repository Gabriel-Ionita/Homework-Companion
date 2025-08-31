import Tesseract from 'tesseract.js'

export interface OcrResult {
  text?: string
  confidence?: number
  note?: string
}

/**
 * Perform OCR using Tesseract.js in Node. Default language: 'eng'.
 */
export async function extractMathFromImage(buffer: Buffer, _mimetype: string): Promise<OcrResult> {
  try {
    const { data } = await Tesseract.recognize(buffer, 'eng', {
      // logger: m => console.log(m), // Uncomment for debug
    })
    return {
      text: data?.text?.trim(),
      confidence: typeof data?.confidence === 'number' ? data.confidence : undefined,
      note: 'OCR realizat cu Tesseract.js (gratuit). Calitatea pentru formule matematice poate varia.'
    }
  } catch (err: any) {
    throw new Error(err?.message || 'Tesseract OCR failed')
  }
}
