
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface YearlyTotal {
  year: number;
  amount: number;
}

interface YearlyInvestmentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  yearlyData: YearlyTotal[];
}

export const YearlyInvestmentsDialog = ({
  open,
  onOpenChange,
  yearlyData
}: YearlyInvestmentsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Total des investissements par année</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Année</TableHead>
              <TableHead className="text-right">Montant total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {yearlyData.map((data) => (
              <TableRow key={data.year}>
                <TableCell>{data.year}</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(data.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};
