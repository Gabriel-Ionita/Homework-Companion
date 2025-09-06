import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import type { Express } from 'express';
import { HttpError } from '../utils/httpError';
import { extractMathFromImage, OcrResult } from '../services/mathpix';

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

const router = Router();

/**
 * @route POST /api/ocr/upload
 * @desc Upload an image for OCR processing
 * @access Public
 * @param {File} file - The image file to process
 * @returns {OcrResult} The OCR processing results
 */
router.post(
  '/upload',
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = (req as any).file as Express.Multer.File | undefined;
      
      // Validate file exists
      if (!file) {
        throw new HttpError(400, 'Lipsește fișierul (câmpul "file").');
      }

      const { buffer, mimetype, originalname } = file;
      
      // Log the upload attempt
      console.log(`Processing file: ${originalname} (${mimetype}, ${buffer.length} bytes)`);
      
      // Process the image with OCR
      const result = await extractMathFromImage(buffer, mimetype);
      
      // If there was an error in processing
      if (result.error) {
        console.error(`OCR processing error for ${originalname}: ${result.error}`);
        throw new HttpError(400, result.error);
      }
      
      // Log the complete result
      console.log('OCR Result:', JSON.stringify(result, null, 2));
      console.log(`Successfully processed ${originalname} in ${result.processing_time_ms}ms`);
      
      // Return the results
      const response = {
        success: true,
        data: {
          text: result.text || '',
          latex_styled: result.latex_styled || '',
          confidence: result.confidence,
          processing_time_ms: result.processing_time_ms,
          note: result.note
        }
      };
      
      console.log('Sending response:', JSON.stringify(response, null, 2));
      res.status(200).json(response);
      
    } catch (err) {
      console.error('Error in OCR upload route:', err);
      
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new HttpError(413, 'Fișierul este prea mare. Dimensiunea maximă permisă este de 5MB.'));
        }
        return next(new HttpError(400, `Eroare la încărcarea fișierului: ${err.message}`));
      }
      
      // Handle our custom HttpError
      if (err instanceof HttpError) {
        return next(err);
      }
      
      // Handle other errors
      next(new HttpError(500, 'A apărut o eroare la procesarea imaginii.'));
    }
  }
)

export default router
