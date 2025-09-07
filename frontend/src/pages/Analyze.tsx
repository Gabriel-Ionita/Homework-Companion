import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle, CardFooter } from '../components/Card';
import ImageUpload from '../components/ImageUpload';
import ConceptsList from '../components/ConceptsList';
import ProgressiveHints from '../components/ProgressiveHints';
import SimilarExercises from '../components/SimilarExercises';
import type { UploadResult } from '../services/upload';
import type { ProblemType } from '../types/problem';

// Import the upload function
const useUploadService = () => {
  const [uploadFn, setUploadFn] = useState<typeof import('../services/upload').uploadImage>();

  useEffect(() => {
    const loadUploadService = async () => {
      try {
        // Always use the real upload service
        const uploadModule = await import('../services/upload');
        setUploadFn(() => uploadModule.uploadImage);
      } catch (error) {
        console.error('Failed to load upload service:', error);
        // Fallback to mock only if the real service fails to load
        if (import.meta.env.DEV) {
          console.warn('Falling back to mock upload service');
          const mock = await import('../services/__mocks__/upload');
          setUploadFn(() => mock.uploadImage);
        }
      }
    };
    
    loadUploadService();
  }, []);

  return uploadFn;
};

export default function Analyze() {
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState<{ type: 'info' | 'error' | 'success'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<UploadResult | null>(null);
  const [problemType, setProblemType] = useState<ProblemType>('algebra');
  const uploadImage = useUploadService();

  // Mock data - replace with actual data from your backend
  const concepts = [
    'Ecuații de gradul I',
    'Proprietăți ale operațiilor',
    'Rezolvarea ecuațiilor'
  ];

  const similarExercises = [
    {
      id: '1',
      title: 'Rezolvarea ecuației de gradul I',
      description: 'Rezolvă ecuația: 2x + 5 = 15',
      difficulty: 'easy' as const,
      concepts: ['Ecuații de gradul I'],
      type: 'equation',
      source: 'Manual de matematică, clasa a VII-a'
    },
    {
      id: '2',
      title: 'Găsirea necunoscutei',
      description: 'Află numărul necunoscut: 3a - 7 = 14',
      difficulty: 'medium' as const,
      concepts: ['Ecuații de gradul I', 'Operații cu numere întregi'],
      type: 'equation',
      source: 'Culegere de exerciții, clasa a VII-a'
    }
  ];

  const handleImageSelect = async (selectedFile: File) => {
    if (!uploadImage) {
      setMsg({ type: 'error', text: 'Serviciul de încărcare nu este încărcat' });
      return;
    }

    setFile(selectedFile);
    setMsg({ type: 'info', text: 'Se procesează imaginea...' });
    setLoading(true);
    setAnalysisResult(null);

    try {
      console.log('Starting image upload...');
      const result = await uploadImage(selectedFile);
      console.log('Upload result:', result);
      
      // Check if we have valid data in the response
      const hasValidData = result.text || result.latex_styled;
      
      if (!hasValidData) {
        console.warn('No valid data in response:', result);
        throw new Error('Nu s-au putut extrage date din imagine. Încercați cu o altă imagine.');
      }
      
      // Update the analysis result with proper fallbacks
      const analysisData = {
        text: result.text || 'Niciun text extras',
        latex_styled: result.latex_styled || '',
        confidence: result.confidence,
        note: result.note,
        success: result.success !== false
      };
      
      console.log('Setting analysis result:', analysisData);
      setAnalysisResult(analysisData);
      
      // Set appropriate message
      const messageText = result.note || (result.success !== false 
        ? 'Analiză finalizată cu succes!' 
       : 'A apărut o eroare la procesare');
      
      setMsg({ 
        type: result.success !== false ? 'success' : 'error',
        text: messageText
      });
      
    } catch (error) {
      console.error('Error processing image:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Eroare necunoscută la procesarea imaginii';
      
      setMsg({ 
        type: 'error',
        text: errorMessage
      });
      
      // Reset the file input on error
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analiză problemă matematică</CardTitle>
        </CardHeader>
        <CardBody className="flex flex-col items-center space-y-6">
          <div className="w-full max-w-md">
            <ImageUpload 
              onImageSelect={handleImageSelect}
              maxSizeMB={5}
            />
            {msg && (
              <div className={`mt-4 p-3 rounded ${msg.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {msg.text}
              </div>
            )}
            {loading && (
              <div className="mt-4 text-center text-blue-600">
                Se procesează imaginea...
              </div>
            )}
          </div>

          {analysisResult && (
            <div className="w-full mt-6 p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Rezultate analiză</h3>
                {analysisResult.confidence !== undefined && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    analysisResult.confidence > 0.7 
                      ? 'bg-green-100 text-green-800' 
                      : analysisResult.confidence > 0.4 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                  }`}>
                    Încredere: {(analysisResult.confidence * 100).toFixed(0)}%
                  </span>
                )}
              </div>
              
              <div className="space-y-6">
                <div>
                  <span className="font-medium block mb-2">Text extras:</span>
                  <div className="p-3 bg-white rounded border font-mono whitespace-pre-wrap text-sm">
                    {analysisResult.text}
                  </div>
                </div>

                <div className="space-y-6">
                  <ConceptsList 
                    concepts={concepts} 
                    title="Concepte necesare"
                    maxDisplayed={3}
                  />

                  {analysisResult?.text && (
                    <ProgressiveHints 
                      problemText={analysisResult.text}
                      buttonText="Arată următorul indiciu"
                      completedText="Ai parcurs toate indiciile!"
                      maxHints={3}
                    />
                  )}

                  <SimilarExercises 
                    exercises={similarExercises}
                    title="Exerciții similare"
                  />
                </div>

                {analysisResult.note && (
                  <div className="text-sm text-gray-600 italic pt-2 border-t">
                    {analysisResult.note}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardBody>
        <CardFooter className="text-xs text-gray-500">
          Notă: Acesta este un mock. În versiunea finală, vom folosi serviciul OCR Mathpix.
        </CardFooter>
      </Card>
    </div>
  );
}
