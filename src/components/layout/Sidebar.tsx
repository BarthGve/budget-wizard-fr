import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { cn } from "@/lib/utils"
import { CalendarIcon, Check, ChevronsUpDown, Contact2, FileText, Home, LayoutDashboard, ListChecks, LucideIcon, Menu, MessageSquare, Plus, Settings, User2, Users } from "lucide-react"
import { useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { FeedbackDialog } from "../feedback/FeedbackDialog"
import { useIsMobile } from "@/hooks/use-mobile"
import { useTheme } from "next-themes"
import { supabase } from "@/integrations/supabase/client"

interface CollapsibleSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const sidebarItems = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Accueil",
  },
  {
    href: "/contributors",
    icon: Users,
    label: "Contributeurs",
  },
  {
    href: "/savings",
    icon: Plus,
    label: "Épargnes",
  },
  {
    href: "/properties",
    icon: LayoutDashboard,
    label: "Immeubles",
  },
  {
    href: "/recurring-expenses",
    icon: ListChecks,
    label: "Dépenses récurrentes",
  },
   {
    href: "/expenses",
    icon: FileText,
    label: "Dépenses",
  },
  {
    href: "/credits",
    icon: Contact2,
    label: "Crédits",
  },
  {
    href: "/stocks",
    icon: MessageSquare,
    label: "Bourse",
  },
]

// Mise à jour du FeedbackDialog pour utiliser les bonnes props
export const Sidebar = ({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useIsMobile()
  const { theme, setTheme } = useTheme()
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const { currentUser, isLoading } = useCurrentUser()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: "Erreur lors de la déconnexion",
        description: "Veuillez réessayer.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Déconnexion réussie!",
      })
      navigate("/login")
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-64">
      <div className="flex items-center justify-between p-4">
        <span className="font-bold text-xl">Budget App</span>
        {isMobile && (
          <Button variant="outline" size="icon" onClick={onToggle}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 space-y-4 p-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm leading-none">Tableau de bord</h4>
          <p className="text-sm text-muted-foreground">
            Suivez vos finances personnelles.
          </p>
        </div>
        <Separator />
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "group flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
                  isActive
                    ? "bg-gray-200 dark:bg-gray-700 text-foreground"
                    : "text-muted-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
        <Separator />
        <div className="space-y-1">
          <NavLink
            to="/user-settings"
            className={({ isActive }) =>
              cn(
                "group flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
                isActive
                  ? "bg-gray-200 dark:bg-gray-700 text-foreground"
                  : "text-muted-foreground"
              )
            }
          >
            <Settings className="h-4 w-4" />
            <span>Paramètres</span>
          </NavLink>
        </div>
      </ScrollArea>

      <Separator />

      <div className="p-4">
        <Button variant="outline" className="w-full mb-2" onClick={() => setFeedbackOpen(true)}>
          Feedback
        </Button>
        <FeedbackDialog
          open={feedbackOpen}
          onOpenChange={setFeedbackOpen}
        />
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          Se déconnecter
        </Button>
      </div>
    </div>
  )
}
