import { create } from "zustand";

export interface FilterState {
    search: string;
    provinceId?: number;
    wardId?: number;
    typeId?: number;
    priceRange: [number, number];
    landAreaRange: [number, number];
    floorAreaRange: [number, number];
    floors: string;
    floorNumber: string;
    bedrooms: string;
    bathrooms: string;
    direction: string[];
    entranceRoadWidth: string;
    balconyDirection: string[];
    hasMezzanine: boolean;
    hasBasement: boolean;
    hasElevator: boolean;
    interior: string;
}

export const DEFAULT_FILTERS: FilterState = {
    priceRange: [0, 10000],
    landAreaRange: [0, 5000],
    floorAreaRange: [0, 5000],
    floors: "",
    floorNumber: "",
    bedrooms: "",
    bathrooms: "",
    direction: [],
    entranceRoadWidth: "",
    balconyDirection: [],
    hasMezzanine: false,
    hasBasement: false,
    hasElevator: false,
    interior: "",
    search: "",
};
interface FilterStore {
    filters: FilterState;
    update: (patch: Partial<FilterState>) => void;
    reset: () => void;
    clearSingle: (key: string) => void;
    activeCount: () => number;
    buildQuery: () => string;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
    filters: DEFAULT_FILTERS,

    update: (patch) =>
        set((state) => ({
            filters: { ...state.filters, ...patch },
        })),

    reset: () =>
        set(() => ({
            filters: DEFAULT_FILTERS,
        })),

    clearSingle: (key) => {
        const updates: Partial<FilterState> = {};

        switch (key) {
            case "price":
                updates.priceRange = DEFAULT_FILTERS.priceRange;
                break;
            case "landArea":
                updates.landAreaRange = DEFAULT_FILTERS.landAreaRange;
                break;
            case "floorArea":
                updates.floorAreaRange = DEFAULT_FILTERS.floorAreaRange;
                break;
            case "rooms":
                updates.bedrooms = "";
                updates.bathrooms = "";
                break;
            case "floors":
                updates.floors = "";
                updates.floorNumber = "";
                break;
            case "direction":
                updates.direction = [];
                break;
            case "balcony":
                updates.balconyDirection = [];
                break;
            case "entrance":
                updates.entranceRoadWidth = "";
                break;
            case "amenities":
                updates.hasMezzanine = false;
                updates.hasBasement = false;
                updates.hasElevator = false;
                break;
            case "interior":
                updates.interior = "";
                break;
        }

        set((state) => ({
            filters: { ...state.filters, ...updates },
        }));
    },

    activeCount: () => {
        const f = get().filters;
        let count = 0;

        if (f.priceRange[0] > 0 || f.priceRange[1] < 10000) count++;
        if (f.landAreaRange[0] > 0 || f.landAreaRange[1] < 5000) count++;
        if (f.floorAreaRange[0] > 0 || f.floorAreaRange[1] < 5000) count++;
        if (f.floors) count++;
        if (f.floorNumber) count++;
        if (f.bedrooms) count++;
        if (f.bathrooms) count++;
        if (f.direction.length > 0) count++;
        if (f.entranceRoadWidth) count++;
        if (f.balconyDirection.length > 0) count++;
        if (f.hasMezzanine || f.hasBasement || f.hasElevator) count++;
        if (f.interior) count++;
        if (f.provinceId) count++;
        if (f.wardId) count++;
        if (f.typeId) count++;

        return count;
    },

    buildQuery: () => {
        const f = get().filters;
        const q: string[] = [];

        // Text search
        if (f.search?.trim()) {
            q.push(`title==*${f.search.trim()}*,lineAddress==*${f.search.trim()}*`);
        }

        // Province / Ward / Type
        if (f.provinceId) q.push(`ward.province.id==${f.provinceId}`);
        if (f.wardId) q.push(`ward.id==${f.wardId}`);
        if (f.typeId) q.push(`type.id==${f.typeId}`);

        // Price range
        if (f.priceRange[0] > 0) q.push(`price>=${f.priceRange[0] * 1000000}`);
        if (f.priceRange[1] < 10000) q.push(`price<=${f.priceRange[1] * 1000000}`);

        // Land area
        if (f.landAreaRange[0] > 0) q.push(`landArea>=${f.landAreaRange[0]}`);
        if (f.landAreaRange[1] < 5000) q.push(`landArea<=${f.landAreaRange[1]}`);

        // Floor area
        if (f.floorAreaRange[0] > 0) q.push(`floorArea>=${f.floorAreaRange[0]}`);
        if (f.floorAreaRange[1] < 5000) q.push(`floorArea<=${f.floorAreaRange[1]}`);

        // Floors
        if (f.floors) q.push(`floors==${f.floors}`);
        if (f.floorNumber) q.push(`floorNumber==${f.floorNumber}`);

        // Bedrooms / Bathrooms
        if (f.bedrooms) q.push(`bedrooms==${f.bedrooms}`);
        if (f.bathrooms) q.push(`bathrooms==${f.bathrooms}`);

        // Direction array
        if (f.direction.length > 0) {
            q.push(`direction=in=(${f.direction.join(",")})`);
        }

        // Balcony array
        if (f.balconyDirection.length > 0) {
            q.push(`balconyDirection=in=(${f.balconyDirection.join(",")})`);
        }

        // Entrance Road Width
        if (f.entranceRoadWidth) {
            q.push(`entranceRoadWidth==${f.entranceRoadWidth}`);
        }

        // Amenities (boolean)
        if (f.hasMezzanine) q.push(`hasMezzanine==true`);
        if (f.hasBasement) q.push(`hasBasement==true`);
        if (f.hasElevator) q.push(`hasElevator==true`);

        // Interior
        if (f.interior) q.push(`interior==${f.interior}`);

        // Join all with AND
        return q.join(";");
    },
}));
