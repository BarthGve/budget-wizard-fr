
import { ComponentType } from 'react';
import { SavingsMode as AppSavingsMode, SavingsProject } from '@/types/savings-project';

// Réexporter SavingsMode
export type SavingsMode = AppSavingsMode;

// Définir et exporter FormData
export type FormData = Partial<SavingsProject>;

export interface Step {
  title: string;
  component: ComponentType<StepComponentProps>;
}

export interface StepComponentProps {
  data: FormData;
  onChange: (field: keyof FormData, value: any) => void;
  mode?: SavingsMode;
  onModeChange?: (mode: SavingsMode) => void;
}
