
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

export const StepOne = ({ data, onChange }: StepOneProps) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      setUploading(true);

      const file = event.target.files[0];
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="project-name">Nom du projet</Label>
        <Input
          id="project-name"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="Ex: Achat immobilier, Voyage..."
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
            alt={data.name || 'Project image'}
            className="w-32 h-32 object-cover rounded-lg bg-accent"
          />
          <Button variant="outline" size="sm" className="w-32">
            <label className="cursor-pointer flex items-center gap-2">
              <ImagePlus className="h-4 w-4" />
              {uploading ? 'Envoi...' : 'Choisir'}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          </Button>
        </div>
      </div>
    </div>
  );
};
