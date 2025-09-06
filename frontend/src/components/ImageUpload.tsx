import { useState, useRef, ChangeEvent } from 'react';
import { Button, Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

type ImageUploadProps = {
  onImageSelect: (file: File) => void;
  maxSizeMB?: number;
  allowedTypes?: string[];
};

export function ImageUpload({
  onImageSelect,
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setError(`Format neacceptat. Te rog folosește ${allowedTypes.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Fișierul este prea mare. Mărimea maximă permisă: ${maxSizeMB}MB`);
      return;
    }

    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Notify parent
    onImageSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <input
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      
      <Button
        variant="contained"
        component="span"
        startIcon={<CloudUploadIcon />}
        onClick={handleClick}
        sx={{ mb: 2 }}
      >
        Alege o poză
      </Button>

      {preview && (
        <Box sx={{ mt: 2, maxWidth: '100%' }}>
          <img
            src={preview}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }}
          />
        </Box>
      )}

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
        Formate acceptate: {allowedTypes.join(', ')}, Mărime maximă: {maxSizeMB}MB
      </Typography>
    </Box>
  );
}

export default ImageUpload;
