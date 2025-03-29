
export interface Asset {
  id: string;
  symbol: string;
  name: string;
  asset_type: string;
  purchase_date: string;
  purchase_price: number;
  quantity: number;
  current_price: number | null;
  created_at: string;
  updated_at: string;
}

export interface AssetWithValueData extends Asset {
  totalValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

export interface AssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  assetToEdit?: Asset;
}
