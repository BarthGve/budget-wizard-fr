
import { useState } from "react";

export function useViewModeToggle(initialMode: 'monthly' | 'yearly' = 'monthly') {
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>(initialMode);
  
  const toggleViewMode = (checked: boolean) => {
    setViewMode(checked ? 'yearly' : 'monthly');
  };
  
  return {
    viewMode,
    toggleViewMode
  };
}
