
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LogoPreview } from "./LogoPreview";
import { useLogoPreview } from "./hooks/useLogoPreview";

interface SavingFormProps {
  name: string;
  onNameChange: (value: string) => void;
  domain: string;
  onDomainChange: (value: string) => void;
  amount: number;
  onAmountChange: (value: number) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
}

export const SavingForm = ({
  name,
  onNameChange,
  domain,
  onDomainChange,
  amount,
  onAmountChange,
  description,
  onDescriptionChange,
}: SavingFormProps) => {
  const { previewLogoUrl, isLogoValid, isCheckingLogo } = useLogoPreview(domain);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="saving-name">Nom du versement</Label>
        <Input
          id="saving-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Ex: Assurance Vie, PEL..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="domain">Domaine de l'organisme (optionnel)</Label>
        <div className="flex items-center gap-4">
          <Input
            id="domain"
            value={domain}
            onChange={(e) => onDomainChange(e.target.value)}
            placeholder="Ex: boursorama.com, fortuneo.fr..."
          />
          <LogoPreview
            url={previewLogoUrl}
            isValid={isLogoValid}
            isChecking={isCheckingLogo}
            domain={domain}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Le logo sera automatiquement récupéré à partir du domaine
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="saving-amount">Montant mensuel (€)</Label>
        <Input
          id="saving-amount"
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(Number(e.target.value))}
          placeholder="Ex: 200"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="saving-description">Description (optionnel)</Label>
        <Textarea
          id="saving-description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Ex: Versement automatique le 5 du mois..."
        />
      </div>
    </div>
  );
};
