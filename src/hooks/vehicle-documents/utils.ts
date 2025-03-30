
import { toast } from "sonner";

export const handleError = (error: any, defaultMessage: string) => {
  const errorMessage = error?.message || defaultMessage;
  toast.error(errorMessage);
  return errorMessage;
};

export const showSuccess = (message: string) => {
  toast.success(message);
  return message;
};
