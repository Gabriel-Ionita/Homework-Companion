import type { Meta, StoryObj } from '@storybook/react';
import { ConceptsList } from '../components/ConceptsList';

const meta: Meta<typeof ConceptsList> = {
  title: 'Components/ConceptsList',
  component: ConceptsList,
  tags: ['autodocs'],
  argTypes: {
    concepts: {
      control: 'object',
    },
    maxDisplayed: {
      control: { type: 'number', min: 1, max: 20 },
    },
    title: {
      control: 'text',
    },
    chipVariant: {
      control: 'select',
      options: ['filled', 'outlined'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof ConceptsList>;

const sampleConcepts = [
  'Ecuații de gradul I',
  'Proprietăți ale egalităților',
  'Operații cu numere întregi',
  'Formule de calcul prescurtat',
  'Proprietățile puterilor',
  'Funcții liniare',
  'Graficul funcției de gradul I',
  'Inegalități',
  'Module',
  'Sisteme de ecuații',
];

export const Default: Story = {
  args: {
    concepts: sampleConcepts,
    title: 'Concepte necesare',
    maxDisplayed: 5,
  },
};

export const FewConcepts: Story = {
  args: {
    concepts: sampleConcepts.slice(0, 3),
    title: 'Concepte de bază',
  },
};

export const FilledVariant: Story = {
  args: {
    concepts: sampleConcepts,
    chipVariant: 'filled',
    title: 'Concepte avansate',
  },
};

export const SmallSize: Story = {
  args: {
    concepts: sampleConcepts,
    size: 'small',
    title: 'Concepte (mic)',
  },
};

export const CustomMaxDisplayed: Story = {
  args: {
    concepts: sampleConcepts,
    maxDisplayed: 3,
    title: 'Concepte (max 3 afișate)',
  },
};
