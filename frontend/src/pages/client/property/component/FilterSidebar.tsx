// import React, {
//     useMemo,
//     useState,
//     useCallback,
//     type ReactNode,
//     type ElementType,
// } from "react";
// import { Card } from "@/components/ui/card";
// import {
//     Accordion,
//     AccordionContent,
//     AccordionItem,
//     AccordionTrigger,
// } from "@/components/ui/accordion";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
// import { cn } from "@/lib/utils";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//     FilterIcon,
//     XIcon,
//     ChevronRightIcon,
//     HomeIcon,
//     RulerIcon,
//     BedDoubleIcon,
//     CompassIcon,
//     DoorOpenIcon,
//     SparklesIcon,
//     SofaIcon,
//     LayoutGridIcon,
//     TrendingUpIcon,
// } from "lucide-react";
// import { PropertyRequestDirection } from "@/types";
// import { directionConverter } from "@/utils/converter";
// import { useFilterStore, type FilterState } from "@/stores/filterStore";
//
// const formatPrice = (value: number) =>
//     value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
// const formatArea = (value: number) =>
//     value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
//
// const IconWrapper: React.FC<{
//     Icon: ElementType;
//     className?: string;
// }> = ({ Icon, className }) => (
//     <motion.div
//         whileHover={{ rotate: [0, -10, 10, -10, 0] }}
//         transition={{ duration: 0.5 }}
//         className={cn(
//             "p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors",
//             className,
//         )}
//     >
//         <Icon className="h-4 w-4" />
//     </motion.div>
// );
//
// const FilterSection: React.FC<{
//     value: string;
//     Icon: ElementType;
//     title: string;
//     badge?: React.ReactNode;
//     children: ReactNode;
//     onClear?: (key: string) => void;
// }> = ({ value, Icon, title, badge, onClear, children }) => (
//     <AccordionItem value={value} className="border-0">
//         <AccordionTrigger className="py-4 hover:no-underline group">
//             <div className="flex items-center justify-between w-full pr-2">
//                 <div className="flex items-center gap-3">
//                     <IconWrapper Icon={Icon} />
//                     <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
//                         {title}
//                     </span>
//                 </div>
//                 <AnimatePresence>
//                     {badge && (
//                         <motion.div
//                             initial={{ scale: 0, opacity: 0 }}
//                             animate={{ scale: 1, opacity: 1 }}
//                             exit={{ scale: 0, opacity: 0 }}
//                             transition={{ type: "spring", stiffness: 500, damping: 25 }}
//                         >
//                             <Badge
//                                 variant="secondary"
//                                 className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-semibold"
//                             >
//                                 {badge}
//                             </Badge>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </div>
//         </AccordionTrigger>
//         <AccordionContent>
//             <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="pt-2 pb-4 px-1"
//             >
//                 {children}
//                 {badge && onClear && (
//                     <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => onClear(value)}
//                         className="mt-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 w-full"
//                     >
//                         <XIcon className="h-3 w-3 mr-1" />
//                         Xóa bộ lọc này
//                     </Button>
//                 )}
//             </motion.div>
//         </AccordionContent>
//     </AccordionItem>
// );
//
// const RangeFilter: React.FC<{
//     min: number;
//     max: number;
//     step?: number;
//     value: [number, number];
//     onChange: (v: [number, number]) => void;
//     unitLabel?: string;
//     formatter?: (v: number) => string;
//     label?: string;
// }> = ({
//     min,
//     max,
//     step = 1,
//     value,
//     onChange,
//     unitLabel = "",
//     formatter = (v) => String(v),
//     label,
// }) => (
//         <div className="space-y-6">
//             <div>
//                 <div className="flex justify-between items-center mb-4">
//                     <span className="text-sm font-medium text-slate-600">{label}</span>
//                     <span className="text-sm font-semibold text-blue-600">
//                         {formatter(value[0])} {unitLabel} - {formatter(value[1])} {unitLabel}
//                     </span>
//                 </div>
//                 <Slider
//                     min={min}
//                     max={max}
//                     step={step}
//                     value={value}
//                     onValueChange={(vals) => onChange([vals[0], vals[1]])}
//                     className="w-full"
//                 />
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//                 <div className="space-y-2">
//                     <Label className="text-xs font-medium text-slate-600">
//                         Từ {unitLabel}
//                     </Label>
//                     <Input
//                         type="number"
//                         value={value[0]}
//                         onChange={(e) => onChange([+e.target.value, value[1]])}
//                         className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <Label className="text-xs font-medium text-slate-600">
//                         Đến {unitLabel}
//                     </Label>
//                     <Input
//                         type="number"
//                         value={value[1]}
//                         onChange={(e) => onChange([value[0], +e.target.value])}
//                         className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                     />
//                 </div>
//             </div>
//         </div>
//     );
//
// interface FilterSidebarProps {
//     className?: string;
// }
//
// export function FilterSidebar({ className }: FilterSidebarProps) {
//     const filters = useFilterStore((s) => s.filters);
//     const update = useFilterStore((s) => s.update);
//     const reset = useFilterStore((s) => s.reset);
//     const clearSingle = useFilterStore((s) => s.clearSingle);
//     const activeCount = useFilterStore((s) => s.activeCount());
//
//     const [isMobileOpen, setIsMobileOpen] = useState(false);
//     const [expandedSections, setExpandedSections] = useState<string[]>(["price"]);
//
//     const toggleArray = useCallback(
//         (
//             field: keyof Pick<FilterState, "direction" | "balconyDirection">,
//             value: string,
//         ) => {
//             const arr = (filters[field] as string[]) || [];
//             const next = arr.includes(value)
//                 ? arr.filter((v) => v !== value)
//                 : [...arr, value];
//             update({ [field]: next } as Partial<FilterState>);
//         },
//         [filters, update],
//     );
//
//     const setBoolean = useCallback(
//         (field: "hasMezzanine" | "hasBasement" | "hasElevator", val: boolean) => {
//             update({ [field]: val } as Partial<FilterState>);
//         },
//         [update],
//     );
//
//     const priceBadge = useMemo(() => {
//         return filters.priceRange[0] > 0 || filters.priceRange[1] < 10000
//             ? `${formatPrice(filters.priceRange[0])} - ${formatPrice(filters.priceRange[1])} triệu`
//             : undefined;
//     }, [filters.priceRange]);
//
//     const landBadge = useMemo(() => {
//         return filters.landAreaRange[0] > 0 || filters.landAreaRange[1] < 5000
//             ? `${formatArea(filters.landAreaRange[0])} - ${formatArea(filters.landAreaRange[1])} m²`
//             : undefined;
//     }, [filters.landAreaRange]);
//
//     const floorBadge = useMemo(() => {
//         return filters.floorAreaRange[0] > 0 || filters.floorAreaRange[1] < 5000
//             ? `${formatArea(filters.floorAreaRange[0])} - ${formatArea(filters.floorAreaRange[1])} m²`
//             : undefined;
//     }, [filters.floorAreaRange]);
//
//     const FilterContent = (
//         <div className="space-y-1 h-full">
//             <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="sticky top-0 z-20 pb-4 pt-2"
//             >
//                 <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-3">
//                         <motion.div
//                             animate={{ rotate: [0, 10, -10, 0] }}
//                             transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
//                         >
//                             <FilterIcon className="h-6 w-6 text-blue-600" />
//                         </motion.div>
//                         <div>
//                             <h2 className="text-xl font-bold text-slate-800">
//                                 Bộ lọc tìm kiếm
//                             </h2>
//                             <p className="text-xs text-slate-500">
//                                 Tùy chỉnh kết quả của bạn
//                             </p>
//                         </div>
//                     </div>
//                     <AnimatePresence>
//                         {activeCount > 0 && (
//                             <motion.div
//                                 initial={{ scale: 0, rotate: -180 }}
//                                 animate={{ scale: 1, rotate: 0 }}
//                                 exit={{ scale: 0, rotate: 180 }}
//                                 transition={{ type: "spring", stiffness: 300 }}
//                             >
//                                 <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base px-3 py-1 shadow-lg">
//                                     {activeCount}
//                                 </Badge>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                 </div>
//
//                 <AnimatePresence>
//                     {activeCount > 0 && (
//                         <motion.div
//                             initial={{ opacity: 0, height: 0 }}
//                             animate={{ opacity: 1, height: "auto" }}
//                             exit={{ opacity: 0, height: 0 }}
//                         >
//                             <motion.div
//                                 whileHover={{ scale: 1.02 }}
//                                 whileTap={{ scale: 0.98 }}
//                             >
//                                 <Button
//                                     variant="outline"
//                                     onClick={reset}
//                                     className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 font-medium"
//                                 >
//                                     <XIcon className="h-4 w-4 mr-2" />
//                                     Xóa tất cả bộ lọc ({activeCount})
//                                 </Button>
//                             </motion.div>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//
//                 <Separator className="mt-4" />
//             </motion.div>
//
//             <ScrollArea className="h-[600px] lg:h-[700px] pr-4">
//                 <Accordion
//                     type="multiple"
//                     value={expandedSections}
//                     onValueChange={setExpandedSections}
//                 >
//                     <FilterSection
//                         value="price"
//                         Icon={TrendingUpIcon}
//                         title="Mức giá"
//                         badge={priceBadge}
//                         onClear={clearSingle}
//                     >
//                         <RangeFilter
//                             label="Khoảng giá (triệu đồng)"
//                             min={0}
//                             max={10000}
//                             step={100}
//                             value={filters.priceRange}
//                             onChange={(v) => update({ priceRange: v })}
//                             unitLabel="triệu"
//                             formatter={formatPrice}
//                         />
//                     </FilterSection>
//
//                     <Separator className="my-2" />
//
//                     <FilterSection
//                         value="landArea"
//                         Icon={RulerIcon}
//                         title="Diện tích đất"
//                         badge={landBadge}
//                         onClear={clearSingle}
//                     >
//                         <RangeFilter
//                             label="Khoảng diện tích (m²)"
//                             min={0}
//                             max={5000}
//                             step={50}
//                             value={filters.landAreaRange}
//                             onChange={(v) => update({ landAreaRange: v })}
//                             unitLabel="m²"
//                             formatter={formatArea}
//                         />
//                     </FilterSection>
//
//                     <Separator className="my-2" />
//
//                     <FilterSection
//                         value="floorArea"
//                         Icon={LayoutGridIcon}
//                         title="Diện tích sàn"
//                         badge={floorBadge}
//                         onClear={clearSingle}
//                     >
//                         <RangeFilter
//                             label="Khoảng diện tích (m²)"
//                             min={0}
//                             max={5000}
//                             step={50}
//                             value={filters.floorAreaRange}
//                             onChange={(v) => update({ floorAreaRange: v })}
//                             unitLabel="m²"
//                             formatter={formatArea}
//                         />
//                     </FilterSection>
//
//                     <Separator className="my-2" />
//
//                     <FilterSection
//                         value="rooms"
//                         Icon={BedDoubleIcon}
//                         title="Số phòng"
//                         badge={
//                             filters.bedrooms || filters.bathrooms
//                                 ? `${filters.bedrooms || 0} PN, ${filters.bathrooms || 0} PT`
//                                 : undefined
//                         }
//                         onClear={clearSingle}
//                     >
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="space-y-2">
//                                 <Label className="text-xs font-medium text-slate-600 flex items-center gap-2">
//                                     <BedDoubleIcon className="h-3 w-3" /> Phòng ngủ
//                                 </Label>
//                                 <Input
//                                     type="number"
//                                     placeholder="Số phòng"
//                                     value={filters.bedrooms}
//                                     onChange={(e) => update({ bedrooms: e.target.value })}
//                                     className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                     min="0"
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label className="text-xs font-medium text-slate-600 flex items-center gap-2">
//                                     <DoorOpenIcon className="h-3 w-3" /> Phòng tắm
//                                 </Label>
//                                 <Input
//                                     type="number"
//                                     placeholder="Số phòng"
//                                     value={filters.bathrooms}
//                                     onChange={(e) => update({ bathrooms: e.target.value })}
//                                     className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                     min="0"
//                                 />
//                             </div>
//                         </div>
//                     </FilterSection>
//
//                     <Separator className="my-2" />
//
//                     <FilterSection
//                         value="floors"
//                         Icon={HomeIcon}
//                         title="Số tầng"
//                         badge={
//                             filters.floors || filters.floorNumber
//                                 ? `${filters.floors || "?"} tầng${filters.floorNumber ? `, vị trí ${filters.floorNumber}` : ""}`
//                                 : undefined
//                         }
//                         onClear={clearSingle}
//                     >
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="space-y-2">
//                                 <Label className="text-xs font-medium text-slate-600">
//                                     Tổng số tầng
//                                 </Label>
//                                 <Input
//                                     type="number"
//                                     placeholder="Số tầng"
//                                     value={filters.floors}
//                                     onChange={(e) => update({ floors: e.target.value })}
//                                     className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                     min="0"
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label className="text-xs font-medium text-slate-600">
//                                     Vị trí tầng
//                                 </Label>
//                                 <Input
//                                     type="number"
//                                     placeholder="Tầng số"
//                                     value={filters.floorNumber}
//                                     onChange={(e) => update({ floorNumber: e.target.value })}
//                                     className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                     min="0"
//                                 />
//                             </div>
//                         </div>
//                     </FilterSection>
//
//                     <Separator className="my-2" />
//
//                     <FilterSection
//                         value="direction"
//                         Icon={CompassIcon}
//                         title="Hướng nhà"
//                         badge={
//                             filters.direction.length > 0
//                                 ? filters.direction.length
//                                 : undefined
//                         }
//                         onClear={clearSingle}
//                     >
//                         <div className="grid grid-cols-2 gap-2">
//                             {Object.keys(PropertyRequestDirection).map((dir) => {
//                                 const isSelected = filters.direction.includes(dir);
//                                 return (
//                                     <motion.div
//                                         key={dir}
//                                         whileHover={{ scale: 1.03 }}
//                                         whileTap={{ scale: 0.97 }}
//                                     >
//                                         <label
//                                             htmlFor={`direction-${dir}`}
//                                             className={cn(
//                                                 "flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
//                                                 isSelected
//                                                     ? "border-blue-500 bg-blue-50 shadow-sm"
//                                                     : "border-slate-200 hover:border-slate-300 bg-white",
//                                             )}
//                                         >
//                                             <Checkbox
//                                                 id={`direction-${dir}`}
//                                                 checked={isSelected}
//                                                 onCheckedChange={() => toggleArray("direction", dir)}
//                                             />
//                                             <span
//                                                 className={cn(
//                                                     "text-sm font-medium",
//                                                     isSelected ? "text-blue-700" : "text-slate-700",
//                                                 )}
//                                             >
//                                                 {directionConverter(dir)}
//                                             </span>
//                                         </label>
//                                     </motion.div>
//                                 );
//                             })}
//                         </div>
//                     </FilterSection>
//
//                     <Separator className="my-2" />
//
//                     <FilterSection
//                         value="balcony"
//                         Icon={CompassIcon}
//                         title="Hướng ban công"
//                         badge={
//                             filters.balconyDirection.length > 0
//                                 ? filters.balconyDirection.length
//                                 : undefined
//                         }
//                         onClear={clearSingle}
//                     >
//                         <div className="grid grid-cols-2 gap-2">
//                             {Object.keys(PropertyRequestDirection).map((dir) => {
//                                 const isSelected = filters.balconyDirection.includes(dir);
//                                 return (
//                                     <motion.div
//                                         key={dir}
//                                         whileHover={{ scale: 1.03 }}
//                                         whileTap={{ scale: 0.97 }}
//                                     >
//                                         <label
//                                             htmlFor={`balcony-${dir}`}
//                                             className={cn(
//                                                 "flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
//                                                 isSelected
//                                                     ? "border-blue-500 bg-blue-50 shadow-sm"
//                                                     : "border-slate-200 hover:border-slate-300 bg-white",
//                                             )}
//                                         >
//                                             <Checkbox
//                                                 id={`balcony-${dir}`}
//                                                 checked={isSelected}
//                                                 onCheckedChange={() =>
//                                                     toggleArray("balconyDirection", dir)
//                                                 }
//                                             />
//                                             <span
//                                                 className={cn(
//                                                     "text-sm font-medium",
//                                                     isSelected ? "text-blue-700" : "text-slate-700",
//                                                 )}
//                                             >
//                                                 {directionConverter(dir)}
//                                             </span>
//                                         </label>
//                                     </motion.div>
//                                 );
//                             })}
//                         </div>
//                     </FilterSection>
//
//                     <Separator className="my-2" />
//
//                     <FilterSection
//                         value="entrance"
//                         Icon={RulerIcon}
//                         title="Độ rộng mặt tiền"
//                         badge={
//                             filters.entranceRoadWidth
//                                 ? `${filters.entranceRoadWidth}m`
//                                 : undefined
//                         }
//                         onClear={clearSingle}
//                     >
//                         <div className="space-y-2">
//                             <Label className="text-xs font-medium text-slate-600">
//                                 Độ rộng (mét)
//                             </Label>
//                             <Input
//                                 type="number"
//                                 placeholder="Nhập độ rộng mặt tiền"
//                                 value={filters.entranceRoadWidth}
//                                 onChange={(e) => update({ entranceRoadWidth: e.target.value })}
//                                 className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                 min="0"
//                                 step="0.1"
//                             />
//                         </div>
//                     </FilterSection>
//
//                     <Separator className="my-2" />
//
//                     <FilterSection
//                         value="amenities"
//                         Icon={SparklesIcon}
//                         title="Tiện ích"
//                         badge={
//                             filters.hasMezzanine || filters.hasBasement || filters.hasElevator
//                                 ? [
//                                     filters.hasMezzanine,
//                                     filters.hasBasement,
//                                     filters.hasElevator,
//                                 ].filter(Boolean).length
//                                 : undefined
//                         }
//                         onClear={clearSingle}
//                     >
//                         <div className="space-y-2">
//                             {[
//                                 { id: "hasMezzanine", label: "Có gác lửng" },
//                                 { id: "hasBasement", label: "Có tầng hầm" },
//                                 { id: "hasElevator", label: "Có thang máy" },
//                             ].map(({ id, label }) => {
//                                 const isSelected = filters[id as keyof FilterState] as boolean;
//                                 return (
//                                     <motion.div
//                                         key={id}
//                                         whileHover={{ scale: 1.02 }}
//                                         whileTap={{ scale: 0.98 }}
//                                     >
//                                         <label
//                                             htmlFor={id}
//                                             className={cn(
//                                                 "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
//                                                 isSelected
//                                                     ? "border-blue-500 bg-blue-50 shadow-sm"
//                                                     : "border-slate-200 hover:border-slate-300 bg-white",
//                                             )}
//                                         >
//                                             <Checkbox
//                                                 id={id}
//                                                 checked={isSelected}
//                                                 onCheckedChange={(checked) =>
//                                                     setBoolean(
//                                                         id as
//                                                         | "hasMezzanine"
//                                                         | "hasBasement"
//                                                         | "hasElevator",
//                                                         checked as boolean,
//                                                     )
//                                                 }
//                                             />
//                                             <span
//                                                 className={cn(
//                                                     "text-sm font-medium",
//                                                     isSelected ? "text-blue-700" : "text-slate-700",
//                                                 )}
//                                             >
//                                                 {label}
//                                             </span>
//                                         </label>
//                                     </motion.div>
//                                 );
//                             })}
//                         </div>
//                     </FilterSection>
//
//                     <Separator className="my-2" />
//
//                     <FilterSection
//                         value="interior"
//                         Icon={SofaIcon}
//                         title="Nội thất"
//                         badge={filters.interior ? "Đã nhập" : undefined}
//                         onClear={clearSingle}
//                     >
//                         <div className="space-y-2">
//                             <Label className="text-xs font-medium text-slate-600">
//                                 Mô tả nội thất
//                             </Label>
//                             <Input
//                                 type="text"
//                                 placeholder="VD: Nội thất cao cấp, đầy đủ..."
//                                 value={filters.interior}
//                                 onChange={(e) => update({ interior: e.target.value })}
//                                 className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                             />
//                         </div>
//                     </FilterSection>
//                 </Accordion>
//             </ScrollArea>
//         </div>
//     );
//
//     return (
//         <>
//             <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.4, ease: "easeOut" }}
//                 className={cn("hidden lg:block", className)}
//             >
//                 <Card className="bg-white shadow-xl border-0 overflow-hidden h-[900px]">
//                     <div className="p-6">{FilterContent}</div>
//                 </Card>
//             </motion.div>
//
//             <div className="lg:hidden fixed bottom-6 right-6 z-50">
//                 <motion.div
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.95 }}
//                     animate={{ y: [0, -8, 0] }}
//                     transition={{
//                         y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
//                     }}
//                 >
//                     <Button
//                         onClick={() => setIsMobileOpen(true)}
//                         size="lg"
//                         className="rounded-full h-16 w-16 shadow-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-4 border-white"
//                     >
//                         <FilterIcon className="h-7 w-7" />
//                         <AnimatePresence>
//                             {activeCount > 0 && (
//                                 <motion.div
//                                     initial={{ scale: 0 }}
//                                     animate={{ scale: 1 }}
//                                     exit={{ scale: 0 }}
//                                     className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold shadow-lg border-2 border-white"
//                                 >
//                                     {activeCount}
//                                 </motion.div>
//                             )}
//                         </AnimatePresence>
//                     </Button>
//                 </motion.div>
//             </div>
//
//             <AnimatePresence>
//                 {isMobileOpen && (
//                     <>
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             transition={{ duration: 0.2 }}
//                             className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
//                             onClick={() => setIsMobileOpen(false)}
//                         />
//                         <motion.div
//                             initial={{ x: "100%" }}
//                             animate={{ x: 0 }}
//                             exit={{ x: "100%" }}
//                             transition={{ type: "spring", damping: 30, stiffness: 300 }}
//                             className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] z-50 lg:hidden shadow-2xl flex flex-col"
//                         >
//                             <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 z-10 p-4 flex items-center justify-between shadow-lg">
//                                 <div className="flex items-center gap-3">
//                                     <FilterIcon className="h-6 w-6 text-white" />
//                                     <div>
//                                         <h2 className="text-lg font-bold text-white">Bộ lọc</h2>
//                                         <p className="text-xs text-blue-100">
//                                             Tìm kiếm chính xác hơn
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     onClick={() => setIsMobileOpen(false)}
//                                     className="text-white"
//                                 >
//                                     <XIcon className="h-6 w-6" />
//                                 </Button>
//                             </div>
//
//                             <div className="flex-1 overflow-hidden p-4">{FilterContent}</div>
//
//                             <div className="sticky bottom-0 bg-white border-t shadow-lg p-4">
//                                 <motion.div
//                                     whileHover={{ scale: 1.02 }}
//                                     whileTap={{ scale: 0.98 }}
//                                 >
//                                     <Button
//                                         onClick={() => setIsMobileOpen(false)}
//                                         className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg"
//                                     >
//                                         Xem kết quả
//                                         {activeCount > 0 && ` (${activeCount} bộ lọc)`}
//                                         <ChevronRightIcon className="ml-2 h-5 w-5" />
//                                     </Button>
//                                 </motion.div>
//                             </div>
//                         </motion.div>
//                     </>
//                 )}
//             </AnimatePresence>
//         </>
//     );
// }
//
// export default FilterSidebar;
import React, {
    useMemo,
    useState,
    useCallback,
    type ReactNode,
    type ElementType,
} from "react";
import { Card } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
    FilterIcon,
    XIcon,
    ChevronRightIcon,
    HomeIcon,
    RulerIcon,
    BedDoubleIcon,
    CompassIcon,
    DoorOpenIcon,
    SparklesIcon,
    SofaIcon,
    LayoutGridIcon,
    TrendingUpIcon,
} from "lucide-react";
import { PropertyRequestDirection } from "@/types";
import { directionConverter } from "@/utils/converter";
import { useFilterStore, type FilterState } from "@/stores/filterStore";

