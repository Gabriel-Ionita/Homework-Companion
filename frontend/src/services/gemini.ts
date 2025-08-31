/**
 * Google Gemini contracts and stub service for pedagogical analysis.
 * Will be integrated with backend endpoint that calls Gemini.
 */

export interface PedagogicalStep {
  title: string
  explanation: string
}

export interface PedagogicalAnalysis {
  problemText: string
  steps: PedagogicalStep[]
  finalAnswer?: string
  caveats?: string[]
}

/**
 * Analyze a math problem text and return a guided explanation. Placeholder until backend is ready.
 */
export async function analyzeMathProblem(problemText: string, signal?: AbortSignal): Promise<PedagogicalAnalysis> {
  // TODO: Replace with real backend call, e.g. POST /api/gemini/analyze
  await new Promise((r) => setTimeout(r, 500))
  return {
    problemText,
    steps: [
      { title: 'Identifică tipul problemei', explanation: 'Ecuație de gradul al doilea.' },
      { title: 'Aplică formula', explanation: 'x = (-b ± √(b² - 4ac)) / 2a' },
    ],
    finalAnswer: 'Soluțiile depind de Δ = b² - 4ac',
    caveats: ['Rezultatele sunt simulate. Integrarea reală cu Gemini urmează.'],
  }
}
