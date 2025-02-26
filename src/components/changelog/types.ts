
import { z } from "zod";

export const changelogFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  version: z.string().min(1, "Le numéro de version est requis")
    .regex(/^\d+\.\d+\.\d+$/, "Le format doit être x.y.z (ex: 1.0.0)"),
  description: z.string().min(1, "La description est requise"),
  type: z.enum(["new", "improvement", "bugfix"], {
    required_error: "Veuillez sélectionner un type",
  }),
  date: z.date({
    required_error: "Veuillez sélectionner une date",
  }),
});

export type FormData = z.infer<typeof changelogFormSchema>;

export interface ChangelogEntry {
  id: string;
  title: string;
  version: string;
  description: string;
  type: "new" | "improvement" | "bugfix";
  date: string;
}
