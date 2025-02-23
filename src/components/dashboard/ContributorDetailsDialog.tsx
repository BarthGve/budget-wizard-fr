
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor, getInitials } from "@/utils/avatarColors";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { PaginationControls } from "@/components/properties/expenses/PaginationControls";
import { Contributor } from "@/types/contributor";

interface ContributorDetailsDialogProps {
  contributor: Contributor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContributorDetailsDialog({ 
  contributor, 
  open, 
  onOpenChange 
}: ContributorDetailsDialogProps) {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch profile avatar if the contributor is the owner
  const { data: profile } = useQuery({
    queryKey: ["profile-avatar-details", contributor.is_owner],
    enabled: contributor.is_owner && open,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();

      return data;
    },
  });

  // Fetch monthly expenses and credits when modal is open
  const { data: monthlyData } = useQuery({
    queryKey: ["contributor-monthly-data", contributor.name],
    enabled: open,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      // Fetch recurring expenses
      const { data: expenses } = await supabase
        .from("recurring_expenses")
        .select("*")
        .eq("profile_id", user.id);

      // Fetch credits
      const { data: credits } = await supabase
        .from("credits")
        .select("*")
        .eq("profile_id", user.id)
        .eq("statut", "actif");

      return {
        expenses: expenses || [],
        credits: credits || [],
      };
    },
  });

  const pieChartData = [
    {
      name: "Charges",
      value: contributor.expenseShare || 0,
    },
    {
      name: "Crédits",
      value: contributor.creditShare || 0,
    },
  ];

  const COLORS = ["#10B981", "#3B82F6"];

  const paginatedData = monthlyData ? {
    expenses: monthlyData.expenses.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ),
    credits: monthlyData.credits
  } : null;

  const totalPages = monthlyData 
    ? Math.ceil(monthlyData.expenses.length / itemsPerPage)
    : 1;

  const initials = getInitials(contributor.name);
  const avatarColors = getAvatarColor(contributor.name, isDarkTheme);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[500px]">
        <DialogHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              {contributor.is_owner && profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={contributor.name} />
              ) : null}
              <AvatarFallback
                className="text-lg"
                style={{
                  backgroundColor: avatarColors.background,
                  color: avatarColors.text,
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <DialogTitle className="text-xl">
              Détails pour {contributor.name}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Répartition Chart */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Répartition Charges/Crédits</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Monthly Details */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Détails du mois en cours</h3>
            <div className="space-y-4">
              {paginatedData?.expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-2 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{expense.name}</p>
                    <p className="text-sm text-muted-foreground">{expense.category}</p>
                  </div>
                  <p className="font-medium">
                    {(expense.amount * (contributor.percentage_contribution / 100)).toFixed(2)} €
                  </p>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
