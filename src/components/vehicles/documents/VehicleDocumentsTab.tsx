
import { useEffect, useState } from 'react';
import { useVehicleDocuments } from '@/hooks/useVehicleDocuments';
import { AddDocumentDialog } from './AddDocumentDialog';
import { VehicleDocumentsGrid } from './VehicleDocumentsGrid';
import { DocumentCard } from './DocumentCard';
import { VehicleDocument } from '@/types/vehicle-documents';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusIcon, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';

interface VehicleDocumentsTabProps {
  vehicleId: string;
}

// Onglets disponibles
type ViewMode = 'grid' | 'list';
type CategoryFilter = string | 'all';

export const VehicleDocumentsTab = ({ vehicleId }: VehicleDocumentsTabProps) => {
  const { documents, categories, isLoadingDocuments, refetchDocuments } = useVehicleDocuments(vehicleId);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [filteredDocuments, setFilteredDocuments] = useState<VehicleDocument[]>([]);
  const isMobile = useIsMobile();

  // Effet pour filtrer les documents en fonction de la catégorie sélectionnée
  useEffect(() => {
    if (!documents) {
      setFilteredDocuments([]);
      return;
    }

    if (categoryFilter === 'all') {
      setFilteredDocuments(documents);
    } else {
      setFilteredDocuments(documents.filter(doc => doc.category_id === categoryFilter));
    }
  }, [documents, categoryFilter]);

  // Fonction pour rafraîchir les documents
  const handleDocumentAdded = () => {
    refetchDocuments();
  };

  // Fonction pour gérer la suppression d'un document
  const handleDocumentDeleted = () => {
    refetchDocuments();
  };

  // Construction du menu catégories
  const renderCategoryMenu = () => {
    return (
      <div className="flex items-center">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filtres
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="pb-0">
              <div className="px-1 py-2">
                <h3 className="font-medium text-sm mb-3">Catégories</h3>
                <div className="flex flex-col space-y-2">
                  <Button
                    variant={categoryFilter === 'all' ? "default" : "outline"}
                    size="sm"
                    className="justify-start"
                    onClick={() => setCategoryFilter('all')}
                  >
                    Toutes les catégories
                  </Button>
                  
                  {categories?.map(category => (
                    <Button
                      key={category.id}
                      variant={categoryFilter === category.id ? "default" : "outline"}
                      size="sm"
                      className="justify-start"
                      onClick={() => setCategoryFilter(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filtrer par catégorie
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                onClick={() => setCategoryFilter('all')}
                className={cn("cursor-pointer", categoryFilter === 'all' ? "bg-muted" : "")}
              >
                Toutes les catégories
              </DropdownMenuItem>
              
              {categories?.map(category => (
                <DropdownMenuItem 
                  key={category.id}
                  onClick={() => setCategoryFilter(category.id)}
                  className={cn("cursor-pointer", categoryFilter === category.id ? "bg-muted" : "")}
                >
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  };

  // Si l'écran est mobile, afficher l'interface mobile
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Documents</h2>
          <AddDocumentDialog vehicleId={vehicleId} onDocumentAdded={handleDocumentAdded} />
        </div>
        
        <div className="flex justify-between items-center">
          {renderCategoryMenu()}
          
          <div className="flex items-center space-x-1 border rounded-md">
            <Button 
              variant={viewMode === 'grid' ? "default" : "ghost"} 
              size="sm" 
              className="h-8 px-2"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? "default" : "ghost"} 
              size="sm" 
              className="h-8 px-2"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {isLoadingDocuments ? (
          <div className="flex justify-center py-12">
            <p>Chargement des documents...</p>
          </div>
        ) : (
          <>
            {filteredDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Aucun document trouvé pour cette catégorie.
                </p>
                <AddDocumentDialog vehicleId={vehicleId} onDocumentAdded={handleDocumentAdded} />
              </div>
            ) : (
              <div className={cn(
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 gap-4" 
                  : "flex flex-col space-y-3"
              )}>
                {filteredDocuments.map(document => (
                  <DocumentCard 
                    key={document.id} 
                    document={document} 
                    vehicleId={vehicleId}
                    onDeleted={handleDocumentDeleted}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // Interface pour les écrans larges
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Documents du véhicule</h2>
        
        <div className="flex items-center gap-3">
          {renderCategoryMenu()}
          
          <div className="flex items-center space-x-1 border rounded-md">
            <Button 
              variant={viewMode === 'grid' ? "default" : "ghost"} 
              size="sm" 
              className="h-8 px-2.5"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? "default" : "ghost"} 
              size="sm" 
              className="h-8 px-2.5"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <AddDocumentDialog vehicleId={vehicleId} onDocumentAdded={handleDocumentAdded} />
        </div>
      </div>
      
      {isLoadingDocuments ? (
        <div className="flex justify-center py-16">
          <p>Chargement des documents...</p>
        </div>
      ) : (
        <>
          {filteredDocuments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                Aucun document trouvé pour cette catégorie.
              </p>
              <AddDocumentDialog vehicleId={vehicleId} onDocumentAdded={handleDocumentAdded} />
            </div>
          ) : (
            <div className={cn(
              viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
                : "flex flex-col space-y-3"
            )}>
              {filteredDocuments.map(document => (
                <DocumentCard 
                  key={document.id} 
                  document={document} 
                  vehicleId={vehicleId}
                  onDeleted={handleDocumentDeleted}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
