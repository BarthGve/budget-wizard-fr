import { Button } from "@/components/ui/button";
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
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface NewProjectDialogProps {
  onProjectAdded: () => void;
}

export const NewProjectDialog = ({ onProjectAdded }: NewProjectDialogProps) => {
  const [open, setOpen] = useState(false);
  const [nomProjet, setNomProjet] = useState("");
  const [montantTotal, setMontantTotal] = useState("");
  const [planificationType, setPlanificationType] = useState<"par_date" | "par_mensualite">("par_date");
  const [montantMensuel, setMontantMensuel] = useState("");
  const [dateObjectif, setDateObjectif] = useState<Date>();
  const [dateString, setDateString] = useState("");
  const [addToRecurring, setAddToRecurring] = useState(false);

  const calculerMontantMensuel = (montantTotal: number, dateObjectif: Date) => {
    const today = new Date();
    const diffMois = Math.max(
      1,
      (dateObjectif.getFullYear() - today.getFullYear()) * 12 + 
      (dateObjectif.getMonth() - today.getMonth())
    );
    return Math.ceil(montantTotal / diffMois);
  };

  const calculerDateEstimee = (montantTotal: number, montantMensuel: number) => {
    const nombreMois = Math.ceil(montantTotal / montantMensuel);
    const dateEstimee = new Date();
    dateEstimee.setMonth(dateEstimee.getMonth() + nombreMois);
    return dateEstimee;
  };

  const handleDateInput = (value: string) => {
    setDateString(value);
    // Format attendu : MM/YYYY
    const [month, year] = value.split('/');
    if (month && year && month.length === 2 && year.length === 4) {
      const date = new Date(parseInt(year), parseInt(month) - 1);
      if (!isNaN(date.getTime()) && date > new Date()) {
        setDateObjectif(date);
      }
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      setDateObjectif(date);
      setDateString(format(date, 'MM/yyyy'));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!nomProjet.trim()) {
        toast.error("Le nom du projet est requis");
        return;
      }

      const montantTotalNum = parseFloat(montantTotal);
      if (isNaN(montantTotalNum) || montantTotalNum <= 0) {
        toast.error("Le montant total doit être un nombre positif");
        return;
      }

      let montantMensuelFinal = 0;
      let nombreMois = 0;
      let dateEstimee = null;

      if (planificationType === "par_date") {
        if (!dateObjectif) {
          toast.error("La date objectif est requise");
          return;
        }
        montantMensuelFinal = calculerMontantMensuel(montantTotalNum, dateObjectif);
        dateEstimee = dateObjectif;
      } else {
        const montantMensuelNum = parseFloat(montantMensuel);
        if (isNaN(montantMensuelNum) || montantMensuelNum <= 0) {
          toast.error("Le montant mensuel doit être un nombre positif");
          return;
        }
        montantMensuelFinal = montantMensuelNum;
        dateEstimee = calculerDateEstimee(montantTotalNum, montantMensuelNum);
        nombreMois = Math.ceil(montantTotalNum / montantMensuelNum);
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { error: projetError } = await supabase.from("projets_epargne").insert({
        profile_id: user?.id,
        nom_projet: nomProjet,
        montant_total: montantTotalNum,
        mode_planification: planificationType,
        montant_mensuel: montantMensuelFinal,
        nombre_mois: nombreMois || null,
        date_estimee: dateEstimee
      });

      if (projetError) throw projetError;

      if (addToRecurring) {
        const { error: recurringError } = await supabase.from("recurring_expenses").insert({
          profile_id: user?.id,
          name: `Épargne - ${nomProjet}`,
          amount: montantMensuelFinal,
          category: "Épargne",
          periodicity: "monthly",
          debit_day: 1
        });

        if (recurringError) throw recurringError;
      }

      toast.success("Projet d'épargne créé avec succès");
      onProjectAdded();
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating savings project:", error);
      toast.error("Erreur lors de la création du projet d'épargne");
    }
  };

  const resetForm = () => {
    setNomProjet("");
    setMontantTotal("");
    setPlanificationType("par_date");
    setMontantMensuel("");
    setDateObjectif(undefined);
    setDateString("");
    setAddToRecurring(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Projet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau projet d&apos;épargne</DialogTitle>
          <DialogDescription>
            Créez un nouveau projet d&apos;épargne avec des objectifs clairs
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="nom-projet">Nom du projet</Label>
            <Input
              id="nom-projet"
              value={nomProjet}
              onChange={(e) => setNomProjet(e.target.value)}
              placeholder="Ex: Achat immobilier, Voyage..."
            />
          </div>
          <div>
            <Label htmlFor="montant-total">Montant total (€)</Label>
            <Input
              id="montant-total"
              type="number"
              value={montantTotal}
              onChange={(e) => setMontantTotal(e.target.value)}
              placeholder="Ex: 10000"
            />
          </div>
          <div className="space-y-2">
            <Label>Mode de planification</Label>
            <RadioGroup value={planificationType} onValueChange={(value: "par_date" | "par_mensualite") => setPlanificationType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="par_date" id="par-date" />
                <Label htmlFor="par-date">Par date objectif</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="par_mensualite" id="par-mensualite" />
                <Label htmlFor="par-mensualite">Par montant mensuel</Label>
              </div>
            </RadioGroup>
          </div>

          {planificationType === "par_date" ? (
            <div className="space-y-2">
              <Label>Date objectif</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="MM/YYYY"
                  value={dateString}
                  onChange={(e) => handleDateInput(e.target.value)}
                  className="flex-1"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateObjectif}
                      onSelect={handleCalendarSelect}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {dateObjectif && montantTotal && parseFloat(montantTotal) > 0 && (
                <p className="text-sm text-muted-foreground">
                  Montant mensuel nécessaire : {formatCurrency(calculerMontantMensuel(parseFloat(montantTotal), dateObjectif))}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="montant-mensuel">Montant mensuel (€)</Label>
              <Input
                id="montant-mensuel"
                type="number"
                value={montantMensuel}
                onChange={(e) => setMontantMensuel(e.target.value)}
                placeholder="Ex: 500"
              />
              {montantMensuel && montantTotal && 
               parseFloat(montantMensuel) > 0 && 
               parseFloat(montantTotal) > 0 && (
                <p className="text-sm text-muted-foreground">
                  Date estimée : {format(
                    calculerDateEstimee(
                      parseFloat(montantTotal), 
                      parseFloat(montantMensuel)
                    ), 
                    "MMMM yyyy", 
                    { locale: fr }
                  )}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="add-to-recurring"
              checked={addToRecurring}
              onCheckedChange={setAddToRecurring}
            />
            <Label htmlFor="add-to-recurring">Ajouter aux charges récurrentes</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Créer le projet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
