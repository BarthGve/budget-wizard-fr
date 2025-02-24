
export interface Investment {
  id: string;
  investment_date: string;
  amount: number;
}

export interface CurrentYearInvestmentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investments: Investment[];
  onSuccess: () => void;
}
