
import { useState } from "react";
import { useContributions, type Contribution } from "@/hooks/useContributions";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ContributionsTable } from "@/components/admin/ContributionsTable";
import { ContributionsKanban } from "@/components/admin/ContributionsKanban";
import { ContributionViewToggle } from "@/components/admin/ContributionViewToggle";
import { ContributionDetailsDialog } from "@/components/admin/ContributionDetailsDialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardPenIcon, Search } from "lucide-react";

export const ContributionsPage = () => {
  const [showDetails, setShowDetails] = useState(false);
  
  const {
    view,
    setView,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    selectedContribution,
    setSelectedContribution,
    filteredContributions,
    handleStatusUpdate,
    deleteContribution,
    updateStatus,
    handleDragEnd,
  } = useContributions();

  const handleViewContribution = (contribution: Contribution) => {
    setSelectedContribution(contribution);
    setShowDetails(true);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <ClipboardPenIcon className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">Contributions des utilisateurs</h1>
            </div>
            <ContributionViewToggle view={view} onViewChange={setView} />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as "pending" | "in_progress" | "completed" | "all")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">À traiter</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="completed">Traité</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {view === "table" ? (
          <ContributionsTable
            contributions={filteredContributions}
            onViewDetails={handleViewContribution}
            onStatusUpdate={handleStatusUpdate}
            onDelete={deleteContribution}
            onUpdateStatus={updateStatus}
          />
        ) : (
          <ContributionsKanban
            contributions={filteredContributions}
            onDragEnd={handleDragEnd}
          />
        )}

        <ContributionDetailsDialog
          contribution={selectedContribution}
          onOpenChange={setShowDetails}
        />
      </div>
    </DashboardLayout>
  );
};

export default ContributionsPage;
