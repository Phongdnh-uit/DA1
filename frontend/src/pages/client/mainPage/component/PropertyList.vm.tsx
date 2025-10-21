import { useFindAllProperty } from "@/services/property/property";

export default function useGetPropertyList() {
    const listProperty = useFindAllProperty();
    return {
        listProperty,
    };
}
