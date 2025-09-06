import type { Meta, StoryObj } from '@storybook/react';
import ProblemType, { ProblemType as ProblemTypeComponent } from '../components/ProblemType';
import { ProblemType as ProblemTypeModel } from '../types/problem';

const meta: Meta<typeof ProblemTypeComponent> = {
  title: 'Components/ProblemType',
  component: ProblemTypeComponent,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: [
        'algebra',
        'geometry',
        'calculus',
        'trigonometry',
        'arithmetic',
        'equation',
        'inequality',
        'word_problem',
        'proof',
        'other',
      ] as ProblemTypeModel[],
    },
    confidence: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
    },
    variant: {
      control: 'select',
      options: ['outlined', 'filled'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProblemTypeComponent>;

export const Default: Story = {
  args: {
    type: 'algebra',
    confidence: 0.85,
  },
};

export const HighConfidence: Story = {
  args: {
    type: 'geometry',
    confidence: 0.95,
    variant: 'filled',
  },
};

export const LowConfidence: Story = {
  args: {
    type: 'equation',
    confidence: 0.45,
  },
};

export const WithTooltip: Story = {
  args: {
    type: 'word_problem',
    confidence: 0.75,
    tooltip: 'Această problemă necesită interpretarea textului pentru a fi rezolvată',
  },
};

export const SmallVariant: Story = {
  args: {
    type: 'trigonometry',
    confidence: 0.8,
    size: 'small',
  },
};

export const NoConfidence: Story = {
  args: {
    type: 'other',
    showConfidence: false,
  },
};
