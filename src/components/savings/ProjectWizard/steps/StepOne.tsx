
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SavingsProject } from "@/types/savings-project";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StepOneProps {
  data: Partial<SavingsProject>;
  onChange: (data: Partial<SavingsProject>) => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB en bytes
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const StepOne = ({ data, onChange }: StepOneProps) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      
      // Vérification du type de fichier
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error("Format de fichier non autorisé. Utilisez JPG, PNG, GIF ou WEBP.");
        return;
      }
      
      // Vérification de la taille
      if (file.size > MAX_FILE_SIZE) {
        toast.error("L'image ne doit pas dépasser 2 Mo");
        return;
      }

      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('savings_projects')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('savings_projects')
        .getPublicUrl(filePath);

      onChange({ ...data, image_url: publicUrl });
      toast.success("Image téléchargée avec succès");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Erreur lors du téléchargement de l'image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="space-y-2">
        <Label htmlFor="project-name">Nom du projet *</Label>
        <Input
          id="project-name"
          value={data.nom_projet}
          onChange={(e) => onChange({ ...data, nom_projet: e.target.value })}
          placeholder="Ex: Achat immobilier, Voyage..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-description">Description</Label>
        <Textarea
          id="project-description"
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Décrivez votre projet..."
        />
      </div>

      <div className="space-y-2">
        <Label>Image d'illustration</Label>
        <div className="flex items-center gap-4">
          <img
            src={data.image_url || "/placeholder.svg"}
            alt={data.nom_projet || 'Image du projet'}
            className="w-32 h-32 object-cover rounded-lg bg-accent"
          />
          <Button variant="outline" size="sm" className="w-32">
            <label className="cursor-pointer flex items-center gap-2">
              <ImagePlus className="h-4 w-4" />
              {uploading ? 'Envoi...' : 'Choisir'}
              <input
                type="file"
                className="hidden"
                accept={ALLOWED_FILE_TYPES.join(',')}
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Formats acceptés : JPG, PNG, GIF, WEBP. Taille maximale : 2 Mo
        </p>
      </div>
    </div>
  );
};
