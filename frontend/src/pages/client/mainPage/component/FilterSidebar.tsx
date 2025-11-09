import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";

export function FilterSidebar() {
    return (
        <aside className="w-full md:w-80 lg:w-96 flex-shrink-0">
            <div className="bg-white p-5 rounded-xl shadow-md sticky top-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Bộ lọc chi tiết
                    </h3>
                    <Button
                        variant="ghost"
                        className="text-sm text-blue-600 p-0 h-auto hover:bg-transparent"
                    >
                        Xóa tất cả
                    </Button>
                </div>

                {/* Accordion Group */}
                <Accordion type="multiple" className="w-full">
                    {/* Nhóm 1: Thông tin cơ bản */}
                    <AccordionItem value="basic">
                        <AccordionTrigger>Thông tin cơ bản</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4 pt-2">
                                {/* Purpose */}
                                <div>
                                    <Label className="block mb-2">Mục đích (Purpose)</Label>
                                    <div className="flex space-x-4">
                                        {[
                                            { value: "FOR_SALE", label: "Bán" },
                                            { value: "FOR_RENT", label: "Thuê" },
                                        ].map((opt) => (
                                            <Label
                                                key={opt.value}
                                                className="flex items-center space-x-2 cursor-pointer"
                                            >
                                                <input type="radio" name="purpose" value={opt.value} />
                                                <span>{opt.label}</span>
                                            </Label>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Slider */}
                                <div>
                                    <Label htmlFor="price">Khoảng giá (Price)</Label>
                                    <Slider id="price" max={100} step={1} className="mt-3" />
                                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                                        <span>0 tỷ</span>
                                        <span>100 tỷ</span>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Nhóm 2: Chi tiết BĐS */}
                    <AccordionItem value="details">
                        <AccordionTrigger>Chi tiết Bất động sản</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4 pt-2">
                                {/* Bedrooms */}
                                <div>
                                    <Label className="mb-2 block">Số phòng ngủ</Label>
                                    <ToggleGroup type="multiple" className="flex flex-wrap gap-2">
                                        {["1", "2", "3", "4", "5"].map((num) => (
                                            <ToggleGroupItem
                                                key={num}
                                                value={num}
                                                className="px-3 py-1"
                                            >
                                                {num}+
                                            </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                </div>

                                {/* Bathrooms */}
                                <div>
                                    <Label className="mb-2 block">Số phòng tắm</Label>
                                    <ToggleGroup type="multiple" className="flex flex-wrap gap-2">
                                        {["1", "2", "3"].map((num) => (
                                            <ToggleGroupItem
                                                key={num}
                                                value={num}
                                                className="px-3 py-1"
                                            >
                                                {num}+
                                            </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                </div>

                                {/* Direction */}
                                <div>
                                    <Label className="mb-2 block">Hướng nhà</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tất cả" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">Tất cả</SelectItem>
                                            <SelectItem value="NORTH">Bắc</SelectItem>
                                            <SelectItem value="SOUTH">Nam</SelectItem>
                                            <SelectItem value="EAST">Đông</SelectItem>
                                            <SelectItem value="WEST">Tây</SelectItem>
                                            <SelectItem value="NORTH_EAST">Đông Bắc</SelectItem>
                                            <SelectItem value="SOUTH_EAST">Đông Nam</SelectItem>
                                            <SelectItem value="NORTH_WEST">Tây Bắc</SelectItem>
                                            <SelectItem value="SOUTH_WEST">Tây Nam</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Land Area */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="landAreaMin">Diện tích đất (min)</Label>
                                        <Input id="landAreaMin" type="number" placeholder="m²" />
                                    </div>
                                    <div>
                                        <Label htmlFor="landAreaMax">Diện tích đất (max)</Label>
                                        <Input id="landAreaMax" type="number" placeholder="m²" />
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Nhóm 3: Tiện ích */}
                    <AccordionItem value="features">
                        <AccordionTrigger>Tiện ích</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2 pt-2">
                                {[
                                    { key: "hasMezzanine", label: "Có gác lửng" },
                                    { key: "hasBasement", label: "Có tầng hầm" },
                                    { key: "hasElevator", label: "Có thang máy" },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center space-x-2">
                                        <Checkbox id={item.key} />
                                        <Label htmlFor={item.key}>{item.label}</Label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </aside>
    );
}
