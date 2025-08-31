# Plan Pas cu Pas - Aplicația Tutor Matematică cu AI

## Prezentare Generală

Aplicație educațională care analizează imagini cu probleme de matematică și oferă ghidaj pedagogic pas cu pas, fără a da răspunsul direct.

## Obiective

- Preluare și analiză imagini cu probleme de matematică
- Identificare tip problemă și concepte necesare
- Recomandări pedagogice personalizate
- Generare exerciții similare pentru exersare
- Interfață prietenoasă pentru elevi

## Arhitectura Sistemului

### Frontend
- **Framework:** React.js cu TypeScript
- **UI Library:** Tailwind CSS + shadcn/ui
- **Camera/Upload:** react-camera-pro sau input file
- **Math Rendering:** MathJax sau KaTeX
- **State Management:** React Query + Zustand

### Backend
- **Framework:** Node.js cu Express/Fastify
- **Database:** PostgreSQL + Prisma ORM
- **File Storage:** AWS S3 sau Cloudinary
- **Cache:** Redis pentru rate limiting

### AI Services
- **OCR:** Mathpix API
- **AI Analysis:** Google Gemini 1.5 Flash API
- **Backup OCR:** Tesseract.js (local fallback)

##  Flux de Funcționare

```
1. Elev → Încarcă poză cu problemă
2. Frontend → Validare imagine + Upload
3. Backend → Mathpix OCR → Extrage text/formule
4. Backend → Gemini API → Analiză pedagogică
5. Backend → Salvare în DB + Cache rezultat
6. Frontend → Afișare recomandări structurate
```

##  Faze de Dezvoltare

## Faza 1: Setup Inițial (Săptămâna 1-2)

### 1.1 Configurare Mediu Dezvoltare
- [ ] Setup repository Git
- [ ] Configurare Node.js + pnpm/npm
- [ ] Inițializare React app cu Vite
- [ ] Setup ESLint, Prettier, TypeScript
- [ ] Configurare Docker pentru development

### 1.2 Setup Backend Basic
```bash
# Structura directoare
backend/
├── src/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── utils/
├── prisma/
└── .env.example
```

- [ ] Express server cu CORS
- [ ] Rate limiting cu express-rate-limit
- [ ] Error handling middleware
- [ ] Health check endpoint

### 1.3 Setup Frontend Basic
```bash
# Structura directoare
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   └── utils/
└── public/
```

- [ ] React Router setup
- [ ] Tailwind CSS configurare
- [ ] Layout componente de bază

## Faza 2: Integrare AI Services (Săptămâna 3-4)

### 2.1 Mathpix OCR Integration
- [ ] Creare cont Mathpix + API key
- [ ] Service pentru upload imagini
- [ ] Parser pentru răspuns Mathpix
- [ ] Error handling pentru OCR failures

```typescript
// services/mathpix.ts
export interface MathpixResponse {
  text: string;
  latex: string;
  confidence: number;
}

export async function extractMathFromImage(
  imageBuffer: Buffer
): Promise<MathpixResponse>
```

### 2.2 Google Gemini Integration
- [ ] Setup Google AI Studio + API key
- [ ] Service pentru Gemini API calls
- [ ] Template-uri de prompt pedagogic
- [ ] Validare și parsing răspunsuri

```typescript
// services/gemini.ts
export interface PedagogicalAnalysis {
  problemType: string;
  concepts: string[];
  hints: string[];
  similarExercise: string;
  difficulty: 'usor' | 'mediu' | 'dificil';
}

export async function analyzeMathProblem(
  extractedText: string
): Promise<PedagogicalAnalysis>
```

### 2.3 Prompt Engineering
```typescript
const PEDAGOGICAL_PROMPT = `
Analizează această problemă de matematică în română: {extractedText}

Răspunde DOAR în format JSON cu următoarea structură:
{
  "problemType": "tipul problemei (ex: ecuație de gradul 2)",
  "concepts": ["concept1", "concept2", "concept3"],
  "hints": [
    "primul pas recomandat",
    "al doilea indiciu", 
    "al treilea indiciu"
  ],
  "similarExercise": "o problemă similară mai simplă",
  "difficulty": "usor|mediu|dificil",
  "explanation": "explicație scurtă a tipului de problemă"
}

IMPORTANT: Nu oferi soluția completă, doar ghidaj pedagogic.
`;
```

## Faza 3: Core Features (Săptămâna 5-7)

### 3.1 Image Upload & Processing
- [ ] Component pentru camera/upload
- [ ] Validare format/dimensiune imagini
- [ ] Compresie imagini pentru optimizare
- [ ] Preview înainte de trimitere

