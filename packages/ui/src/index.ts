// Components
export { MathProblemCard } from './components/shared/MathProblemCard';

// Visualizations
export { MathGraph, GraphControls } from './visualizations/MathGraph';
export { GeometryCanvas } from './visualizations/GeometryCanvas';

// Utils
export { cn } from './utils/cn';

// Types (re-export from shared)
export type {
  MathProblem,
  VisualHint,
  Category,
  Difficulty,
  Source
} from '@gomath/shared';