
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVehicleStats } from "@/hooks/useVehicleStats";
import { FuelConsumptionChart } from "./FuelConsumptionChart";
import { MileageProgressCard } from "./MileageProgressCard";
import { YearlyComparisonChart } from "./YearlyComparisonChart";
import { ExpenseDistributionChart } from "./ExpenseDistributionChart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChevronRight, BarChart, Activity, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface VehicleStatisticsTabProps {
  vehicleId: string;
}

export const VehicleStatisticsTab: React.FC<VehicleStatisticsTabProps> = ({ vehicleId }) => {
  const { 
    stats, 
    isLoading, 
    chartData, 
    mileageData, 
    expenseDistribution,
    yearlyComparison 
  } = useVehicleStats(vehicleId);
  
  const [activeChartTab, setActiveChartTab] = useState<string>("consommation");

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-full h-[300px] rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="w-full h-[200px] rounded-lg" />
          <Skeleton className="w-full h-[200px] rounded-lg" />
        </div>
      </div>
    );
  }

  if (!stats || !stats.hasFuelExpenses) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Info className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">Aucune donnée statistique</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Ajoutez des dépenses de carburant et d'entretien pour ce véhicule afin de visualiser des statistiques détaillées.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {stats.mileageLimit > 0 && (
        <MileageProgressCard 
          data={mileageData} 
          mileageLimit={stats.mileageLimit}
        />
      )}
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" /> 
              Analyses et tendances
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={activeChartTab} 
            onValueChange={setActiveChartTab}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 mb-4">
              <TabsTrigger value="consommation" className="text-xs md:text-sm">
                <Activity className="h-3.5 w-3.5 mr-1" /> Consommation
              </TabsTrigger>
              <TabsTrigger value="repartition" className="text-xs md:text-sm">
                <BarChart className="h-3.5 w-3.5 mr-1" /> Répartition
              </TabsTrigger>
              <TabsTrigger value="annuel" className="text-xs md:text-sm">
                <TrendingUp className="h-3.5 w-3.5 mr-1" /> Comparaison
              </TabsTrigger>
              <TabsTrigger value="tendances" className="text-xs md:text-sm">
                <ChevronRight className="h-3.5 w-3.5 mr-1" /> Tendances
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="consommation" className="pt-2">
              <FuelConsumptionChart data={chartData} />
            </TabsContent>
            
            <TabsContent value="repartition" className="pt-2">
              <ExpenseDistributionChart data={expenseDistribution} />
            </TabsContent>
            
            <TabsContent value="annuel" className="pt-2">
              <YearlyComparisonChart data={yearlyComparison} />
            </TabsContent>
            
            <TabsContent value="tendances" className="pt-2">
              <div className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">
                  Fonctionnalité à venir dans une prochaine mise à jour.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={cn(
          "bg-gradient-to-br from-background to-background/90",
          "border border-border/50 backdrop-blur-sm"
        )}>
          <CardHeader>
            <CardTitle className="text-base font-medium">Consommation moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Sur toute la période</span>
                <span className="text-2xl font-semibold tabular-nums">
                  {stats.averageFuelConsumption.toFixed(2)} L/100km
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Derniers 6 mois</span>
                <span className="text-xl font-medium tabular-nums">
                  {stats.recentAverageFuelConsumption.toFixed(2)} L/100km
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={cn(
          "bg-gradient-to-br from-background to-background/90",
          "border border-border/50 backdrop-blur-sm"
        )}>
          <CardHeader>
            <CardTitle className="text-base font-medium">Coût kilométrique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Carburant</span>
                <span className="text-2xl font-semibold tabular-nums">
                  {stats.costPerKm.fuel.toFixed(2)} €/km
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total (tout compris)</span>
                <span className="text-xl font-medium tabular-nums">
                  {stats.costPerKm.total.toFixed(2)} €/km
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
