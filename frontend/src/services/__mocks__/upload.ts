export interface UploadResult {
  ocrJobId?: string;
  imageUrl?: string;
  message?: string;
  text?: string;
  latex_styled?: string;
  confidence?: number;
}

export async function uploadImage(file: File): Promise<UploadResult> {
  console.log('Mock uploadImage called with file:', file.name);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock response
  return {
    ocrJobId: 'mock-job-123',
    imageUrl: URL.createObjectURL(file),
    message: 'Image uploaded successfully',
    text: '2x + 3 = 7',
    latex_styled: '2x + 3 = 7',
    confidence: 0.95
  };
}
