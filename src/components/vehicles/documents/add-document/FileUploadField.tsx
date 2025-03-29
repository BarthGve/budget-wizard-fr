
import { useState } from "react";
import { cn } from "@/lib/utils";
import { XIcon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FileUploadFieldProps {
  onChange: (file: File) => void;
  selectedFileName: string | null;
  onClear: () => void;
}

export const FileUploadField = ({ 
  onChange, 
  selectedFileName, 
  onClear,
  ...props 
}: FileUploadFieldProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onChange(files[0]);
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
      onChange(files[0]);
    }
  };

  return (
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
            {...props}
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
              onClear();
            }}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
