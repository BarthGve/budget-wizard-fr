
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format, parse, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Asset } from "./types/assets";

interface InvestmentDialogProps {
  onSuccess: () => void;
}

export const InvestmentDialog = ({ onSuccess }: InvestmentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [dateString, setDateString] = useState(format(new Date(), "dd/MM/yyyy"));
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");

  // Charger les actifs disponibles
  useEffect(() => {
    if (open) {
      loadAssets();
    }
  }, [open]);

  const loadAssets = async () => {
    try {
      const { data, error } = await supabase
        .from("stock_assets")
        .select("*")
        .order("name");
        
      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error("Erreur lors du chargement des actifs:", error);
    }
  };

  const handleDateInput = (value: string) => {
    setDateString(value);
    
    // Essayer de parser la date entrée (format français: JJ/MM/AAAA)
    if (value.length === 10) { // Longueur exacte d'une date au format JJ/MM/AAAA
      try {
        const parsedDate = parse(value, "dd/MM/yyyy", new Date());
        if (isValid(parsedDate)) {
          setDate(parsedDate);
        }
      } catch (error) {
        // Si le format n'est pas valide, on ne met pas à jour la date
      }
    }
  };

  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setDateString(format(selectedDate, "dd/MM/yyyy"));
      setCalendarOpen(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const investmentAmount = parseFloat(amount);
      if (isNaN(investmentAmount) || investmentAmount <= 0) {
        throw new Error("Montant invalide");
      }

      // Vérifie que la date est valide
      if (isNaN(date.getTime())) {
        throw new Error("Date invalide");
      }

      const { error } = await supabase
        .from("stock_investments")
        .insert({
          profile_id: user.id,
          amount: investmentAmount,
          investment_date: date.toISOString(),
          asset_id: selectedAssetId || null,
          notes: notes || null
        });

      if (error) throw error;

      toast.success("Investissement enregistré avec succès");
      setAmount("");
      setNotes("");
      setSelectedAssetId("");
      setDate(new Date());
      setDateString(format(new Date(), "dd/MM/yyyy"));
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Réinitialiser le formulaire à l'ouverture
  useEffect(() => {
    if (open) {
      setAmount("");
      setNotes("");
      setSelectedAssetId("");
      setDate(new Date());
      setDateString(format(new Date(), "dd/MM/yyyy"));
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-hover gap-2">
          <Plus className="h-4 w-4" />
          Nouvel investissement
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un investissement</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date d'investissement</label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={dateString}
                onChange={(e) => handleDateInput(e.target.value)}
                placeholder="JJ/MM/AAAA"
                className="flex-1"
              />
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleCalendarSelect}
                    locale={fr}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {dateString && !isValid(date) && (
              <p className="text-sm text-red-500">Format de date invalide. Utilisez JJ/MM/AAAA</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Montant</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Montant investi"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Actif concerné (optionnel)</label>
            <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un actif" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun actif spécifique</SelectItem>
                {assets.map(asset => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.name} ({asset.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Lier cet investissement à un actif spécifique de votre portefeuille
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optionnel)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informations complémentaires sur cet investissement"
              rows={3}
            />
          </div>

          <Button className="w-full" onClick={handleSubmit}>
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
