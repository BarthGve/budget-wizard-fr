import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useVehicleDocuments } from "@/hooks/useVehicleDocuments";
import { PlusIcon, UploadIcon, XIcon } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface AddDocumentDialogProps {
  vehicleId: string;
}

const documentFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  category_id: z.string().min(1, "La catégorie est requise"),
  file: z.instanceof(File, { message: "Un fichier est requis" }),
});

type DocumentFormValues = z.infer<typeof documentFormSchema>;

export const AddDocumentDialog = ({ vehicleId }: AddDocumentDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { categories, addDocument, isAdding } = useVehicleDocuments(vehicleId);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category_id: "",
    },
  });
  
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const onSubmit = async (data: DocumentFormValues) => {
    console.log("Soumission du formulaire:", data);
    
    try {
      await addDocument({
        file: data.file,
        document: {
          vehicle_id: vehicleId,
          category_id: data.category_id,
          name: data.name,
          description: data.description,
        }
      });
      
      console.log("Document ajouté avec succès");
      
      // Réinitialiser le formulaire
      form.reset();
      setSelectedFileName(null);
      setIsOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du document:", error);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      handleSelectedFile(file);
    }
  };
  
  const handleSelectedFile = (file: File) => {
    console.log("Fichier sélectionné:", file);
    form.setValue("file", file);
    setSelectedFileName(file.name);
    
    // Auto-remplir le nom du document s'il est vide
    if (!form.getValues().name) {
      // Enlever l'extension du fichier pour le nom
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      form.setValue("name", fileName);
    }
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleSelectedFile(files[0]);
    }
  };
  
  const colors = {
    gradientFrom: "from-gray-500",
    gradientTo: "to-gray-400",
    darkGradientFrom: "dark:from-gray-600",
    darkGradientTo: "dark:to-gray-500",
    iconBg: "bg-gray-100 text-gray-700 dark:bg-gray-800/80 dark:text-gray-300",
    headingText: "text-gray-800 dark:text-gray-200",
    descriptionText: "text-gray-600/90 dark:text-gray-300/80",
    buttonBg: "bg-gray-600 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600",
    lightBg: "from-white via-gray-50/40 to-gray-100/70",
    darkBg: "dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-800/80",
    borderLight: "border-gray-100/70",
    borderDark: "dark:border-gray-800/20",
    separator: "via-gray-200/60 dark:via-gray-700/30"
  };

  const DialogFormContent = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Fichier</FormLabel>
              <FormControl>
                <div 
                  className={cn(
                    "flex flex-col items-center justify-center border-2 border-dashed rounded-lg py-6 px-4 cursor-pointer transition-colors",
                    isDragOver 
                      ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-600" 
                      : "border-gray-300 dark:border-gray-700",
                    selectedFileName ? "bg-gray-50 dark:bg-gray-800/50" : ""
                  )}
                  onClick={() => {
                    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                    if (fileInput) fileInput.click();
                  }}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {!selectedFileName ? (
                    <>
                      <UploadIcon className={cn(
                        "h-10 w-10 mb-2",
                        isDragOver ? "text-blue-500 dark:text-blue-400" : "text-gray-400"
                      )} />
                      <div className={cn(
                        "text-sm text-center",
                        isDragOver ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                      )}>
                        Cliquez pour sélectionner un fichier<br />
                        ou déposez-le ici
                      </div>
                      <Input
                        {...fieldProps}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                      />
                    </>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                        {selectedFileName}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation(); // Empêcher le clic de remonter à l'élément parent
                          form.setValue("file", undefined as any);
                          setSelectedFileName(null);
                        }}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Formats acceptés: PDF, DOC, DOCX, JPG, PNG, TXT
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Nom du document" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optionnel)</FormLabel>
              <FormControl>
                <Textarea placeholder="Description du document" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isAdding}
          >
            {isAdding ? "Ajout en cours..." : "Ajouter"}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button className="flex items-center gap-1.5">
            <PlusIcon className="h-4 w-4" />
            Ajouter un document
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="bottom"
          className={cn(
            "px-0 py-0 rounded-t-xl",
            "border-t shadow-lg",
            colors.borderLight,
            colors.borderDark,
            "max-h-[90vh] overflow-y-auto",
            "dark:bg-gray-900"
          )}
        >
          <div className={cn(
            "absolute inset-x-0 top-0 h-1.5 w-12 mx-auto my-2",
            "bg-gray-300 dark:bg-gray-600 rounded-full"
          )} />

          <div 
            className={cn(
              "relative flex flex-col pb-6 pt-5",
              "bg-gradient-to-br",
              colors.lightBg,
              colors.darkBg
            )}
          >
            {/* Background gradient */}
            <div className={cn(
              "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br rounded-t-lg",
              colors.gradientFrom,
              colors.gradientTo,
              colors.darkGradientFrom,
              colors.darkGradientTo
            )} />

            {/* Radial gradient */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.015] dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.01] rounded-t-lg" />
            
            {/* Dialog header */}
            <DialogHeader className="relative z-10 mb-4 px-6">
              <div className="flex items-center gap-3">
                <div className={cn("p-2.5 rounded-lg", colors.iconBg)}>
                  <UploadIcon className="w-5 h-5" />
                </div>
                <DialogTitle className={cn("text-2xl font-bold", colors.headingText)}>
                  Ajouter un document
                </DialogTitle>
              </div>
              <div className="ml-[52px] mt-2">
                <p className={cn("text-base", colors.descriptionText)}>
                  Ajoutez un document à votre véhicule
                </p>
              </div>
            </DialogHeader>
            
            {/* Ligne séparatrice stylée */}
            <div className={cn(
              "h-px w-full mb-6",
              "bg-gradient-to-r from-transparent to-transparent",
              colors.separator
            )} />
            
            {/* Section du formulaire */}
            <div className="relative z-10 px-6">
              <DialogFormContent />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Ajouter un document
        </Button>
      </DialogTrigger>
      <DialogContent 
        className={cn(
          "sm:max-w-[550px] p-0 shadow-lg rounded-lg border",
          colors.borderLight,
          colors.borderDark,
          "dark:bg-gray-900"
        )}
      >
        <div 
          className={cn(
            "relative flex flex-col pb-6 p-6 rounded-lg",
            "bg-gradient-to-br",
            colors.lightBg,
            colors.darkBg
          )}
        >
          {/* Background gradient */}
          <div className={cn(
            "absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-br rounded-lg",
            colors.gradientFrom,
            colors.gradientTo,
            colors.darkGradientFrom,
            colors.darkGradientTo
          )} />

          {/* Radial gradient */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-200 via-gray-100 to-transparent opacity-[0.015] dark:from-gray-500 dark:via-gray-600 dark:to-transparent dark:opacity-[0.01] rounded-lg" />
          
          {/* Dialog header */}
          <DialogHeader className="relative z-10 mb-6">
            <div className="flex items-center gap-3">
              <div className={cn("p-2.5 rounded-lg", colors.iconBg)}>
                <UploadIcon className="w-5 h-5" />
              </div>
              <DialogTitle className={cn("text-2xl font-bold", colors.headingText)}>
                Ajouter un document
              </DialogTitle>
            </div>
            <div className="ml-[52px] mt-2">
              <p className={cn("text-base", colors.descriptionText)}>
                Ajoutez un document à votre véhicule
              </p>
            </div>
          </DialogHeader>
          
          {/* Ligne séparatrice stylée */}
          <div className={cn(
            "h-px w-full mb-6",
            "bg-gradient-to-r from-transparent to-transparent",
            colors.separator
          )} />
          
          {/* Section du formulaire */}
          <div className="relative z-10">
            <DialogFormContent />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
