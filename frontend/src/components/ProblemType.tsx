import { Box, Chip, Tooltip, Typography, styled } from '@mui/material';
import { ProblemType as ProblemTypeModel } from '../types/problem';
import MathRenderer from './MathRenderer';

interface ProblemTypeProps {
  type: ProblemTypeModel;
  confidence?: number;
  variant?: 'outlined' | 'filled';
  size?: 'small' | 'medium';
  showConfidence?: boolean;
  tooltip?: string | { text: string; latex?: string };
}

/**
 * Displays the type of a math problem with an optional confidence indicator
 */
// Map problem types to user-friendly labels
const TYPE_LABELS: Record<ProblemTypeModel, string> = {
  algebra: 'Algebră',
  geometry: 'Geometrie',
  calculus: 'Analiză matematică',
  trigonometry: 'Trigonometrie',
  arithmetic: 'Aritmetică',
  equation: 'Ecuație',
  inequality: 'Inegalitate',
  word_problem: 'Problemă de matematică',
  proof: 'Demonstrație',
  other: 'Alt tip de problemă',
};

// Map problem types to Material-UI colors
const TYPE_COLORS: Record<ProblemTypeModel, string> = {
  algebra: 'primary',
  geometry: 'secondary',
  calculus: 'success',
  trigonometry: 'info',
  arithmetic: 'warning',
  equation: 'error',
  inequality: 'error',
  word_problem: 'primary',
  proof: 'success',
  other: 'default',
};

export function ProblemType({
  type,
  confidence,
  variant = 'outlined',
  size = 'medium',
  showConfidence = true,
  tooltip,
}: ProblemTypeProps) {
  const confidenceText = confidence
    ? `Siguranță: ${Math.round(confidence * 100)}%`
    : null;

  const chip = (
    <Chip
      label={TYPE_LABELS[type] || type}
      color={TYPE_COLORS[type] as any}
      variant={variant}
      size={size}
      sx={{
        fontWeight: 600,
        textTransform: 'capitalize',
        '& .MuiChip-label': {
          px: 1,
        },
      }}
    />
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {tooltip ? (
        <Tooltip 
          title={
            typeof tooltip === 'string' ? (
              tooltip
            ) : (
              <Box>
                <Typography variant="body2" gutterBottom>{tooltip.text}</Typography>
                {tooltip.latex && (
                  <Box sx={{ mt: 1 }}>
                    <MathRenderer>{tooltip.latex}</MathRenderer>
                  </Box>
                )}
              </Box>
            )
          } 
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                maxWidth: 400,
                '& .katex': { fontSize: '1em' },
                '& .katex-display': { margin: '0.5em 0' }
              }
            }
          }}
        >
          {chip}
        </Tooltip>
      ) : (
        chip
      )}
      {showConfidence && confidenceText && (
        <Tooltip title="Nivelul de încredere în analiză">
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontStyle: 'italic',
              fontSize: size === 'small' ? '0.7rem' : '0.8125rem',
            }}
          >
            {confidenceText}
          </Typography>
        </Tooltip>
      )}
    </Box>
  );
}

export default ProblemType;
