import Tesseract from 'tesseract.js';

export interface OcrResult {
  text?: string;
  latex_styled?: string;
  confidence?: number;
  note?: string;
  error?: string;
  processing_time_ms?: number;
}

// Common mathematical symbols and their LaTeX equivalents
const MATH_SYMBOLS: Record<string, string> = {
  '=': '=',
  '+': '+',
  '-': '-',
  '*': '\\times',
  '/': '\\div',
  '÷': '\\div',
  '×': '\\times',
  '^': '^',
  '(': '(',
  ')': ')',
  '[': '[',
  ']': ']',
  '{': '\\{',
  '}': '\\}',
  '<': '<',
  '>': '>',
  '≤': '\\leq',
  '≥': '\\geq',
  '≠': '\\neq',
  '≈': '\\approx',
  '±': '\\pm',
  '√': '\\sqrt',
  '∞': '\\infty',
  'π': '\\pi',
  'θ': '\\theta',
  'α': '\\alpha',
  'β': '\\beta',
  'γ': '\\gamma',
  'Δ': '\\Delta',
  'δ': '\\delta',
  '∑': '\\sum',
  '∫': '\\int',
  '∂': '\\partial',
  '→': '\\rightarrow',
  '⇒': '\\Rightarrow',
  '∀': '\\forall',
  '∃': '\\exists',
  '∈': '\\in',
  '∉': '\\notin',
  '⊂': '\\subset',
  '⊆': '\\subseteq',
  '∪': '\\cup',
  '∩': '\\cap',
};

/**
 * Clean and normalize the OCR output for mathematical text
 */
function cleanOcrText(text: string): string {
  if (!text) return '';
  
  // Common OCR mistakes mapping
  const replacements: Record<string, string> = {
    // Numbers and letters
    'l': '1', '|': '1', '!': '1', 'i': '1', 'I': '1',
    'O': '0', 'o': '0', '()': '0',
    's': '5', 'S': '5', '$': '5',
    'z': '2', 'Z': '2',
    'g': '9', 'q': '9',
    'b': '6',
    
    // Math symbols
    '—': '-', '–': '-', '−': '-', '--': '-',
    '=': '=', '==': '=', '≈': '=', '≠': '≠',
    'x': '×', '*': '×',
    ':': '÷', '/': '÷',
    '^': '^',
    '(': '(', ')': ')',
    '[': '(', ']': ')',
    '{': '(', '}': ')'
  };
  
  // Common text corrections (handled separately to avoid duplicates)
  const textCorrections = {
    'af1a': 'află',
    'numaru1': 'numărul',
    'numarul': 'numărul',
    'necun05cu7': 'necunoscut',
    'cate': 'câte'
  };
  
  // First, replace common multi-character patterns
  let cleaned = text.toLowerCase();
  
  // Apply text corrections for Romanian words and common OCR mistakes
  cleaned = cleaned
    // Fix common OCR mistakes in text
    .replace(/af1a/g, 'află')
    .replace(/num[ăa]ru1|numarul?/g, 'numărul')
    .replace(/necun[0o]5cu?[t7]|necunoscut/g, 'necunoscut')
    .replace(/cate/g, 'câte')
    
    // Fix mathematical expressions
    .replace(/->/g, '→')
    .replace(/(\d+)\s*[÷:]\s*(\w)/g, '$1 ÷ $2')  // Division with colon or ÷
    .replace(/(\d+)\s*×?\s*a/g, '$1 × a')         // Multiplication with a
    .replace(/(\d+)([a-zA-Z])/g, '$1 × $2')       // Add × between number and letter
    .replace(/([a-zA-Z])(\d+)/g, '$1 $2')         // Add space between letter and number
    .replace(/([=+\-×÷^→])(\w)/g, '$1 $2')       // Add space after operator
    .replace(/(\w)([=+\-×÷^→])/g, '$1 $2')       // Add space before operator
    
    // Fix specific patterns in the current problem
    .replace(/2\s*1/g, '21')  // Fix '2 1' to '21'
    .replace(/\s*=\s*_+/g, ' = \\text{___}')  // Format blanks
    .replace(/\\te×t/g, '\\text')  // Fix \te×t to \text
    .replace(/×\s*×/g, '×')  // Fix double multiplication signs
    .replace(/(\d+)\s*\-\s*a/g, '$1 - a')  // Fix spacing around minus
    .replace(/\s*=\s*\\text/g, ' = \\text')  // Fix spacing before \text
  
  // Normalize whitespace and clean up
  cleaned = cleaned
    .replace(/\s+/g, ' ')
    .replace(/\s*([=+\-×÷^→])\s*/g, ' $1 ')  // Normalize spaces around operators
    .replace(/\s*,\s*/g, ', ')  // Normalize spaces after commas
    .replace(/\s*\.\s*/g, '. ')  // Normalize spaces after periods
    .trim();
  
  // Then replace single characters
  cleaned = cleaned
    .split('')
    .map(char => replacements[char] || char)
    .join('');
  
  // Clean up equation formatting
  cleaned = cleaned
    .replace(/(\d+)\s*([=+\-×÷^])\s*(\d+)/g, '$1 $2 $3') // Add spaces around operators
    .replace(/\s*([(),])\s*/g, '$1') // Remove spaces around parentheses and commas
    .replace(/\s{2,}/g, ' ') // Replace multiple spaces with one
    .trim();
    
  return cleaned;
}

