import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  SxProps,
  Theme,
  useTheme,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  OpenInNew as OpenInNewIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const DifficultyChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'difficulty',
})<{ difficulty: 'easy' | 'medium' | 'hard' }>(({ theme, difficulty }) => {
  const colorMap = {
    easy: theme.palette.success.main,
    medium: theme.palette.warning.main,
    hard: theme.palette.error.main,
  };

  return {
    display: 'inline-block',
    padding: theme.spacing(0.25, 1),
    borderRadius: 12,
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    backgroundColor: `${colorMap[difficulty]}20`,
    color: colorMap[difficulty],
    border: `1px solid ${colorMap[difficulty]}40`,
  };
});

interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  concepts: string[];
  source?: string;
  type?: string;
}

interface SimilarExercisesProps {
  exercises: Exercise[];
  title?: string;
  maxDisplayed?: number;
  sx?: SxProps<Theme>;
  onExerciseClick?: (exerciseId: string) => void;
  onBookmark?: (exerciseId: string) => void;
  onShare?: (exerciseId: string) => void;
}

/**
 * Displays a grid of similar exercises with various actions
 */
export function SimilarExercises({
  exercises = [],
  title = 'Exerciții similare',
  maxDisplayed = 3,
  sx,
  onExerciseClick,
  onBookmark,
  onShare,
}: SimilarExercisesProps) {
  const theme = useTheme();
  const displayedExercises = exercises.slice(0, maxDisplayed);

  if (exercises.length === 0) return null;

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      easy: 'Ușor',
      medium: 'Mediu',
      hard: 'Dificil',
    };
    return labels[difficulty as keyof typeof labels] || difficulty;
  };

  return (
    <Box sx={sx}>
      <Typography
        variant="h6"
        component="h3"
        gutterBottom
        sx={{
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          color: 'text.primary',
        }}
      >
        {title}
        <Typography
          component="span"
          variant="body2"
          sx={{
            ml: 1,
            color: 'text.secondary',
            fontWeight: 'normal',
          }}
        >
          ({exercises.length} rezultate)
        </Typography>
      </Typography>

      <Grid container spacing={2}>
        {displayedExercises.map((exercise) => (
          <Grid item xs={12} sm={6} md={4} key={exercise.id}>
            <StyledCard>
              <CardActionArea
                onClick={() => onExerciseClick?.(exercise.id)}
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  p: 2,
                }}
              >
                <Box sx={{ width: '100%', mb: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 1,
                    }}
                  >
                    <DifficultyChip difficulty={exercise.difficulty}>
                      {getDifficultyLabel(exercise.difficulty)}
                    </DifficultyChip>
                    <Box>
                      {onBookmark && (
                        <Tooltip title="Salvează" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onBookmark(exercise.id);
                            }}
                            sx={{ color: 'text.secondary' }}
                          >
                            <BookmarkBorderIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onShare && (
                        <Tooltip title="Partajează" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onShare(exercise.id);
                            }}
                            sx={{ color: 'text.secondary' }}
                          >
                            <ShareIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>

                  {exercise.type && (
                    <Typography
                      variant="caption"
                      color="primary"
                      sx={{
                        display: 'block',
                        fontWeight: 500,
                        mb: 0.5,
                      }}
                    >
                      {exercise.type}
                    </Typography>
                  )}

                  <Typography
                    variant="subtitle1"
                    component="h4"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {exercise.title}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    flex: 1,
                    mb: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {exercise.description}
                </Typography>

                <Box
                  sx={{
                    width: '100%',
                    mt: 'auto',
                    pt: 1,
                    borderTop: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {exercise.concepts.slice(0, 2).map((concept, index) => (
                        <Box
                          key={index}
                          sx={{
                            fontSize: '0.7rem',
                            color: 'primary.main',
                            bgcolor: 'primary.50',
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: 100,
                          }}
                        >
                          {concept}
                        </Box>
                      ))}
                      {exercise.concepts.length > 2 && (
                        <Tooltip
                          title={exercise.concepts.slice(2).join(', ')}
                          arrow
                        >
                          <Box
                            sx={{
                              fontSize: '0.7rem',
                              color: 'text.secondary',
                              bgcolor: 'action.hover',
                              px: 1,
                              py: 0.25,
                              borderRadius: 1,
                            }}
                          >
                            +{exercise.concepts.length - 2}
                          </Box>
                        </Tooltip>
                      )}
                    </Box>
                    <ArrowForwardIcon
                      fontSize="small"
                      sx={{
                        color: 'primary.main',
                        opacity: 0.7,
                        transition: 'opacity 0.2s',
                        'a:hover &': {
                          opacity: 1,
                        },
                      }}
                    />
                  </Box>
                </Box>
              </CardActionArea>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {exercises.length > maxDisplayed && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Afișate {displayedExercises.length} din {exercises.length} exerciții
            similare
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default SimilarExercises;
