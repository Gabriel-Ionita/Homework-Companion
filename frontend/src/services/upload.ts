/**
 * Service for handling image uploads to the OCR processing endpoint
 */

export interface UploadResult {
  // OCR and processing results
  text?: string;                // Extracted text from the image
  latex_styled?: string;        // LaTeX formatted version of the text
  confidence?: number;          // Confidence score (0-1)
  
  // Additional metadata
  ocrJobId?: string;            // Job ID for tracking
  imageUrl?: string;            // URL of the uploaded image (if stored)
  processing_time_ms?: number;  // Time taken to process the image
  
  // Status information
  success?: boolean;            // Whether the operation was successful
  note?: string;               // Additional information or notes
  error?: string;              // Error message if the operation failed
}

/**
 * Uploads an image file to the OCR processing endpoint
 * @param file - The image file to process
 * @param signal - Optional AbortSignal to cancel the request
 * @returns Promise with the processing results
 */
export async function uploadImage(file: File, signal?: AbortSignal): Promise<UploadResult> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Fișierul trebuie să fie o imagine (JPEG, PNG sau WebP)');
  }

  // Validate file size (5MB max)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Dimensiunea maximă permisă este de 5MB. Fișierul selectat are ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
  }

  const form = new FormData();
  form.append('file', file);

  // Use environment variable for API base URL or default to local development
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
  const url = `${base}/api/ocr/upload`;

  try {
    console.log(`Uploading file to: ${url}`);
    const res = await fetch(url, {
      method: 'POST',
      body: form,
      signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    
    console.log('Response status:', res.status);
    
    let data;
    try {
      data = await res.json();
      console.log('Response data:', data);
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      throw new Error('Răspuns invalid de la server. Vă rugăm încercați din nou.');
    }
    
    if (!res.ok) {
      // Handle API errors (4xx, 5xx)
      console.error('API Error:', { status: res.status, data });
      const errorMessage = data?.error || data?.message || 
        `Eroare la server (${res.status} ${res.statusText})`;
      throw new Error(errorMessage);
    }
    
    if (!data) {
      throw new Error('Nu s-a primit niciun răspuns de la server.');
    }
    
    // Make sure we have the expected data structure
    const result = {
      ...(data.data || data), // Handle both {data: {...}} and direct {...} responses
      success: data.success !== false, // Default to true if not specified
      note: data.data?.note || data.note || 'Imagine procesată cu succes.'
    };
    
    console.log('Processed result:', result);
    return result;
  } catch (err) {
    // Handle network errors or JSON parsing errors
    console.error('Upload error:', err);
    
    // In development, provide more detailed error information
    if (import.meta.env.DEV) {
      const errorMessage = err instanceof Error ? err.message : 'Eroare necunoscută';
      
      // Only show mock data as a last resort
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        console.warn('Network error - is the backend running?', errorMessage);
        return {
          text: '2x + 3 = 7',
          latex_styled: '$$2x + 3 = 7$$',
          confidence: 0.95,
          success: false,
          error: 'Eroare de conexiune la server. Verificați dacă serverul backend rulează.',
          note: 'Aceasta este o previzualizare cu date de test.'
        };
      }
      
      // For other errors, include the actual error message
      throw new Error(`Eroare la încărcare: ${errorMessage}`);
    }
    
    // In production, rethrow the error to be handled by the UI
    throw err;
  }
}
