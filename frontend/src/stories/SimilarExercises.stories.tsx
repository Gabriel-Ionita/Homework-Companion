import type { Meta, StoryObj } from '@storybook/react';
import { SimilarExercises } from '../components/SimilarExercises';

const meta: Meta<typeof SimilarExercises> = {
  title: 'Components/SimilarExercises',
  component: SimilarExercises,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    maxDisplayed: {
      control: { type: 'number', min: 1, max: 12 },
    },
    onExerciseClick: { action: 'exercise-clicked' },
    onBookmark: { action: 'bookmark-clicked' },
    onShare: { action: 'share-clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof SimilarExercises>;

const sampleExercises = [
  {
    id: 'ex1',
    title: 'Rezolvarea ecuației de gradul I',
    description: 'Găsiți valoarea lui x în ecuația: 2x + 5 = 13',
    difficulty: 'easy' as const,
    concepts: ['Ecuații de gradul I', 'Algebră'],
    type: 'Algebră',
  },
  {
    id: 'ex2',
    title: 'Aria triunghiului dreptunghic',
    description: 'Calculați aria unui triunghi dreptunghic cu catetele de 3 cm și 4 cm.',
    difficulty: 'easy' as const,
    concepts: ['Geometrie', 'Arie', 'Triunghi dreptunghic'],
    type: 'Geometrie',
  },
  {
    id: 'ex3',
    title: 'Probleme cu procente',
    description: 'Dacă un produs costă 200 de lei și are o reducere de 15%, care este noul preț?',
    difficulty: 'medium' as const,
    concepts: ['Procente', 'Calcule procentuale', 'Matematică financiară'],
    type: 'Aritmetică',
  },
  {
    id: 'ex4',
    title: 'Teorema lui Pitagora',
    description: 'Într-un triunghi dreptunghic, ipotenuza are lungimea de 10 cm, iar una dintre catete are 6 cm. Aflați lungimea celeilalte catete.',
    difficulty: 'medium' as const,
    concepts: ['Teorema lui Pitagora', 'Triunghi dreptunghic', 'Geometrie'],
    type: 'Geometrie',
  },
  {
    id: 'ex5',
    title: 'Sisteme de ecuații',
    description: 'Rezolvați sistemul de ecuații: 2x + 3y = 12 și 3x - y = 7',
    difficulty: 'hard' as const,
    concepts: ['Sisteme de ecuații', 'Algebră liniară', 'Metoda substituției'],
    type: 'Algebră',
  },
];

export const Default: Story = {
  args: {
    exercises: sampleExercises,
    title: 'Exerciții similare',
    maxDisplayed: 3,
  },
};

export const TwoColumns: Story = {
  args: {
    ...Default.args,
    maxDisplayed: 2,
  },
};

export const ManyExercises: Story = {
  args: {
    ...Default.args,
    exercises: [...sampleExercises, ...sampleExercises.map((ex, i) => ({
      ...ex,
      id: `ex${i + sampleExercises.length + 1}`,
    }))],
    maxDisplayed: 6,
  },
};

export const CustomTitle: Story = {
  args: {
    ...Default.args,
    title: 'Exerciții recomandate',
  },
};

export const WithoutActions: Story = {
  args: {
    ...Default.args,
    onBookmark: undefined,
    onShare: undefined,
  },
};
