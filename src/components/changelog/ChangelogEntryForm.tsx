
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  type: z.enum(["new", "improvement", "bugfix"], {
    required_error: "Veuillez sélectionner un type",
  }),
  date: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ChangelogEntryFormProps {
  initialData?: {
    id: string;
    title: string;
    description: string;
    type: "new" | "improvement" | "bugfix";
    date?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export function ChangelogEntryForm({
  initialData,
  onSuccess,
  onCancel,
}: ChangelogEntryFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      type: "new",
      date: new Date().toISOString(),
    },
  });

  async function onSubmit(values: FormData) {
    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from("changelog_entries")
          .update({
            title: values.title,
            description: values.description,
            type: values.type,
            date: values.date,
          })
          .eq("id", initialData.id);

        if (error) throw error;
        toast.success("Entrée mise à jour avec succès");
      } else {
        const { error } = await supabase
          .from("changelog_entries")
          .insert({
            title: values.title,
            description: values.description,
            type: values.type,
            date: values.date || new Date().toISOString(),
          });

        if (error) throw error;
        toast.success("Entrée ajoutée avec succès");
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting changelog entry:", error);
      toast.error("Une erreur est survenue");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="new">Nouveau</SelectItem>
                  <SelectItem value="improvement">Amélioration</SelectItem>
                  <SelectItem value="bugfix">Correction</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {initialData ? "Mettre à jour" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
