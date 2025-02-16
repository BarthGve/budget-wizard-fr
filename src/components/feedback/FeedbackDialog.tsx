import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
export const FeedbackDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !rating) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setIsSubmitting(true);
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");
      const {
        error
      } = await supabase.from("feedbacks").insert({
        title: title.trim(),
        content: content.trim(),
        rating,
        profile_id: user.id,
        status: "pending"
      });
      if (error) throw error;
      toast.success("Merci pour votre feedback !");
      setIsOpen(false);
      setTitle("");
      setContent("");
      setRating(null);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Une erreur est survenue lors de l'envoi du feedback");
    } finally {
      setIsSubmitting(false);
    }
  };
  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <MessageSquare className="mr-2 h-4 w-4" />
          <span className="font-normal text-base">Feedback</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Donnez-nous votre avis</DialogTitle>
          <DialogDescription>
            Votre feedback nous aide à améliorer l'application
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Titre</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Résumez votre feedback" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Description</Label>
            <Textarea id="content" value={content} onChange={e => setContent(e.target.value)} placeholder="Décrivez votre expérience ou suggestion" />
          </div>
          <div className="grid gap-2">
            <Label>Note</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(value => <Button key={value} variant={rating === value ? "default" : "outline"} size="sm" onClick={() => setRating(value)}>
                  {value}
                </Button>)}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Envoi..." : "Envoyer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>;
};