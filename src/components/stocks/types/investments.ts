
export interface Investment {
  id: string;
  investment_date: string;
  amount: number;
  asset_id?: string;
  notes?: string;
}

export interface CurrentYearInvestmentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investments: Investment[];
  onSuccess: () => void;
}
