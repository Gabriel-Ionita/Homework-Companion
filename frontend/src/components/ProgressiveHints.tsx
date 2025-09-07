import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Paper,
  Collapse,
  Divider,
  IconButton,
  Tooltip,
  SxProps,
  Theme,
  alpha,
  CircularProgress,
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircleOutline as CheckIcon,
} from '@mui/icons-material';

interface Hint {
  id: string;
  content: string;
  revealed: boolean;
  isFinal?: boolean;
}

interface ProgressiveHintsProps {
  problemText: string;
  title?: string;
  sx?: SxProps<Theme>;
  buttonText?: string;
  completedText?: string;
  showStepNumbers?: boolean;
  maxHints?: number;
}

/**
 * Displays progressive hints that can be revealed one at a time
 */
export function ProgressiveHints({
  problemText,
  title = 'Indicații pas cu pas',
  sx,
  buttonText = 'Arată următoarea indicație',
  completedText = 'Ai parcurs toate indicațiile!',
  showStepNumbers = true,
  maxHints = 3,
}: ProgressiveHintsProps) {
  const [hints, setHints] = useState<Hint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  const fetchHint = async (step: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/gemini/hints', {
        problemText,
        currentStep: step
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      const newHint = response.data;
      const hintWithId = {
        ...newHint,
        id: `hint-${Date.now()}`,
        revealed: true
      };
      
      setHints(prevHints => [...prevHints, hintWithId]);
      return newHint;
    } catch (err) {
      console.error('Error fetching hint:', err);
      setError('Nu s-a putut încărca următorul indiciu. Încearcă din nou.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const revealNextHint = async () => {
    if (hints.length >= maxHints) return;
    
    const nextStep = hints.length;
    await fetchHint(nextStep);
  };

  // Fetch first hint on mount
  useEffect(() => {
    if (problemText && hints.length === 0) {
      fetchHint(0);
    }
  }, [problemText]);

  const allHintsRevealed = hints.length >= maxHints || (hints.length > 0 && hints[hints.length - 1]?.isFinal);
  const hasMoreHints = hints.length < maxHints && !allHintsRevealed;
  const revealedHints = hints;

  if (loading && hints.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error && hints.length === 0) {
    return (
      <Box sx={{ p: 2, color: 'error.main', textAlign: 'center' }}>
        {error}
      </Box>
    );
  }

  return (
    <Paper
      elevation={1}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? alpha(theme.palette.primary.dark, 0.1) : alpha(theme.palette.primary.light, 0.1),
        ...sx,
      }}
    >
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1.5,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
          },
        }}
      >
        <LightbulbIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 600 }}>
          {title}
        </Typography>
        <IconButton size="small" onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ p: 2, pt: 1 }}>
          {revealedHints.map((hint, index) => (
            <Box
              key={hint.id}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                mb: index < revealedHints.length - 1 ? 1.5 : 0,
                '&:last-child': { mb: 0 },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  mr: 1.5,
                  mt: '2px',
                  flexShrink: 0,
                }}
              >
                {showStepNumbers ? index + 1 : <CheckIcon fontSize="small" />}
              </Box>
              <Typography variant="body2" sx={{ flex: 1 }}>
                {hint.content}
              </Typography>
            </Box>
          ))}

          {hasMoreHints && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : error ? (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={revealNextHint}
                  disabled={!hasMoreHints || loading}
                  startIcon={<LightbulbIcon />}
                  sx={{ mt: 1 }}
                >
                  {hasMoreHints ? buttonText : completedText}
                </Button>
              )}
            </Box>
          )}

          {allHintsRevealed && !hints.some(h => h.isFinal) && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 1, textAlign: 'center' }}
            >
              {completedText}
            </Typography>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}

export default ProgressiveHints;
