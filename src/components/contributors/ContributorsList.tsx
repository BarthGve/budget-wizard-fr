
import { Contributor } from "@/types/contributor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContributorCard } from "@/components/contributors/ContributorCard";
import { AddContributorDialog } from "@/components/contributors/AddContributorDialog";

interface ContributorsListProps {
  contributors: Contributor[];
  onAdd: (contributor: any) => Promise<void>;
  onUpdate: (contributor: Contributor) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const ContributorsList = ({ 
  contributors, 
  onAdd, 
  onUpdate, 
  onDelete 
}: ContributorsListProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Listing</CardTitle>
          <CardDescription>
            Tous les contributeurs participant au budget
          </CardDescription>
        </div>
        <AddContributorDialog onAdd={onAdd} />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {contributors.map((contributor: Contributor) => (
            <ContributorCard 
              key={contributor.id} 
              contributor={contributor} 
              onEdit={onUpdate} 
              onDelete={onDelete} 
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
