export enum GameMode {
  GRAMMAR = 'GRAMMAR',
  CODE = 'CODE'
}

export interface GameTask {
  mode: GameMode;
  prompt: string;
  answer: string;
  promptLabel: string;
  category?: string;
}

export interface Player {
  id: number;
  name: string;
  color: string;
  position: number;
}

export enum GamePhase {
  SETUP = 'SETUP',
  TASK_REVEAL = 'TASK_REVEAL',
  ANSWER_CHECK = 'ANSWER_CHECK',
  MOVEMENT = 'MOVEMENT',
  WIN = 'WIN'
}

export enum Difficulty {
  CORRECT = 'CORRECT',
  ONE_ERROR = 'ONE_ERROR',
  TWO_ERRORS = 'TWO_ERRORS',
  THREE_ERRORS = 'THREE_ERRORS'
}