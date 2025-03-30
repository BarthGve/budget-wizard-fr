
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format, parse, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Asset, AssetDialogProps } from "./types/assets";

// Types d'actifs disponibles
export const assetTypes = [
  { value: "action", label: "Action" },
  { value: "etf", label: "ETF" },
  { value: "obligation", label: "Obligation" },
  { value: "crypto", label: "Cryptomonnaie" },
  { value: "forex", label: "Forex" },
  { value: "matiere_premiere", label: "Matière première" },
  { value: "autre", label: "Autre" }
];

interface AssetFormValues {
  symbol: string;
  name: string;
  asset_type: string;
  purchase_date: Date;
  purchase_price: string;
  quantity: string;
}

export const AssetDialog = ({ open, onOpenChange, onSuccess, assetToEdit }: AssetDialogProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [dateString, setDateString] = useState(format(new Date(), "dd/MM/yyyy"));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const isEditing = !!assetToEdit;

  const form = useForm<AssetFormValues>({
    defaultValues: {
      symbol: assetToEdit?.symbol || "",
      name: assetToEdit?.name || "",
      asset_type: assetToEdit?.asset_type || "action",
      purchase_date: assetToEdit ? new Date(assetToEdit.purchase_date) : new Date(),
      purchase_price: assetToEdit ? assetToEdit.purchase_price.toString() : "",
      quantity: assetToEdit ? assetToEdit.quantity.toString() : "",
    },
  });

  useEffect(() => {
    if (assetToEdit) {
      const purchaseDate = new Date(assetToEdit.purchase_date);
      setDate(purchaseDate);
      setDateString(format(purchaseDate, "dd/MM/yyyy"));
      
      form.reset({
        symbol: assetToEdit.symbol,
        name: assetToEdit.name,
        asset_type: assetToEdit.asset_type,
        purchase_date: purchaseDate,
        purchase_price: assetToEdit.purchase_price.toString(),
        quantity: assetToEdit.quantity.toString(),
      });
    } else {
      form.reset({
        symbol: "",
        name: "",
        asset_type: "action",
        purchase_date: new Date(),
        purchase_price: "",
        quantity: "",
      });
      setDate(new Date());
      setDateString(format(new Date(), "dd/MM/yyyy"));
    }
  }, [assetToEdit, open, form]);

  const handleDateInput = (value: string) => {
    setDateString(value);
    
    if (value.length === 10) {
      try {
        const parsedDate = parse(value, "dd/MM/yyyy", new Date());
        if (isValid(parsedDate)) {
          setDate(parsedDate);
          form.setValue("purchase_date", parsedDate);
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
      form.setValue("purchase_date", selectedDate);
    }
  };

  const onSubmit = async (values: AssetFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const purchasePrice = parseFloat(values.purchase_price);
      const quantity = parseFloat(values.quantity);
      
      if (isNaN(purchasePrice) || purchasePrice <= 0) {
        throw new Error("Prix d'achat invalide");
      }
      
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error("Quantité invalide");
      }

      // Formatage de la date pour la base de données
      const formattedDate = format(values.purchase_date, "yyyy-MM-dd");

      if (isEditing && assetToEdit) {
        // Mise à jour d'un actif existant
        const { error } = await supabase
          .from("stock_assets")
          .update({
            symbol: values.symbol.toUpperCase(),
            name: values.name,
            asset_type: values.asset_type,
            purchase_date: formattedDate,
            purchase_price: purchasePrice,
            quantity: quantity
          })
          .eq("id", assetToEdit.id);

        if (error) throw error;
        toast.success("Actif mis à jour avec succès");
      } else {
        // Création d'un nouvel actif
        const { error } = await supabase
          .from("stock_assets")
          .insert({
            profile_id: user.id,
            symbol: values.symbol.toUpperCase(),
            name: values.name,
            asset_type: values.asset_type,
            purchase_date: formattedDate,
            purchase_price: purchasePrice,
            quantity: quantity
          });

        if (error) throw error;
        toast.success("Actif ajouté avec succès");
      }

      onOpenChange(false);
      onSuccess();
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier un actif" : "Ajouter un actif"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symbole / Ticker</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="ex: AAPL, BTC-EUR" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'actif</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="ex: Apple Inc., Bitcoin" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="asset_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'actif</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type d'actif" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assetTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem className="space-y-2">
              <FormLabel>Date d'achat</FormLabel>
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
            </FormItem>
            
            <FormField
              control={form.control}
              name="purchase_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix d'achat</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Prix unitaire" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantité</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number"
                      step="0.000001"
                      min="0"
                      placeholder="Nombre d'unités" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {isEditing ? "Mettre à jour" : "Ajouter"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
