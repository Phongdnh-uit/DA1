import { create } from "zustand";

export interface PropertyComparisonStore {
  selectedProperties: number[];
  addProperty: (id: number) => void;
  removeProperty: (id: number) => void;
  reset: () => void;
  setSelectedProperties: (ids: number[]) => void;
}

export const usePropertyComparisonStore = create<PropertyComparisonStore>((set) => ({
  selectedProperties: [],

  addProperty: (id: number) =>
    set((state) => {
      if (state.selectedProperties.includes(id)) return state;

      if (state.selectedProperties.length >= 2) return state;

      return {
        selectedProperties: [...state.selectedProperties, id]
      };
    }),

  removeProperty: (id: number) =>
    set((state) => ({
      selectedProperties: state.selectedProperties.filter((p) => p !== id)
    })),

  reset: () =>
    set(() => ({
      selectedProperties: []
    })),

  setSelectedProperties: (ids: number[]) =>
    set(() => ({
      selectedProperties: ids.slice(0, 2)
    }))
}));
