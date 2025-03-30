
import {
  FileIcon, 
  FileText, 
  FileImage, 
  FileSpreadsheet, 
  FileCode, 
  FileArchive,
  FilePieChart
} from "lucide-react";

interface DocumentTypeInfo {
  icon: React.ComponentType<any>;
  color: string;
}

export function useDocumentTypes() {
  const getDocumentType = (filePath: string): DocumentTypeInfo => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'pdf':
        return {
          icon: FileText,
          color: 'text-red-500 dark:text-red-400'
        };
      case 'doc':
      case 'docx':
        return {
          icon: FileText,
          color: 'text-blue-500 dark:text-blue-400'
        };
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return {
          icon: FileImage,
          color: 'text-green-500 dark:text-green-400'
        };
      case 'xls':
      case 'xlsx':
      case 'csv':
        return {
          icon: FileSpreadsheet,
          color: 'text-emerald-500 dark:text-emerald-400'
        };
      case 'html':
      case 'js':
      case 'css':
      case 'json':
        return {
          icon: FileCode,
          color: 'text-amber-500 dark:text-amber-400'
        };
      case 'zip':
      case 'rar':
      case '7z':
        return {
          icon: FileArchive,
          color: 'text-gray-500 dark:text-gray-400'
        };
      case 'ppt':
      case 'pptx':
        return {
          icon: FilePieChart,
          color: 'text-orange-500 dark:text-orange-400'
        };
      default:
        return {
          icon: FileIcon,
          color: 'text-gray-500 dark:text-gray-400'
        };
    }
  };

  return { getDocumentType };
}
