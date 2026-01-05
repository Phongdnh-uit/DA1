import { Combobox } from "@/components/customs/Combobox";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RippleButton } from "@/components/ui/shadcn-io/ripple-button";
import { useFindAllPropertyType } from "@/services/property-type/property-type";
import { useFindAllProvince } from "@/services/province/province";
import { useFindAllWard } from "@/services/ward/ward";
import { useFilterStore } from "@/stores/filterStore";
import { MapPinIcon, SearchIcon } from "lucide-react";
import { motion } from "motion/react";

interface FilterTopBarProps {
    onSubmit: () => void;
}

export const FilterTopBar = ({ onSubmit }: FilterTopBarProps) => {
    const filters = useFilterStore((s) => s.filters);
    const update = useFilterStore((s) => s.update);
    const listProvince = useFindAllProvince({ all: true, sort: ["name,asc"] });
    const listWard = useFindAllWard(
        {
            all: true,
            sort: ["name,asc"],
            filter: `province.id==${filters.provinceId}`,
        },
        {
            query: {
                enabled: !!filters.provinceId,
            },
        },
    );
    const listType = useFindAllPropertyType({ all: true });
    return (
        <Card className="mb-6 shadow-sm border">
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end ">
                    <div className="md:col-span-2">
                        <Label htmlFor="location" className="mb-2 block">
                            Tìm kiếm
                        </Label>
                        <div className="relative">
                            <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                onChange={(e) => update({ search: e.target.value })}
                                id="location"
                                placeholder="Nhập tên dự án, địa chỉ..."
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="type" className="mb-2 block">
                            Tỉnh/Thành phố
                        </Label>
                        <Combobox
                            value={filters.provinceId ? String(filters.provinceId) : null}
                            onChange={(value) =>
                                update({
                                    provinceId: +value,
                                })
                            }
                            options={
                                listProvince.data?.data?.content?.map((province) => ({
                                    key: province.id as number,
                                    render: province.type + " " + province.name,
                                    searchKey: province.type + " " + province.name,
                                })) || []
                            }
                            searchable
                            className="!h-12"
                        />
                    </div>

                    <div>
                        <Label htmlFor="type" className="mb-2 block">
                            Xã/Phường
                        </Label>
                        <Combobox
                            className="!h-12"
                            value={filters.wardId ? String(filters.wardId) : null}
                            onChange={(value) =>
                                update({
                                    wardId: +value,
                                })
                            }
                            options={
                                listWard.data?.data?.content?.map((ward) => ({
                                    key: ward.id as number,
                                    render: ward.name,
                                    searchKey: ward.name,
                                })) || []
                            }
                            searchable
                            disabled={!filters.provinceId}
                        />
                    </div>

                    <div>
                        <Label htmlFor="type" className="mb-2 block">
                            Loại hình
                        </Label>
                        <Combobox
                            className="!h-12"
                            value={filters.typeId ? String(filters.typeId) : null}
                            onChange={(value) =>
                                update({
                                    typeId: +value,
                                })
                            }
                            options={
                                listType.data?.data?.content?.map((type) => ({
                                    key: type.id as number,
                                    render: type.name,
                                    searchKey: type.name,
                                })) || []
                            }
                            searchable
                        />
                    </div>

                    {/* Search Button */}
                    <div className="flex items-center justify-end gap-4 ">
                        <motion.div
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            <RippleButton
                                className="w-full h-10 bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
                                onClick={onSubmit}
                            >
                                <SearchIcon className="h-4 w-4 mr-2" />
                                Tìm kiếm
                            </RippleButton>
                        </motion.div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
