
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Upload, Mail, AlertTriangle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from "@/types/profile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const ProfileSettings = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const queryClient = useQueryClient();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: profile } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
  });

  // Utiliser le nom du profil directement depuis l'objet profile
  const [fullName, setFullName] = useState(profile?.full_name || "");

  // Mettre à jour fullName quand profile change
  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 2MB");
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error("Le fichier doit être une image");
        return;
      }

      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      let avatarUrl = profile?.avatar_url;
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        if (profile?.avatar_url) {
          const oldFilePath = profile.avatar_url.split('/').slice(-2).join('/');
          await supabase.storage
            .from('avatars')
            .remove([oldFilePath]);
        }

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error("Erreur lors de l'upload de l'avatar");
        }

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        avatarUrl = publicUrl;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profil mis à jour avec succès");
      
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setAvatarFile(null);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setIsUpdating(false);
    }
  };

  // Schéma de validation pour le formulaire de changement d'email
  const emailFormSchema = z.object({
    email: z.string().email("Adresse email invalide"),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  });

  type EmailFormValues = z.infer<typeof emailFormSchema>;

  // Formulaire de changement d'email
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Fonction pour mettre à jour l'email
  const handleUpdateEmail = async (values: EmailFormValues) => {
    setIsUpdatingEmail(true);
    
    try {
      // Vérifier le mot de passe avant de procéder
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profile?.email || "",
        password: values.password,
      });

      if (signInError) {
        throw new Error("Mot de passe incorrect");
      }

      // Mettre à jour l'email
      const { error } = await supabase.auth.updateUser({
        email: values.email,
      });

      if (error) throw error;

      // Réinitialiser le formulaire et fermer la modal
      emailForm.reset();
      setShowEmailDialog(false);
      
      toast.success(
        "Un email de vérification a été envoyé à votre nouvelle adresse. Veuillez vérifier votre boîte mail pour confirmer le changement."
      );
      
    } catch (error: any) {
      console.error("Error updating email:", error);
      toast.error(error.message || "Erreur lors de la mise à jour de l'email");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <CardTitle>Profil</CardTitle>
        </div>
        <CardDescription>Gérez vos informations personnelles</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={previewUrl || profile?.avatar_url || undefined}
                alt={profile?.full_name || "Avatar"}
              />
              <AvatarFallback>
                {(profile?.full_name || "?")[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="avatar-upload"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("avatar-upload")?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Changer l'avatar
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="email"
                  value={profile?.email || ""}
                  disabled
                  className="flex-1 bg-muted"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowEmailDialog(true)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground hover:bg-primary-hover"
              disabled={isUpdating}
            >
              {isUpdating ? "Mise à jour..." : "Mettre à jour le profil"}
            </Button>
          </div>
        </form>

        {/* Modal pour modifier l'email */}
        <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifier votre adresse email</DialogTitle>
              <DialogDescription>
                Entrez votre nouvelle adresse email et votre mot de passe actuel pour confirmer.
              </DialogDescription>
            </DialogHeader>
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(handleUpdateEmail)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nouvelle adresse email</FormLabel>
                      <FormControl>
                        <Input placeholder="nouvelle@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={emailForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe actuel</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Votre mot de passe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium">Important</p>
                      <p>
                        Un email de vérification sera envoyé à votre nouvelle adresse. 
                        Le changement ne sera effectif qu'après confirmation en cliquant sur le lien dans cet email.
                      </p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowEmailDialog(false)}
                    disabled={isUpdatingEmail}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isUpdatingEmail}>
                    {isUpdatingEmail ? "Modification..." : "Modifier"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
