
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NewProperty } from "@/types/property";

interface PropertyFormProps {
  newProperty: NewProperty;
  onChange: (property: NewProperty) => void;
}

export const PropertyForm = ({ newProperty, onChange }: PropertyFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nom du bien*</Label>
        <Input
          id="name"
          value={newProperty.name}
          onChange={(e) => onChange({ ...newProperty, name: e.target.value })}
          placeholder="Ex: Appartement Paris"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Adresse*</Label>
        <Input
          id="address"
          value={newProperty.address}
          onChange={(e) => onChange({ ...newProperty, address: e.target.value })}
          placeholder="15 rue de la Paix, 75002 Paris"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="investment_type">Type d'investissement</Label>
        <Input
          id="investment_type"
          value={newProperty.investment_type}
          onChange={(e) => onChange({ ...newProperty, investment_type: e.target.value })}
          placeholder="Ex: Pinel, LMNP, Ancien"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="area">Surface (m²)*</Label>
        <Input
          id="area"
          type="number"
          value={newProperty.area}
          onChange={(e) => onChange({ ...newProperty, area: e.target.value })}
          placeholder="Ex: 75"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="purchase_value">Valeur d'achat (€)*</Label>
        <Input
          id="purchase_value"
          type="number"
          value={newProperty.purchase_value}
          onChange={(e) => onChange({ ...newProperty, purchase_value: e.target.value })}
          placeholder="Ex: 350000"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="monthly_rent">Loyer mensuel (€)</Label>
        <Input
          id="monthly_rent"
          type="number"
          value={newProperty.monthly_rent}
          onChange={(e) => onChange({ ...newProperty, monthly_rent: e.target.value })}
          placeholder="Ex: 1200"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="loan_payment">Mensualité du prêt (€)</Label>
        <Input
          id="loan_payment"
          type="number"
          value={newProperty.loan_payment}
          onChange={(e) => onChange({ ...newProperty, loan_payment: e.target.value })}
          placeholder="Ex: 1500"
        />
      </div>
    </div>
  );
};

