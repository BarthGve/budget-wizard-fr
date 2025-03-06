
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface EmailChangeAlertProps {
  userData: User | undefined;
  onResendClick: () => void;
}

export const EmailChangeAlert = ({ userData, onResendClick }: EmailChangeAlertProps) => {
  if (!userData?.new_email) return null;
  
  return (
    <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-medium">Changement d'email en cours</p>
          <p>
            Une demande de changement vers {userData.new_email} est en attente de confirmation.
            Vérifiez votre boîte mail et cliquez sur le lien pour confirmer le changement.
          </p>
          <Button 
            type="button" 
            variant="link" 
            className="p-0 h-auto text-amber-800 underline" 
            onClick={onResendClick}
          >
            Renvoyer l'email de vérification
          </Button>
        </div>
      </div>
    </div>
  );
};
