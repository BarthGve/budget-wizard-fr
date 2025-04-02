
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddContributorDialog } from "@/components/contributors/add-contributor";
import { ContributorCard } from "@/components/contributors/ContributorCard";
import { Contributor, NewContributor } from "@/types/contributor";

interface ContributorsContentProps {
  contributors: Contributor[];
  onAdd: (contributor: NewContributor) => Promise<void>;
  onUpdate: (contributor: Contributor) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const ContributorsContent = ({ 
  contributors, 
  onAdd, 
  onUpdate, 
  onDelete 
}: ContributorsContentProps) => {
  return (
    <div bg="transparent" border="none">
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
          {Array.isArray(contributors) && contributors.map(contributor => (
            <ContributorCard 
              key={contributor.id} 
              contributor={contributor} 
              onEdit={onUpdate} 
              onDelete={onDelete} 
            />
          ))}
        </div>
      </CardContent>
    <div/>
  );
};
