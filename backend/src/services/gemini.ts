import axios from 'axios'
import { HttpError } from '../utils/httpError'

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

export async function analyzeWithGemini(problemText: string): Promise<PedagogicalAnalysis> {
  const API_KEY = process.env.GOOGLE_AI_API_KEY
  const MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash'

  if (!API_KEY) {
    // Stubbed response when key is missing
    return {
      problemText,
      steps: [
        { title: 'Identifică datele', explanation: 'Extrage coeficienții ecuației.' },
        { title: 'Alege metoda', explanation: 'Folosește formula pentru ecuații de gradul II.' },
      ],
      finalAnswer: 'Răspuns simulativ. Adaugă GOOGLE_AI_API_KEY pentru analiză reală.',
      caveats: ['GOOGLE_AI_API_KEY lipsește; răspuns simulat.'],
    }
  }

  try {
    const prompt = buildPedagogicalPrompt(problemText)

    const { data } = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUAL', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
      },
      { timeout: 20000 }
    )

    const text = extractTextFromGemini(data)
    const parsed = parsePedagogicalText(text, problemText)
    return parsed
  } catch (err: any) {
    const msg = err?.response?.data?.error?.message || err?.message || 'Gemini request failed'
    throw new HttpError(502, msg)
  }
}

function buildPedagogicalPrompt(problemText: string): string {
  return [
    'Ești un tutor de matematică. Oferă pași clari și progresivi pentru rezolvare.',
    'Formatul răspunsului:',
    '- Pas: <titlu scurt> — <explicație succintă>',
    '- ...',
    '- Răspuns final: <rezultatul>',
    '',
    'Problemă:',
    problemText,
  ].join('\n')
}

function extractTextFromGemini(apiResponse: any): string {
  // Gemini returns candidates[0].content.parts[].text
  const parts = apiResponse?.candidates?.[0]?.content?.parts
  if (!Array.isArray(parts)) return ''
  return parts
    .map((p: any) => (typeof p?.text === 'string' ? p.text : ''))
    .filter(Boolean)
    .join('\n')
}

function parsePedagogicalText(text: string, problemText: string): PedagogicalAnalysis {
  const steps: PedagogicalStep[] = []
  let finalAnswer: string | undefined

  const lines = text.split(/\r?\n/)
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    const finalMatch = line.match(/^Răspuns\s+final\s*:\s*(.+)$/i)
    if (finalMatch) {
      finalAnswer = finalMatch[1].trim()
      continue
    }
    const stepMatch = line.match(/^(?:Pas\s*\d*|Pas):?\s*(.+?)[—\-:]\s*(.+)$/i)
    if (stepMatch) {
      steps.push({ title: stepMatch[1].trim(), explanation: stepMatch[2].trim() })
    }
  }

  // Fallback if parsing failed
  if (steps.length === 0 && text) {
    steps.push({ title: 'Analiză', explanation: text.slice(0, 500) })
  }

  return { problemText, steps, finalAnswer }
}
