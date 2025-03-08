
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

interface ContributionFormProps {
  type: string;
  setType: (type: string) => void;
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
}

export const ContributionForm = ({ 
  type, 
  setType, 
  title, 
  setTitle, 
  content, 
  setContent 
}: ContributionFormProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="px-6 py-6"
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="type" className="text-sm font-medium">Type de contribution</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="type" className="w-full border-primary/20 focus:border-primary focus:ring-primary/20">
              <SelectValue placeholder="Sélectionnez un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="suggestion">Suggestion</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="feature">Fonctionnalité</SelectItem>
              <SelectItem value="improvement">Amélioration</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">Titre</Label>
          <Input
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Résumez votre idée en quelques mots"
            className="w-full border-primary/20 focus:border-primary focus:ring-primary/20"
            autoFocus
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content" className="text-sm font-medium">Détails</Label>
          <Textarea
            id="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Décrivez en détail votre suggestion, idée ou le problème rencontré..."
            className="min-h-[150px] border-primary/20 focus:border-primary focus:ring-primary/20"
          />
        </div>
      </div>
    </motion.div>
  );
};
