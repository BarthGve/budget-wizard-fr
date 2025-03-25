
import { Credit } from "../types";
import { cn } from "@/lib/utils";

interface CreditCardInfoProps {
  credit: Credit;
  index: number;
  isMobile?: boolean;
}

export const CreditCardInfo = ({ credit, index, isMobile = false }: CreditCardInfoProps) => {
  return (
    <div 
      className={cn(
        "flex items-center cursor-pointer rounded-md",
        !isMobile && "gap-4 md:w-1/3 p-2 transition-colors",
        !isMobile && "hover:bg-purple-50/70 dark:hover:bg-purple-900/20"
      )}
    >
      {credit.logo_url ? (
        <div className={cn(
          "rounded-lg flex items-center justify-center overflow-hidden",
          isMobile ? "w-8 h-8" : "w-10 h-10",
          // Light mode
          "bg-white border border-purple-100 shadow-sm",
          // Dark mode
          "dark:bg-gray-800 dark:border-purple-800/40"
        )}>
          <img
            src={credit.logo_url}
            alt={credit.nom_credit}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
      ) : (
        <div className={cn(
          "rounded-lg flex items-center justify-center",
          isMobile ? "w-8 h-8" : "w-10 h-10",
          // Light mode
          "bg-purple-100 text-purple-600",
          // Dark mode
          "dark:bg-purple-900/30 dark:text-purple-400"
        )}>
          <svg xmlns="http://www.w3.org/2000/svg" className={isMobile ? "h-4 w-4" : "h-5 w-5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        </div>
      )}
  
      <h4 className={cn(
        "font-medium",
        isMobile ? "text-sm ml-2" : "text-base",
        // Light mode
        "text-gray-800",
        // Dark mode
        "dark:text-gray-200"
      )}>
        {isMobile 
          ? (credit.nom_credit.length > 15 
              ? credit.nom_credit.substring(0, 15) + "..." 
              : credit.nom_credit)
          : credit.nom_credit}
      </h4>
    </div>
  );
};
