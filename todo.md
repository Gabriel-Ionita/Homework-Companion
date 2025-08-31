# TODO – Tutor Matematică cu AI

## Phase 1 — Setup (Week 1–2)
- [x] Setup repository Git
- [x] Configurare Node.js + pnpm/npm
- [x] Inițializare React app cu Vite
- [x] Setup ESLint, Prettier, TypeScript
- [ ] Configurare Docker pentru development

### Backend Base
- [x] Creează structura directoarelor: `backend/src/{routes,services,middleware,utils}/`, `prisma/`, `.env.example`
- [x] Express server cu CORS
- [x] Rate limiting cu express-rate-limit
- [x] Error handling middleware
- [x] Health check endpoint

### Frontend Base
- [x] Creează structura directoarelor: `frontend/src/{components,pages,hooks,services,utils}/`, `public/`
- [x] React Router setup
- [x] Tailwind CSS configurare
- [x] Layout componente de bază (mobile-first)

## Phase 2 — AI Services (Week 3–4)
### OCR Service (Tesseract.js)
- [x] Integrare Tesseract.js pentru OCR
- [x] Suport pentru limba română și simboluri matematice
- [x] Service pentru procesarea imaginilor
- [x] Error handling pentru OCR failures
- [x] Configurare worker pentru performanță optimă

### Google Gemini
- [x] Setup Google AI Studio + API key (needed - vezi mai jos)
- [x] Service pentru Gemini API calls
- [x] Template-uri de prompt pedagogic
- [x] Validare și parsing răspunsuri
- [x] Implementare `PEDAGOGICAL_PROMPT`
- [ ] Testare și optimizare

### Contracts
- [x] Definire `services/mathpix.ts` (interface `OcrResult`, `extractMathFromImage()`)
- [ ] Definire `services/gemini.ts` (interface `PedagogicalAnalysis`, `analyzeMathProblem()`)

## Phase 3 — Core Features (Week 5–7)
### Image Upload & Processing
- [ ] Component pentru camera/upload (react-camera-pro sau input file)
- [ ] Validare format/dimensiune imagini
- [ ] Compresie imagini pentru optimizare (sharp)
- [ ] Preview înainte de trimitere
- [ ] Endpoint backend pentru procesare imagine (OCR → analiză)

### Results Display
- [ ] Component pentru afișare tip problemă
- [ ] Lista conceptelor necesare
- [ ] Hints progresive (click pentru următorul)
- [ ] Exerciții similare
- [ ] Math rendering cu MathJax/KaTeX

### Database
- [ ] Tabela `sessions`
- [ ] Tabela `feedback`
- [ ] Configurare Prisma + migrații inițiale

## Phase 4 — UI/UX (Week 8–9)
### Responsive
- [ ] Mobile-first approach
- [ ] Interfață cameră touch-friendly
- [ ] Optimizare pentru tablete
- [ ] Dark/light mode

### Experience
- [ ] Loading states cu progres
- [ ] Mesaje de eroare prietenoase
- [ ] Animații de success
- [ ] Tutorial pentru primul utilizator

### Performance
- [ ] Image lazy loading
- [ ] API response caching
- [ ] Bundle optimization
- [ ] Service worker pentru offline basics

## Phase 5 — Testing & Stability (Week 10–11)
### Testing
- [ ] Unit tests pentru services
- [ ] Integration tests pentru API
- [ ] E2E tests cu Playwright
- [ ] Performance testing

### Error Handling & Resilience
- [ ] Graceful degradation când OCR eșuează
- [ ] Fallback la Tesseract.js
- [ ] Rate limit handling
- [ ] Network error recovery

### Monitoring
- [ ] Logging cu Winston
- [ ] Basic analytics
- [ ] Error tracking (Sentry)
- [ ] API usage monitoring

## Phase 6 — Deployment (Week 12)
### Production Setup
- [ ] Docker containerization
- [ ] Environment variables management
- [ ] Database migrations
- [ ] SSL certificates

### Hosting Options
- [ ] Buget: Frontend (Vercel/Netlify), Backend (Railway/Render), DB (Supabase/PlanetScale)
- [ ] Scalabil: AWS EC2 + RDS + S3 + load balancing

### CI/CD
- [ ] GitHub Actions pentru deployment
- [ ] Automated testing în pipeline
- [ ] Environment-specific configs

## Configuration & Dependencies
- [ ] Setare variabile de mediu (Mathpix, Gemini, DB, Redis, S3)
- [ ] Integrare Redis pentru rate limiting/cache
- [ ] Integrare upload storage (S3/Cloudinary)
- [ ] Adăugare dependențe (`express`, `prisma`, `@google/generative-ai`, `multer`, `sharp`, `cors`, `helmet`)
- [ ] Backup OCR cu Tesseract.js (fallback local)
- [ ] Adăugare link-uri utile în `README`

## Future Extensions
### Funcționalități
- [ ] Istoricul problemelor rezolvate
- [ ] Progres tracking pe categorii
- [ ] Recomandări personalizate
- [ ] Mode colaborativ (clasă)
- [ ] Integrare cu curriculă școlară

### Optimizări AI
- [ ] Fine-tuning pe probleme românești
- [ ] Model local pentru privacy
- [ ] Multi-language support
- [ ] Voice input pentru probleme
