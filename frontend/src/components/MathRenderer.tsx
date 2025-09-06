import React, { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Box, SxProps, Theme, Tooltip, IconButton, Collapse, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';

const MathContainer = styled(Box, {
  shouldForwardProp: (prop) => !['inline', 'copyable'].includes(prop as string),
})<{ inline?: boolean; copyable?: boolean }>(({ theme, inline, copyable }) => ({
  position: 'relative',
  display: inline,
  ...(inline ? {
    display: 'inline',
    '& .katex': {
      display: 'inline',
      fontSize: '1.1em',
    },
    '& .katex-display': {
      margin: '0.5em 0',
      display: 'inline-block',
      width: '100%',
      overflowX: 'auto',
      overflowY: 'hidden',
    },
  } : {
    display: 'block',
    margin: '1em 0',
    '& .katex-display': {
      margin: '0.5em 0',
      overflowX: 'auto',
      overflowY: 'hidden',
    },
  }),
  ...(copyable && {
    '&:hover': {
      '& .copy-button': {
        opacity: 1,
      },
    },
  }),
}));

const CopyButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 4,
  right: 4,
  backgroundColor: theme.palette.background.paper,
  opacity: 0,
  transition: 'opacity 0.2s',
  padding: '4px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const SuccessIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 4,
  right: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText,
  '& svg': {
    fontSize: '1rem',
  },
}));

interface MathRendererProps {
  /**
   * The LaTeX string to render
   */
  children: string;
  /**
   * Whether to render as inline math or display math
   * @default false
   */
  inline?: boolean;
  /**
   * Whether to show copy button
   * @default true
   */
  copyable?: boolean;
  /**
   * Additional styles
   */
  sx?: SxProps<Theme>;
  /**
   * Error handler for rendering errors
   */
  onError?: (error: any) => void;
  /**
   * Whether to show the raw LaTeX source on hover
   * @default true
   */
  showSourceOnHover?: boolean;
}

/**
 * A component for rendering mathematical expressions using KaTeX
 * 
 * Supports both inline and display math, with features like copy-to-clipboard
 * and error handling.
 */
export function MathRenderer({
  children,
  inline = false,
  copyable = true,
  sx,
  onError,
  showSourceOnHover = true,
}: MathRendererProps) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [showSource, setShowSource] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
  };

  const toggleSource = () => {
    setShowSource(!showSource);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const renderMath = () => {
    try {
      const props = {
        math: children,
        errorColor: theme.palette.error.main,
        renderError: (error: any) => {
          const err = new Error(`Failed to render math: ${error.message}`);
          setError(err);
          onError?.(err);
          return <span style={{ color: theme.palette.error.main }}>{children}</span>;
        },
      };

      return inline ? <InlineMath {...props} /> : <BlockMath {...props} />;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to render math');
      setError(error);
      onError?.(error);
      return <span style={{ color: theme.palette.error.main }}>{children}</span>;
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: inline ? 'inline' : 'block',
        ...sx,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <MathContainer 
        inline={inline} 
        copyable={copyable && !inline}
        sx={{
          border: error ? `1px solid ${theme.palette.error.main}40` : 'none',
          borderRadius: 1,
          p: error ? 1 : 0,
          bgcolor: error ? `${theme.palette.error.main}08` : 'transparent',
          width: inline ? 'auto' : '100%',
          display: inline ? 'inline' : 'block',
        }}
      >
        {renderMath()}
        
        {copyable && !inline && !copied && (
          <Tooltip title="Copiază LaTeX" arrow>
            <CopyButton 
              className="copy-button" 
              onClick={handleCopy}
              size="small"
              sx={{
                opacity: isHovered ? 1 : 0,
              }}
            >
              <ContentCopyIcon fontSize="inherit" />
            </CopyButton>
          </Tooltip>
        )}
        
        {copied && (
          <Fade in={copied} timeout={500}>
            <SuccessIcon>
              <CheckIcon fontSize="inherit" />
            </SuccessIcon>
          </Fade>
        )}
      </MathContainer>

      {error && (
        <Typography
          variant="caption"
          color="error"
          sx={{
            display: 'block',
            mt: 0.5,
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {error.message}
        </Typography>
      )}

      {showSourceOnHover && !inline && (
        <>
          <Box
            onClick={toggleSource}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              mt: 0.5,
              cursor: 'pointer',
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
              },
              fontSize: '0.75rem',
              userSelect: 'none',
            }}
          >
            {showSource ? 'Ascunde codul' : 'Arată codul LaTeX'}
            <ExpandMoreIcon
              sx={{
                transform: showSource ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                fontSize: '1rem',
                ml: 0.5,
              }}
            />
          </Box>
          
          <Collapse in={showSource}>
            <Box
              component="pre"
              sx={{
                mt: 1,
                p: 1.5,
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                overflowX: 'auto',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {children}
            </Box>
          </Collapse>
        </>
      )}
    </Box>
  );
}

export default MathRenderer;
