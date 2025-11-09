import { create } from "zustand";

interface ClientFilterState {
    search: string | null;
    provinceId: number | null;
    wardId: number | null;
    typeId: number | null;
    setSearch: (search: string | null) => void;
    setProvinceId: (provinceId: number | null) => void;
    setWardId: (wardId: number | null) => void;
    setTypeId: (typeId: number | null) => void;
}

export const useClientFilterStore = create<ClientFilterState>((set) => ({
    search: null,
    provinceId: null,
    wardId: null,
    typeId: null,
    setSearch: (search) => set({ search: search ?? null }),
    setProvinceId: (provinceId) => set({ provinceId: provinceId ?? null }),
    setWardId: (wardId) => set({ wardId: wardId ?? null }),
    setTypeId: (typeId) => set({ typeId: typeId ?? null }),
}));