```typescript
// components/ImageUpload.tsx
interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onAnalysisComplete: (result: PedagogicalAnalysis) => void;
}
```

### 3.2 Results Display
- [ ] Component pentru afișare tip problemă
- [ ] Lista conceptelor necesare
- [ ] Hints progresive (click pentru următorul)
- [ ] Exerciții similare
- [ ] Math rendering cu MathJax

```typescript
// components/AnalysisResults.tsx
interface AnalysisResultsProps {
  analysis: PedagogicalAnalysis;
  originalImage: string;
}
```

### 3.3 Database Schema
```sql
-- Tabela pentru sesiuni de lucru
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_image_url TEXT NOT NULL,
  extracted_text TEXT,
  analysis_result JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela pentru feedback elevi
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  was_helpful BOOLEAN,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Faza 4: UI/UX Optimization (Săptămâna 8-9)

### 4.1 Responsive Design
- [ ] Mobile-first approach
- [ ] Touch-friendly camera interface
- [ ] Optimizare pentru tablete
- [ ] Dark/light mode

### 4.2 User Experience
- [ ] Loading states cu progres
- [ ] Error messages prietenoase
- [ ] Success animations
- [ ] Tutorial pentru primul utilizator

### 4.3 Performance
- [ ] Image lazy loading
- [ ] API response caching
- [ ] Bundle optimization
- [ ] Service worker pentru offline basics

## Faza 5: Testare & Polish (Săptămâna 10-11)

### 5.1 Testing
- [ ] Unit tests pentru services
- [ ] Integration tests pentru API
- [ ] E2E tests cu Playwright
- [ ] Performance testing

### 5.2 Error Handling
- [ ] Graceful degradation când OCR fails
- [ ] Fallback la Tesseract.js
- [ ] Rate limit handling
- [ ] Network error recovery

### 5.3 Monitoring
- [ ] Logging cu Winston
- [ ] Basic analytics
- [ ] Error tracking (Sentry)
- [ ] API usage monitoring

## Faza 6: Deployment (Săptămâna 12)

### 6.1 Producție Setup
- [ ] Docker containerization
- [ ] Environment variables management
- [ ] Database migrations
- [ ] SSL certificates

### 6.2 Hosting Options
**Opțiune 1: Budget-friendly**
- Frontend: Vercel/Netlify (gratuit)
- Backend: Railway/Render (gratuit tier)
- Database: Supabase/PlanetScale (gratuit tier)

**Opțiune 2: Scalabilă**
- AWS: EC2 + RDS + S3
- Load balancing pentru creștere

### 6.3 CI/CD
- [ ] GitHub Actions pentru deployment
- [ ] Automated testing în pipeline
- [ ] Environment-specific configs

## Costuri Estimate

### Servicii AI (lunar)
- Mathpix OCR: $0-29/lună (1000 req gratuit)
- Google Gemini: Gratuit (15 req/min)
- **Total AI: $0-29/lună**

### Hosting
- Tier gratuit: $0/lună (până la ~1000 utilizatori/lună)
- Tier scaling: $20-50/lună

## Configurări Necesare

### Environment Variables
```env
# API Keys
MATHPIX_APP_ID=your_mathpix_app_id
MATHPIX_APP_KEY=your_mathpix_key
GOOGLE_AI_API_KEY=your_gemini_key

# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# Storage
AWS_S3_BUCKET=your_bucket
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

### Package.json Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "prisma": "^5.0.0",
    "@google/generative-ai": "^0.2.0",
    "multer": "^1.4.5",
    "sharp": "^0.32.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0"
  }
}
```

## Extensii Viitoare

### Funcționalități Avansate
- [ ] Istoricul problemelor rezolvate
- [ ] Progres tracking pe categorii
- [ ] Recomandări personalizate
- [ ] Mode colaborativ (clasă)
- [ ] Integration cu curriculă școlară

### Optimizări AI
- [ ] Fine-tuning pe problemele românești
- [ ] Model local pentru privacy
- [ ] Multi-language support
- [ ] Voice input pentru probleme

## Resurse Utile

### Documentații
- [Mathpix API Docs](https://docs.mathpix.com/)
- [Google AI Studio](https://aistudio.google.com/)
- [MathJax Documentation](https://docs.mathjax.org/)

### Tools & Libraries
- [React Camera Pro](https://www.npmjs.com/package/react-camera-pro)
- [Tesseract.js](https://tesseract.projectnaptha.com/) (backup OCR)
- [Sharp](https://sharp.pixelplumbing.com/) (image processing)

---

**Timp estimat total:** 12 săptămâni pentru MVP complet
**Echipă recomandată:** 1-2 developeri full-stack
**Buget minim:** $0-50/lună pentru început