const formatPrice = (value: number) =>
    value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
const formatArea = (value: number) =>
    value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();

const IconWrapper: React.FC<{
    Icon: ElementType;
    className?: string;
}> = ({ Icon, className }) => (
    <motion.div
        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
        className={cn(
            "p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:group-hover:bg-blue-900/50",
            className,
        )}
    >
        <Icon className="h-4 w-4" />
    </motion.div>
);

const FilterSection: React.FC<{
    value: string;
    Icon: ElementType;
    title: string;
    badge?: React.ReactNode;
    children: ReactNode;
    onClear?: (key: string) => void;
}> = ({ value, Icon, title, badge, onClear, children }) => (
    <AccordionItem value={value} className="border-0">
        <AccordionTrigger className="py-4 hover:no-underline group">
            <div className="flex items-center justify-between w-full pr-2">
                <div className="flex items-center gap-3">
                    <IconWrapper Icon={Icon} />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white">
                        {title}
                    </span>
                </div>
                <AnimatePresence>
                    {badge && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        >
                            <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-semibold dark:bg-blue-900 dark:text-blue-300"
                            >
                                {badge}
                            </Badge>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AccordionTrigger>
        <AccordionContent>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="pt-2 pb-4 px-1"
            >
                {children}
                {badge && onClear && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onClear(value)}
                        className="mt-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 w-full"
                    >
                        <XIcon className="h-3 w-3 mr-1" />
                        Xóa bộ lọc này
                    </Button>
                )}
            </motion.div>
        </AccordionContent>
    </AccordionItem>
);

