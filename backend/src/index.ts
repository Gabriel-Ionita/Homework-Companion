import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiLimiter, healthLimiter } from './middleware/rateLimit';
import ocrRouter from './routes/ocr';
import geminiRouter from './routes/gemini';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

// Security headers
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL, // Production frontend URL
  ].filter(Boolean) as string[],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

// Apply CORS with the above options
app.use(cors(corsOptions));

// Request logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '1mb' }))

// Rate limiting
app.use(apiLimiter)

// API routes
app.use('/api/ocr', ocrRouter)
app.use('/api/gemini', geminiRouter)

// Health check
app.get('/health', healthLimiter, (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'backend', time: new Date().toISOString() })
})

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found', path: req.path })
})

// Central error handler
app.use(errorHandler)

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})
