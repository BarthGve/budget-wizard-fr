
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toast]:border-green-500/30 group-[.toast]:dark:border-green-500/30 group-[.toast]:bg-green-500/10",
          error: "group-[.toast]:border-destructive group-[.toast]:text-destructive-foreground group-[.toast]:dark:border-red-500/50 group-[.toast]:bg-destructive/10"
        },
        duration: 3500, // Durée plus longue pour mieux voir les notifications
      }}
      {...props}
    />
  )
}

export { Toaster }
