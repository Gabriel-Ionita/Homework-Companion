import React, { useState } from 'react';
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
  hints: Omit<Hint, 'revealed'>[];
  title?: string;
  sx?: SxProps<Theme>;
  buttonText?: string;
  completedText?: string;
  showStepNumbers?: boolean;
}

/**
 * Displays progressive hints that can be revealed one at a time
 */
export function ProgressiveHints({
  hints: initialHints,
  title = 'Indicații pas cu pas',
  sx,
  buttonText = 'Arată următoarea indicație',
  completedText = 'Ai parcurs toate indicațiile!',
  showStepNumbers = true,
}: ProgressiveHintsProps) {
  const [hints, setHints] = useState<Hint[]>(() =>
    initialHints.map((hint, index) => ({
      ...hint,
      revealed: index === 0, // First hint is revealed by default
    }))
  );
  const [expanded, setExpanded] = useState(true);

  const revealNextHint = () => {
    const nextHintIndex = hints.findIndex((hint) => !hint.revealed);
    if (nextHintIndex !== -1) {
      const newHints = [...hints];
      newHints[nextHintIndex].revealed = true;
      setHints(newHints);
    }
  };

  const allHintsRevealed = hints.every((hint) => hint.revealed);
  const hasMoreHints = hints.some((hint) => !hint.revealed);
  const revealedHints = hints.filter((hint) => hint.revealed);

  if (hints.length === 0) return null;

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
              <Button
                variant="outlined"
                size="small"
                onClick={revealNextHint}
                startIcon={<LightbulbIcon />}
                sx={{ borderRadius: 4 }}
              >
                {buttonText}
              </Button>
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
