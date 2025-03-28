
import { SavingsProject } from "@/types/savings-project";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { SavingsMode } from "./StepThree";

interface StepFiveProps {
  data: Partial<SavingsProject>;
  savingsMode: SavingsMode;
}

export const StepFive = ({ data, savingsMode }: StepFiveProps) => {
  return (
    <div className="space-y-4">
      <div className="p-5 rounded-xl bg-purple-50/70 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/20">
        <h3 className="text-lg font-medium text-purple-900 dark:text-purple-200 mb-4">
          Récapitulatif du projet
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between border-b border-purple-100/70 dark:border-purple-800/30 pb-2">
            <span className="text-sm text-purple-700 dark:text-purple-300">Nom du projet</span>
            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
              {data.nom_projet || "-"}
            </span>
          </div>
          
          <div className="flex justify-between border-b border-purple-100/70 dark:border-purple-800/30 pb-2">
            <span className="text-sm text-purple-700 dark:text-purple-300">Objectif</span>
            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
              {data.montant_total?.toLocaleString('fr-FR')} €
            </span>
          </div>

          <div className="flex justify-between border-b border-purple-100/70 dark:border-purple-800/30 pb-2">
            <span className="text-sm text-purple-700 dark:text-purple-300">Mode de planification</span>
            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
              {savingsMode === "par_date" ? "Par date" : "Par mensualité"}
            </span>
          </div>
          
          {savingsMode === "par_date" && data.target_date && (
            <div className="flex justify-between border-b border-purple-100/70 dark:border-purple-800/30 pb-2">
              <span className="text-sm text-purple-700 dark:text-purple-300">Date cible</span>
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                {format(new Date(data.target_date), 'P', { locale: fr })}
              </span>
            </div>
          )}
          
          {data.montant_mensuel && (
            <div className="flex justify-between border-b border-purple-100/70 dark:border-purple-800/30 pb-2">
              <span className="text-sm text-purple-700 dark:text-purple-300">Montant mensuel</span>
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                {data.montant_mensuel.toLocaleString('fr-FR')} €
              </span>
            </div>
          )}
          
          {data.nombre_mois && (
            <div className="flex justify-between border-b border-purple-100/70 dark:border-purple-800/30 pb-2">
              <span className="text-sm text-purple-700 dark:text-purple-300">Durée</span>
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                {data.nombre_mois} mois
              </span>
            </div>
          )}
          
          {savingsMode === "par_mensualite" && data.date_estimee && (
            <div className="flex justify-between border-b border-purple-100/70 dark:border-purple-800/30 pb-2">
              <span className="text-sm text-purple-700 dark:text-purple-300">Date estimée</span>
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                {format(new Date(data.date_estimee), 'MMMM yyyy', { locale: fr })}
              </span>
            </div>
          )}
          
          {data.description && (
            <div className="flex justify-between pt-1">
              <span className="text-sm text-purple-700 dark:text-purple-300">Description</span>
              <span className="text-sm font-medium text-purple-900 dark:text-purple-100 text-right max-w-[70%]">
                {data.description}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
