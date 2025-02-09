
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Bell,
  CreditCard,
  Lock,
  Mail,
  Shield,
  User,
  Wallet,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez vos préférences et paramètres de compte
          </p>
        </div>

        {/* Profil */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <CardTitle>Profil</CardTitle>
            </div>
            <CardDescription>
              Gérez vos informations personnelles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Parlez-nous un peu de vous..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <CardTitle>Sécurité</CardTitle>
            </div>
            <CardDescription>
              Gérez vos paramètres de sécurité et mot de passe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mot de passe actuel</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configurez vos préférences de notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications par email</Label>
                <p className="text-sm text-muted-foreground">
                  Recevez des mises à jour sur votre budget par email
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertes de dépassement</Label>
                <p className="text-sm text-muted-foreground">
                  Soyez alerté quand vous dépassez votre budget
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Préférences de paiement */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <CardTitle>Préférences de paiement</CardTitle>
            </div>
            <CardDescription>
              Gérez vos méthodes de paiement et préférences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Devise par défaut</Label>
              <div className="flex items-center space-x-2">
                <Input value="EUR" readOnly className="w-24" />
                <span className="text-sm text-muted-foreground">
                  La devise ne peut pas être modifiée pour le moment
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications de paiement</Label>
                <p className="text-sm text-muted-foreground">
                  Recevez des alertes pour les paiements programmés
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Confidentialité */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Confidentialité</CardTitle>
            </div>
            <CardDescription>
              Gérez vos paramètres de confidentialité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Profil public</Label>
                <p className="text-sm text-muted-foreground">
                  Permettre aux autres utilisateurs de voir votre profil
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Partage des statistiques</Label>
                <p className="text-sm text-muted-foreground">
                  Partager vos statistiques de budget avec les contributeurs
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
