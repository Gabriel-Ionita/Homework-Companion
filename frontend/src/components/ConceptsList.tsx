import React from 'react';
import { Box, Typography, Chip, Tooltip, SxProps, Theme } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
  '& .MuiChip-icon': {
    marginLeft: 4,
  },
}));

interface ConceptsListProps {
  concepts: string[];
  maxDisplayed?: number;
  title?: string;
  sx?: SxProps<Theme>;
  chipVariant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
}

/**
 * Displays a list of mathematical concepts with optional collapsible view
 */
export function ConceptsList({
  concepts = [],
  maxDisplayed = 5,
  title = 'Concepte necesare',
  sx,
  chipVariant = 'outlined',
  size = 'medium',
}: ConceptsListProps) {
  const [expanded, setExpanded] = React.useState(false);
  const hasMore = concepts.length > maxDisplayed;
  const displayConcepts = expanded ? concepts : concepts.slice(0, maxDisplayed);

  if (concepts.length === 0) return null;

  return (
    <Box sx={{ ...sx }}>
      <Typography 
        variant="subtitle2" 
        color="text.secondary"
        gutterBottom
        sx={{ 
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontSize: '0.75rem',
          mb: 1,
        }}
      >
        {title}
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
        {displayConcepts.map((concept, index) => (
          <Tooltip key={index} title={`Concept: ${concept}`} arrow>
            <StyledChip
              label={concept}
              variant={chipVariant}
              size={size}
              color="primary"
            />
          </Tooltip>
        ))}
        
        {hasMore && !expanded && (
          <StyledChip
            label={`+${concepts.length - maxDisplayed} mai multe`}
            variant="outlined"
            size={size}
            onClick={() => setExpanded(true)}
            sx={{ cursor: 'pointer' }}
          />
        )}
        
        {expanded && (
          <StyledChip
            label="Mai puține"
            variant="outlined"
            size={size}
            onClick={() => setExpanded(false)}
            sx={{ cursor: 'pointer' }}
          />
        )}
      </Box>
    </Box>
  );
}

export default ConceptsList;
