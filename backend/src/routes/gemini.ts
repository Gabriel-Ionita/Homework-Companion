import { Router, Request, Response, NextFunction } from 'express'
import { analyzeWithGemini } from '../services/gemini'
import { HttpError } from '../utils/httpError'

const router = Router()

router.post('/analyze', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { problemText } = req.body as { problemText?: string }
    if (!problemText || typeof problemText !== 'string') {
      throw new HttpError(400, 'Câmpul "problemText" este obligatoriu.')
    }
    const result = await analyzeWithGemini(problemText)
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

export default router
