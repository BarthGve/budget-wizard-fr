
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          // Amélioration de la visibilité des toasts d'erreur
          error: "group-[.toast]:border-destructive group-[.toast]:text-destructive-foreground group-[.toast]:dark:border-red-500/50 group-[.toast]:bg-destructive/10"
        },
        duration: 2500, // Durée standard de 5 secondes pour la plupart des toasts
      }}
      {...props}
    />
  )
}

export { Toaster }
