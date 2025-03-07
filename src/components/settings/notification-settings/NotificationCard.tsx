
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { ReactNode } from "react";

interface NotificationCardProps {
  children: ReactNode;
}

export const NotificationCard = ({ children }: NotificationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <CardTitle>Notifications</CardTitle>
        </div>
        <CardDescription>Configurez vos préférences de notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
};
