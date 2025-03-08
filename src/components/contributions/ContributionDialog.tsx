import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { NewContributor } from "@/types/contributor";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface ContributionDialogProps {
  children: React.ReactNode;
}

export const ContributionDialog = ({ children }: ContributionDialogProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewContributor>();

  const { mutate: createContributor, isPending: isCreating } = useMutation({
    mutationFn: async (contributor: NewContributor) => {
      const { error } = await supabase
        .from("contributors")
        .insert({
          ...contributor,
          profile_id: currentUser?.id,
          total_contribution: parseFloat(contributor.total_contribution),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      toast.success("Contributeur créé avec succès");
      reset();
      setOpen(false);
    },
    onError: (error: any) => {
      console.error("Error creating contributor:", error);
      toast.error(error.message || "Erreur lors de la création du contributeur");
    },
  });

  const onSubmit = (data: NewContributor) => {
    createContributor(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouvelle contribution</DialogTitle>
          <DialogDescription>
            Ajouter un nouveau contributeur à votre tableau de bord.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                placeholder="Nom du contributeur"
                className="col-span-3"
                {...register("name", { required: "Le nom est obligatoire" })}
              />
              {errors.name && <p className="col-span-4 text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                className="col-span-3"
                {...register("email")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="total_contribution" className="text-right">
                Contribution
              </Label>
              <Input
                id="total_contribution"
                placeholder="0.00"
                className="col-span-3"
                {...register("total_contribution", { required: "La contribution est obligatoire" })}
              />
              {errors.total_contribution && <p className="col-span-4 text-sm text-red-500">{errors.total_contribution.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