const RangeFilter: React.FC<{
    min: number;
    max: number;
    step?: number;
    value: [number, number];
    onChange: (v: [number, number]) => void;
    unitLabel?: string;
    formatter?: (v: number) => string;
    label?: string;
}> = ({
    min,
    max,
    step = 1,
    value,
    onChange,
    unitLabel = "",
    formatter = (v) => String(v),
    label,
}) => (
        <div className="space-y-6">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</span>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {formatter(value[0])} {unitLabel} - {formatter(value[1])} {unitLabel}
                    </span>
                </div>
                <Slider
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onValueChange={(vals) => onChange([vals[0], vals[1]])}
                    className="w-full"
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                    <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Từ {unitLabel}
                    </Label>
                    <Input
                        type="number"
                        value={value[0]}
                        onChange={(e) => onChange([+e.target.value, value[1]])}
                        className="bg-slate-50 border-slate-200 focus:border-blue-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Đến {unitLabel}
                    </Label>
                    <Input
                        type="number"
                        value={value[1]}
                        onChange={(e) => onChange([value[0], +e.target.value])}
                        className="bg-slate-50 border-slate-200 focus:border-blue-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                    />
                </div>
            </div>
        </div>
    );

interface FilterSidebarProps {
    className?: string;
}

export function FilterSidebar({ className }: FilterSidebarProps) {
    const filters = useFilterStore((s) => s.filters);
    const update = useFilterStore((s) => s.update);
    const reset = useFilterStore((s) => s.reset);
    const clearSingle = useFilterStore((s) => s.clearSingle);
    const activeCount = useFilterStore((s) => s.activeCount());

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState<string[]>([]);

    const toggleArray = useCallback(
        (
            field: keyof Pick<FilterState, "direction" | "balconyDirection">,
            value: string,
        ) => {
            const arr = (filters[field] as string[]) || [];
            const next = arr.includes(value)
                ? arr.filter((v) => v !== value)
                : [...arr, value];
            update({ [field]: next } as Partial<FilterState>);
        },
        [filters, update],
    );

    const setBoolean = useCallback(
        (field: "hasMezzanine" | "hasBasement" | "hasElevator", val: boolean) => {
            update({ [field]: val } as Partial<FilterState>);
        },
        [update],
    );

    const priceBadge = useMemo(() => {
        return filters.priceRange[0] > 0 || filters.priceRange[1] < 10000
            ? `${formatPrice(filters.priceRange[0])} - ${formatPrice(filters.priceRange[1])} triệu`
            : undefined;
    }, [filters.priceRange]);

    const landBadge = useMemo(() => {
        return filters.landAreaRange[0] > 0 || filters.landAreaRange[1] < 5000
            ? `${formatArea(filters.landAreaRange[0])} - ${formatArea(filters.landAreaRange[1])} m²`
            : undefined;
    }, [filters.landAreaRange]);

    const floorBadge = useMemo(() => {
        return filters.floorAreaRange[0] > 0 || filters.floorAreaRange[1] < 5000
            ? `${formatArea(filters.floorAreaRange[0])} - ${formatArea(filters.floorAreaRange[1])} m²`
            : undefined;
    }, [filters.floorAreaRange]);

    const FilterContent = (
        <div className="space-y-1 h-full">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-20 pb-4 pt-2 bg-white dark:bg-slate-950"
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                            <FilterIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </motion.div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                                Bộ lọc tìm kiếm
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Tùy chỉnh kết quả của bạn
                            </p>
                        </div>
                    </div>
                    <AnimatePresence>
                        {activeCount > 0 && (
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base px-3 py-1 shadow-lg border-0">
                                    {activeCount}
                                </Badge>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {activeCount > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    variant="outline"
                                    onClick={reset}
                                    className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30 font-medium"
                                >
                                    <XIcon className="h-4 w-4 mr-2" />
                                    Xóa tất cả bộ lọc ({activeCount})
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Separator className="mt-4 dark:bg-slate-800" />
            </motion.div>

            <ScrollArea className="h-[600px] lg:h-[700px] pr-4">
                <Accordion
                    type="multiple"
                    value={expandedSections}
                    onValueChange={setExpandedSections}
                >
                    <FilterSection
                        value="price"
                        Icon={TrendingUpIcon}
                        title="Mức giá"
                        badge={priceBadge}
                        onClear={clearSingle}
                    >
                        <RangeFilter
                            label="Khoảng giá (triệu đồng)"
                            min={0}
                            max={10000}
                            step={100}
                            value={filters.priceRange}
                            onChange={(v) => update({ priceRange: v })}
                            unitLabel="triệu"
                            formatter={formatPrice}
                        />
                    </FilterSection>

                    <Separator className="my-2 dark:bg-slate-800" />

                    <FilterSection
                        value="landArea"
                        Icon={RulerIcon}
                        title="Diện tích đất"
                        badge={landBadge}
                        onClear={clearSingle}
                    >
                        <RangeFilter
                            label="Khoảng diện tích (m²)"
                            min={0}
                            max={5000}
                            step={50}
                            value={filters.landAreaRange}
                            onChange={(v) => update({ landAreaRange: v })}
                            unitLabel="m²"
                            formatter={formatArea}
                        />
                    </FilterSection>

                    <Separator className="my-2 dark:bg-slate-800" />

                    <FilterSection
                        value="floorArea"
                        Icon={LayoutGridIcon}
                        title="Diện tích sàn"
                        badge={floorBadge}
                        onClear={clearSingle}
                    >
                        <RangeFilter
                            label="Khoảng diện tích (m²)"
                            min={0}
                            max={5000}
                            step={50}
                            value={filters.floorAreaRange}
                            onChange={(v) => update({ floorAreaRange: v })}
                            unitLabel="m²"
                            formatter={formatArea}
                        />
                    </FilterSection>

                    <Separator className="my-2 dark:bg-slate-800" />

                    <FilterSection
                        value="rooms"
                        Icon={BedDoubleIcon}
                        title="Số phòng"
                        badge={
                            filters.bedrooms || filters.bathrooms
                                ? `${filters.bedrooms || 0} PN, ${filters.bathrooms || 0} PT`
                                : undefined
                        }
                        onClear={clearSingle}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                    <BedDoubleIcon className="h-3 w-3" /> Phòng ngủ
                                </Label>
                                <Input
                                    type="number"
                                    placeholder="Số phòng"
                                    value={filters.bedrooms}
                                    onChange={(e) => update({ bedrooms: e.target.value })}
                                    className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:border-blue-500"
                                    min="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                    <DoorOpenIcon className="h-3 w-3" /> Phòng tắm
                                </Label>
                                <Input
                                    type="number"
                                    placeholder="Số phòng"
                                    value={filters.bathrooms}
                                    onChange={(e) => update({ bathrooms: e.target.value })}
                                    className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:border-blue-500"
                                    min="0"
                                />
                            </div>
                        </div>
                    </FilterSection>

                    <Separator className="my-2 dark:bg-slate-800" />

                    <FilterSection
                        value="floors"
                        Icon={HomeIcon}
                        title="Số tầng"
                        badge={
                            filters.floors || filters.floorNumber
                                ? `${filters.floors || "?"} tầng${filters.floorNumber ? `, vị trí ${filters.floorNumber}` : ""}`
                                : undefined
                        }
                        onClear={clearSingle}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                    Tổng số tầng
                                </Label>
                                <Input
                                    type="number"
                                    placeholder="Số tầng"
                                    value={filters.floors}
                                    onChange={(e) => update({ floors: e.target.value })}
                                    className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                                    min="0"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                    Vị trí tầng
                                </Label>
                                <Input
                                    type="number"
                                    placeholder="Tầng số"
                                    value={filters.floorNumber}
                                    onChange={(e) => update({ floorNumber: e.target.value })}
                                    className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                                    min="0"
                                />
                            </div>
                        </div>
                    </FilterSection>

                    <Separator className="my-2 dark:bg-slate-800" />

                    <FilterSection
                        value="direction"
                        Icon={CompassIcon}
                        title="Hướng nhà"
                        badge={
                            filters.direction.length > 0
                                ? filters.direction.length
                                : undefined
                        }
                        onClear={clearSingle}
                    >
                        <div className="grid grid-cols-2 gap-2">
                            {Object.keys(PropertyRequestDirection).map((dir) => {
                                const isSelected = filters.direction.includes(dir);
                                return (
                                    <motion.div
                                        key={dir}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <label
                                            htmlFor={`direction-${dir}`}
                                            className={cn(
                                                "flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
                                                isSelected
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700",
                                            )}
                                        >
                                            <Checkbox
                                                id={`direction-${dir}`}
                                                checked={isSelected}
                                                onCheckedChange={() => toggleArray("direction", dir)}
                                            />
                                            <span
                                                className={cn(
                                                    "text-sm font-medium",
                                                    isSelected ? "text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-300",
                                                )}
                                            >
                                                {directionConverter(dir)}
                                            </span>
                                        </label>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </FilterSection>

                    <Separator className="my-2 dark:bg-slate-800" />

                    <FilterSection
                        value="balcony"
                        Icon={CompassIcon}
                        title="Hướng ban công"
                        badge={
                            filters.balconyDirection.length > 0
                                ? filters.balconyDirection.length
                                : undefined
                        }
                        onClear={clearSingle}
                    >
                        <div className="grid grid-cols-2 gap-2">
                            {Object.keys(PropertyRequestDirection).map((dir) => {
                                const isSelected = filters.balconyDirection.includes(dir);
                                return (
                                    <motion.div
                                        key={dir}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <label
                                            htmlFor={`balcony-${dir}`}
                                            className={cn(
                                                "flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
                                                isSelected
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700",
                                            )}
                                        >
                                            <Checkbox
                                                id={`balcony-${dir}`}
                                                checked={isSelected}
                                                onCheckedChange={() =>
                                                    toggleArray("balconyDirection", dir)
                                                }
                                            />
                                            <span
                                                className={cn(
                                                    "text-sm font-medium",
                                                    isSelected ? "text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-300",
                                                )}
                                            >
                                                {directionConverter(dir)}
                                            </span>
                                        </label>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </FilterSection>

                    <Separator className="my-2 dark:bg-slate-800" />

                    <FilterSection
                        value="entrance"
                        Icon={RulerIcon}
                        title="Độ rộng mặt tiền"
                        badge={
                            filters.entranceRoadWidth
                                ? `${filters.entranceRoadWidth}m`
                                : undefined
                        }
                        onClear={clearSingle}
                    >
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Độ rộng (mét)
                            </Label>
                            <Input
                                type="number"
                                placeholder="Nhập độ rộng mặt tiền"
                                value={filters.entranceRoadWidth}
                                onChange={(e) => update({ entranceRoadWidth: e.target.value })}
                                className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:border-blue-500"
                                min="0"
                                step="0.1"
                            />
                        </div>
                    </FilterSection>

                    <Separator className="my-2 dark:bg-slate-800" />

                    <FilterSection
                        value="amenities"
                        Icon={SparklesIcon}
                        title="Tiện ích"
                        badge={
                            filters.hasMezzanine || filters.hasBasement || filters.hasElevator
                                ? [
                                    filters.hasMezzanine,
                                    filters.hasBasement,
                                    filters.hasElevator,
                                ].filter(Boolean).length
                                : undefined
                        }
                        onClear={clearSingle}
                    >
                        <div className="space-y-2">
                            {[
                                { id: "hasMezzanine", label: "Có gác lửng" },
                                { id: "hasBasement", label: "Có tầng hầm" },
                                { id: "hasElevator", label: "Có thang máy" },
                            ].map(({ id, label }) => {
                                const isSelected = filters[id as keyof FilterState] as boolean;
                                return (
                                    <motion.div
                                        key={id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <label
                                            htmlFor={id}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                                                isSelected
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700",
                                            )}
                                        >
                                            <Checkbox
                                                id={id}
                                                checked={isSelected}
                                                onCheckedChange={(checked) =>
                                                    setBoolean(
                                                        id as
                                                        | "hasMezzanine"
                                                        | "hasBasement"
                                                        | "hasElevator",
                                                        checked as boolean,
                                                    )
                                                }
                                            />
                                            <span
                                                className={cn(
                                                    "text-sm font-medium",
                                                    isSelected ? "text-blue-700 dark:text-blue-400" : "text-slate-700 dark:text-slate-300",
                                                )}
                                            >
                                                {label}
                                            </span>
                                        </label>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </FilterSection>

                    <Separator className="my-2 dark:bg-slate-800" />

                    <FilterSection
                        value="interior"
                        Icon={SofaIcon}
                        title="Nội thất"
                        badge={filters.interior ? "Đã nhập" : undefined}
                        onClear={clearSingle}
                    >
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                Mô tả nội thất
                            </Label>
                            <Input
                                type="text"
                                placeholder="VD: Nội thất cao cấp, đầy đủ..."
                                value={filters.interior}
                                onChange={(e) => update({ interior: e.target.value })}
                                className="bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:border-blue-500"
                            />
                        </div>
                    </FilterSection>
                </Accordion>
            </ScrollArea>
        </div>
    );

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={cn("hidden lg:block", className)}
            >
                <Card className="bg-white dark:bg-slate-950 shadow-xl border-0 dark:border dark:border-slate-800 overflow-hidden h-[900px]">
                    <div className="p-6">{FilterContent}</div>
                </Card>
            </motion.div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden fixed bottom-6 right-6 z-50">
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                        y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    }}
                >
                    <Button
                        onClick={() => setIsMobileOpen(true)}
                        size="lg"
                        className="rounded-full h-16 w-16 shadow-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-4 border-white dark:border-slate-900"
                    >
                        <FilterIcon className="h-7 w-7" />
                        <AnimatePresence>
                            {activeCount > 0 && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold shadow-lg border-2 border-white dark:border-slate-900"
                                >
                                    {activeCount}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Button>
                </motion.div>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed right-0 top-0 bottom-0 w-full sm:w-[400px] z-50 lg:hidden shadow-2xl flex flex-col bg-white dark:bg-slate-950"
                        >
                            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 z-10 p-4 flex items-center justify-between shadow-lg">
                                <div className="flex items-center gap-3">
                                    <FilterIcon className="h-6 w-6 text-white" />
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Bộ lọc</h2>
                                        <p className="text-xs text-blue-100">
                                            Tìm kiếm chính xác hơn
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsMobileOpen(false)}
                                    className="text-white hover:bg-white/20"
                                >
                                    <XIcon className="h-6 w-6" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-hidden p-4 dark:bg-slate-950">{FilterContent}</div>

                            <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t dark:border-slate-800 shadow-lg p-4">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        onClick={() => setIsMobileOpen(false)}
                                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg"
                                    >
                                        Xem kết quả
                                        {activeCount > 0 && ` (${activeCount} bộ lọc)`}
                                        <ChevronRightIcon className="ml-2 h-5 w-5" />
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default FilterSidebar;
