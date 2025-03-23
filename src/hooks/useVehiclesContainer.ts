
import { create } from 'zustand';

interface VehiclesContainerState {
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;
}

export const useVehiclesContainer = create<VehiclesContainerState>((set) => ({
  selectedVehicleId: null,
  setSelectedVehicleId: (id) => set({ selectedVehicleId: id }),
}));
