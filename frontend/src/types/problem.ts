/**
 * Types related to math problems and their analysis
 */

export type ProblemType = 
  | 'algebra'
  | 'geometry'
  | 'calculus'
  | 'trigonometry'
  | 'arithmetic'
  | 'equation'
  | 'inequality'
  | 'word_problem'
  | 'proof'
  | 'other';

export interface ProblemAnalysis {
  type: {
    name: ProblemType;
    confidence: number;
  };
  concepts: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  steps?: {
    description: string;
    explanation: string;
  }[];
  similarProblems?: string[];
}

export interface ProblemSolution {
  steps: {
    description: string;
    explanation: string;
    formula?: string;
    variables?: Record<string, number | string>;
  }[];
  finalAnswer: string;
  units?: string;
}

export interface MathProblem {
  id: string;
  originalText: string;
  latex?: string;
  analysis: ProblemAnalysis;
  solution?: ProblemSolution;
  createdAt: string;
  updatedAt: string;
}
