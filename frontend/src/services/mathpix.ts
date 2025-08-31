/**
 * Mathpix OCR contracts and stub service.
 * Will be integrated with backend endpoint that proxies to Mathpix.
 */

export interface MathpixError {
  code?: string
  message: string
}

export interface MathpixResponse {
  text?: string // plain text extracted
  latex_styled?: string // LaTeX with styling
  confidence?: number // 0..1
  error?: MathpixError
}

/**
 * Extract math text from an image. Placeholder implementation until backend is ready.
 */
export async function extractMathFromImage(file: File, signal?: AbortSignal): Promise<MathpixResponse> {
  // TODO: Replace with real call to backend, e.g. POST /api/ocr/mathpix
  // using FormData and returning the parsed JSON response.
  await new Promise((r) => setTimeout(r, 500))
  // Simulated minimal response
  return {
    text: 'Simulare: ax^2 + bx + c = 0',
    latex_styled: 'a x^2 + b x + c = 0',
    confidence: 0.92,
  }
}
