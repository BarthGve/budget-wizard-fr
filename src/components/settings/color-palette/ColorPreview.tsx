
import { useTheme } from "next-themes";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ColorPreviewProps {
  colorNames: { [key: string]: string };
  currentMode: "light" | "dark";
}

export const ColorPreview = ({
  colorNames,
  currentMode
}: ColorPreviewProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // Si le mode actuel ne correspond pas au thème, ajoutez une classe pour inverser les couleurs
  const isInverse = (currentMode === "light" && isDarkMode) ||
                    (currentMode === "dark" && !isDarkMode);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">
        Aperçu des couleurs - Mode {currentMode === "light" ? "clair" : "sombre"}
      </h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Object.entries(colorNames).map(([key, name]) => (
          <Card 
            key={key} 
            className={cn(
              "p-4 flex flex-col items-center justify-center h-24",
              isInverse && "opacity-50"
            )}
            style={{
              backgroundColor: `hsl(var(--${key}-500))`,
              color: `hsl(var(--${key}-foreground))`,
              border: `1px solid hsl(var(--${key}-600))`,
            }}
          >
            <span className="font-medium text-sm">{name}</span>
            <span className="text-xs mt-1">{key}</span>
          </Card>
        ))}
      </div>
    </div>
  );
};
