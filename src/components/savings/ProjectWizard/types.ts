
import { ComponentType } from 'react';
import { SavingsMode, SavingsProject } from '@/types/savings-project';

export interface Step {
  title: string;
  component: ComponentType<StepComponentProps>;
}

export interface StepComponentProps {
  data: Partial<SavingsProject>;
  onChange: (data: Partial<SavingsProject>) => void;
  mode?: SavingsMode;
  onModeChange?: (mode: SavingsMode) => void;
}