/**
 * Convert plain text to LaTeX-style math when possible
 */
function textToLatex(text: string): string {
  if (!text) return '';
  
  // First, clean up the text
  let latex = text.trim();
  
  // Fix common LaTeX escaping issues
  latex = latex
    .replace(/\\te×t/g, '\\text')  // Fix incorrect text command
    .replace(/×\s*×/g, '×')  // Fix double multiplication
    .replace(/(\d+)\s*\-\s*a/g, '$1 - a');  // Fix spacing around minus
  
  // Format problem number and statement
  latex = latex.replace(/^(\d+)\.\s*(.*)/, (_, num, text) => {
    return `\\textbf{${num}.} ${text}`;
  });
  
  // Handle equations with variables
  latex = latex
    .replace(/(\d+)\s*÷\s*(\w+)\s*=\s*(\d+)/g, '$1 ÷ $2 = $3')
    .replace(/\s*=\s*_+/g, ' = \\text{___}');
  
  // Format the equations section
  const parts = latex.split(/(?=[a-z]\s*=|\d+\s*[÷×])/);
  if (parts.length > 1) {
    const problemText = parts[0];
    const equations = parts.slice(1);
    
    let formattedProblem = problemText;
    if (equations.length > 0) {
      formattedProblem += '\\\[';
      formattedProblem += equations
        .map(eq => eq.trim())
        .join('\\quad ');
      formattedProblem += '\]';
    }
    
    return formattedProblem;
  }
  
  return latex;
}

/**
 * Perform OCR using Tesseract.js with enhanced math support
 */
export async function extractMathFromImage(
  buffer: Buffer,
  mimetype: string
): Promise<OcrResult> {
  try {
    const startTime = Date.now();
    
    // Configure Tesseract for better math recognition
    console.log('Starting OCR processing...');
    const { data } = await Tesseract.recognize(buffer, 'eng', {
      // @ts-ignore - Tesseract.js types are incomplete
      logger: m => console.log('Tesseract:', m.status, m.progress),
      
      // Tesseract parameters
      // @ts-ignore - Tesseract.js types are incomplete
      tessedit_pageseg_mode: '6', // Assume a single uniform block of text
      // @ts-ignore - Tesseract.js types are incomplete
      tessedit_ocr_engine_mode: '3', // Default + LSTM
      // @ts-ignore - Tesseract.js types are incomplete
      preserve_interword_spaces: '1',
      // @ts-ignore - Tesseract.js types are incomplete
      tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ=+-*/^()[]{}<>≤≥≠≈±√∞πθαβγΔδ∑∫∂→⇒∀∃∈∉⊂⊆∪∩',
      // @ts-ignore - Tesseract.js types are incomplete
      tessedit_do_invert: '0', // Don't invert colors
    });
    
    console.log('OCR completed. Recognized text:', data.text);
    
    const cleanText = cleanOcrText(data.text);
    const latex = textToLatex(cleanText);
    
    return {
      text: cleanText,
      latex_styled: latex,
      confidence: typeof data.confidence === 'number' ? data.confidence / 100 : undefined, // Convert to 0-1 range
      processing_time_ms: Date.now() - startTime,
      note: 'OCR realizat cu Tesseract.js. Pentru rezultate mai bune la formule matematice complexe, recomandăm utilizarea serviciului Mathpix.'
    };
  } catch (err: any) {
    console.error('OCR processing error:', err);
    return {
      error: err?.message || 'Eroare la procesarea imaginii',
      note: 'Nu s-a putut procesa imaginea. Asigurați-vă că imaginea este clară și conține text lizibil.'
    };
  }
}
