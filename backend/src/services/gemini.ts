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
  keyConcepts?: string[]
  difficulty?: 'ușor' | 'mediu' | 'dificil'
  timeEstimate?: string
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
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' }
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
  return `
  You are a helpful math tutor. Analyze this math problem and provide a detailed pedagogical breakdown.
  
  Problem: ${problemText}
  
  IMPORTANT: You MUST respond with a valid JSON object in this exact structure:
  {
    "steps": [
      {
        "title": "Titlu scurt al pasului",
        "explanation": "Explicație detaliată a acestui pas"
      }
    ],
    "finalAnswer": "Răspunsul final",
    "keyConcepts": ["concept1", "concept2"],
    "difficulty": "ușor/mediu/dificil",
    "timeEstimate": "timp estimat de rezolvare"
  }
  
  Guidelines for response:
  - Break down the solution into clear, logical steps
  - Explain mathematical concepts in simple terms
  - Use proper mathematical notation
  - Include relevant formulas and theorems
  - Highlight common mistakes to avoid
  - Provide the final answer clearly marked
  - Keep explanations concise but thorough
  - Use Romanian language
  - DO NOT include any text outside the JSON object
  `
}

function extractTextFromGemini(apiResponse: any): string {
  // Gemini returns candidates[0].content.parts[].text
  const parts = apiResponse?.candidates?.[0]?.content?.parts
  if (!Array.isArray(parts)) return ''
  
  // Extract text from all parts
  const text = parts
    .map((p: any) => (typeof p?.text === 'string' ? p.text : ''))
    .filter(Boolean)
    .join('\n')

  // Handle markdown code blocks
  const jsonMatch = text.match(/```(?:json)?\n([\s\S]*?)\n```/)
  if (jsonMatch && jsonMatch[1]) {
    return jsonMatch[1].trim()
  }

  // If no code block, try to find JSON directly
  const jsonMatch2 = text.match(/\{[\s\S]*\}/)
  if (jsonMatch2) {
    return jsonMatch2[0].trim()
  }

  return text
}

function parsePedagogicalText(text: string, problemText: string): PedagogicalAnalysis {
  try {
    // Try to parse as JSON first (remove markdown code blocks if present)
    const cleanText = text.replace(/^```(?:json)?\n|\n```$/g, '').trim()
    
    try {
      const parsed = JSON.parse(cleanText)
      // Validate the parsed structure
      if (parsed && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
        return {
          problemText,
          steps: parsed.steps.map((step: any) => ({
            title: step.title || 'Pas fără titlu',
            explanation: step.explanation || '',
          })),
          finalAnswer: parsed.finalAnswer,
          keyConcepts: Array.isArray(parsed.keyConcepts) ? parsed.keyConcepts : [],
          difficulty: parsed.difficulty || 'medie',
          timeEstimate: parsed.timeEstimate || '5 minute'
        }
      }
    } catch (jsonError) {
      console.warn('Failed to parse as JSON, falling back to text parsing:', jsonError)
    }

    // Fallback to text parsing if JSON parsing fails
    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    const steps: PedagogicalStep[] = []
    let currentStep: Partial<PedagogicalStep> = {}

    for (const line of lines) {
      if (line.match(/^[\d•-]+\.?\s+/)) {
        if (currentStep.title) steps.push(currentStep as PedagogicalStep)
        currentStep = { 
          title: line.replace(/^[\d•-]+\.?\s+/, '').trim(), 
          explanation: '' 
        }
      } else if (currentStep.title) {
        currentStep.explanation += (currentStep.explanation ? '\n' : '') + line
      }
    }

    if (currentStep.title) {
      steps.push(currentStep as PedagogicalStep)
    }

    return {
      problemText,
      steps: steps.length > 0 ? steps : [{ 
        title: 'Analiză', 
        explanation: text.length > 200 ? text.substring(0, 200) + '...' : text 
      }],
    }
  } catch (err) {
    console.error('Error parsing pedagogical text:', err)
    return {
      problemText,
      steps: [
        {
          title: 'Eroare la analiză',
          explanation: `A apărut o eroare la procesarea răspunsului. Vă rugăm încercați din mai târziu.`,
        },
      ],
    }
  }
}
