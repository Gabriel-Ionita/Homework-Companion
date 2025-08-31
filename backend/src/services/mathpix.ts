import axios from 'axios'
import { HttpError } from '../utils/httpError'

interface MathpixResult {
  text?: string
  latex_styled?: string
  confidence?: number
  note?: string
}

/**
 * Calls Mathpix OCR if API keys are present. Falls back to a safe stub otherwise.
 */
export async function extractMathFromImage(buffer: Buffer, mimetype: string): Promise<MathpixResult> {
  const APP_ID = process.env.MATHPIX_APP_ID
  const APP_KEY = process.env.MATHPIX_APP_KEY

  if (!APP_ID || !APP_KEY) {
    // Stubbed response when keys are missing
    return {
      text: 'Simulare OCR: ax^2 + bx + c = 0',
      latex_styled: 'a x^2 + b x + c = 0',
      confidence: 0.5,
      note: 'MATHPIX_APP_ID/KEY lipsesc; răspuns simulat.'
    }
  }

  try {
    const url = 'https://api.mathpix.com/v3/text'
    const imageBase64 = buffer.toString('base64')
    const { data } = await axios.post(
      url,
      {
        src: `data:${mimetype};base64,${imageBase64}`,
        formats: ["text", "latex_styled"],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'app_id': APP_ID,
          'app_key': APP_KEY,
        },
        timeout: 15000,
      }
    )

    return {
      text: data?.text,
      latex_styled: data?.latex_styled,
      confidence: typeof data?.confidence === 'number' ? data.confidence : undefined,
    }
  } catch (err: any) {
    const msg = err?.response?.data?.error || err?.message || 'Mathpix request failed'
    throw new HttpError(502, msg)
  }
}
