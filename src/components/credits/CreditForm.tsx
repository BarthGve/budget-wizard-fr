
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useCreditForm } from "./hooks/useCreditForm";
import { NameField } from "./form-fields/NameField";
import { DomainField } from "./form-fields/DomainField";
import { AmountField } from "./form-fields/AmountField";
import { FirstPaymentDateField } from "./form-fields/FirstPaymentDateField";
import { MonthsCountField } from "./form-fields/MonthsCountField";
import { Credit } from "./types";

interface CreditFormProps {
  credit?: Credit;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreditForm({
  credit,
  onSuccess,
  onCancel,
}: CreditFormProps) {
  const { form, onSubmit } = useCreditForm({
    credit,
    onSuccess
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <NameField form={form} />
        <DomainField form={form} />
        <AmountField form={form} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FirstPaymentDateField form={form} />
          <MonthsCountField form={form} />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" className="bg-violet-600 hover:bg-violet-500 rounded-lg px-[16px] py-0 my-0 text-white">
            {credit ? "Mettre à jour" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
