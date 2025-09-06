import type { Meta, StoryObj } from '@storybook/react';
import { ProgressiveHints } from '../components/ProgressiveHints';

const meta: Meta<typeof ProgressiveHints> = {
  title: 'Components/ProgressiveHints',
  component: ProgressiveHints,
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
    },
    buttonText: {
      control: 'text',
    },
    completedText: {
      control: 'text',
    },
    showStepNumbers: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProgressiveHints>;

const sampleHints = [
  {
    id: 'hint-1',
    content: 'Începe prin a identifica datele cunoscute din problemă.',
  },
  {
    id: 'hint-2',
    content: 'Scrie ecuația care modelează problema.',
  },
  {
    id: 'hint-3',
    content: 'Simplifică ecuația pentru a o aduce la forma cea mai simplă.',
  },
  {
    id: 'hint-4',
    content: 'Rezolvă ecuația obținută.',
  },
  {
    id: 'hint-5',
    content: 'Verifică soluția în contextul problemei.',
    isFinal: true,
  },
];

export const Default: Story = {
  args: {
    hints: sampleHints,
    title: 'Indicații pas cu pas',
    buttonText: 'Arată următoarea indicație',
    completedText: 'Ai parcurs toate indicațiile!',
    showStepNumbers: true,
  },
};

export const CustomButtonText: Story = {
  args: {
    ...Default.args,
    buttonText: 'Următorul pas',
    completedText: 'Felicitări! Ai terminat toți pașii.',
  },
};

export const WithoutStepNumbers: Story = {
  args: {
    ...Default.args,
    showStepNumbers: false,
  },
};

export const SingleHint: Story = {
  args: {
    hints: [sampleHints[0]],
    title: 'Sfat rapid',
    buttonText: 'Arată sfatul',
  },
};

export const CustomStyling: Story = {
  args: {
    ...Default.args,
    title: 'Cum să rezolvi această problemă',
    sx: {
      maxWidth: 500,
      mx: 'auto',
      border: '1px solid',
      borderColor: 'primary.light',
    },
  },
};
