import { Router, Request, Response, NextFunction } from 'express'
import multer from 'multer'
import type { Express } from 'express'
import { HttpError } from '../utils/httpError'
import { extractMathFromImage } from '../services/mathpix'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})

const router = Router()

router.post(
  '/upload',
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = (req as any).file as Express.Multer.File | undefined
      if (!file) throw new HttpError(400, 'Lipsește fișierul (camp "file").')
      const { buffer, mimetype } = file
      if (!mimetype.startsWith('image/')) {
        throw new HttpError(400, 'Fișierul trebuie să fie o imagine.')
      }

      const result = await extractMathFromImage(buffer, mimetype)
      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }
)

export default router
