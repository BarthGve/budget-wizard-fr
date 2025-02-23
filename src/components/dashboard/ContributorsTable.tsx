
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor, getInitials } from "@/utils/avatarColors";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ContributorsTableProps {
  contributors: Array<{
    name: string;
    total_contribution: number;
    percentage_contribution: number;
    is_owner?: boolean;
  }>;
  totalExpenses: number;
  totalCredits: number;
}

export const ContributorsTable = ({ 
  contributors, 
  totalExpenses,
  totalCredits 
}: ContributorsTableProps) => {
  if (contributors.length <= 1) return null;

  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  // Fetch profile avatar
  const { data: profile } = useQuery({
    queryKey: ["profile-avatar-table"],
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des charges</CardTitle>
        <CardDescription>Détail des revenus et participations par contributeur</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contributeur</TableHead>
                <TableHead className="text-right">Revenus mensuels</TableHead>
                <TableHead className="text-right">Part des revenus</TableHead>
                <TableHead className="text-right">Participation aux charges</TableHead>
                <TableHead className="text-right">Participation aux crédits</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contributors.map((contributor) => {
                const expenseShare = (totalExpenses * contributor.percentage_contribution) / 100;
                const creditShare = (totalCredits * contributor.percentage_contribution) / 100;
                const initials = getInitials(contributor.name);
                const avatarColors = getAvatarColor(contributor.name, isDarkTheme);
                const isOwner = contributor.is_owner;
                
                return (
                  <TableRow key={contributor.name}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          {isOwner && profile?.avatar_url ? (
                            <AvatarImage src={profile.avatar_url} alt={contributor.name} />
                          ) : null}
                          <AvatarFallback
                            style={{
                              backgroundColor: avatarColors.background,
                              color: avatarColors.text,
                            }}
                          >
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span>{contributor.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{contributor.total_contribution.toFixed(2)} €</TableCell>
                    <TableCell className="text-right">{contributor.percentage_contribution.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">{expenseShare.toFixed(2)} €</TableCell>
                    <TableCell className="text-right">{creditShare.toFixed(2)} €</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
