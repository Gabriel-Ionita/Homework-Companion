import type { Meta, StoryObj } from '@storybook/react';
import { MathRenderer } from '../components/MathRenderer';
import { Box, Typography, Stack } from '@mui/material';

const meta: Meta<typeof MathRenderer> = {
  title: 'Components/MathRenderer',
  component: MathRenderer,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MathRenderer>;

const blockExamples = [
  'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
  '\\int_{a}^{b} x^2 \\, dx = \\left. \\frac{x^3}{3} \\right|_{a}^{b}',
  '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}'
];

const inlineExamples = [
  'E = mc^2',
  '\\sin^2\\theta + \\cos^2\\theta = 1',
  '\\frac{d}{dx}\\left(\\int_{0}^{x} f(t)\\,dt\\right) = f(x)'
];

export const BlockMath: Story = {
  args: {
    children: blockExamples[0],
    inline: false,
    copyable: true,
  },
};

export const InlineMath: Story = {
  args: {
    children: inlineExamples[0],
    inline: true,
  },
  decorators: [
    (Story) => (
      <Typography>
        Text cu formulă matematică: <Story args={{ inline: true }} /> continuare text.
      </Typography>
    ),
  ],
};

export const MultipleExamples: Story = {
  render: () => (
    <Stack spacing={4}>
      {blockExamples.map((example, index) => (
        <MathRenderer key={`block-${index}`}>
          {example}
        </MathRenderer>
      ))}
    </Stack>
  ),
};
