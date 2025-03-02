
import { MoreVertical, Trash2 } from "lucide-react";
import { useRetailers } from "./useRetailers";
import { Button } from "@/components/ui/button";
import { useDeleteRetailer } from "./useDeleteRetailer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StyledLoader from "@/components/ui/StyledLoader";

export function RetailersList() {
  const { retailers, isLoading } = useRetailers();
  const { mutate: deleteRetailer, isPending: isDeleting } = useDeleteRetailer();

  if (isLoading) {
    return <div><StyledLoader/></div>;
  }

  const handleDelete = (retailerId: string) => {
    console.log("🎯 Deleting retailer:", retailerId);
    deleteRetailer(retailerId);
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableBody>
          {retailers.map((retailer) => (
            <TableRow key={retailer.id}>
              <TableCell className="text-base">{retailer.name}</TableCell>
              <TableCell>
                {retailer.logo_url && (
                  <img 
                    src={retailer.logo_url} 
                    alt={retailer.name} 
                    className="w-8 h-8 rounded-full object-contain"
                  />
                )}
              </TableCell>
              <TableCell className="text-right">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0 ml-auto">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem 
        className="text-destructive focus:text-destructive" 
        onClick={() => handleDelete(retailer.id)} 
        disabled={isDeleting}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        {isDeleting ? "Suppression..." : "Supprimer"}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
