import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import {
    CalendarIcon,
    CheckCircle2,
    Clock,
    FileText,
    Info,
} from "lucide-react";
import { MotionButton } from "@/components/general/MotionShadcn";
import { BackButton } from "@/components/general/BackButton";
import { FormInput, FormSelect } from "@/utils/formUtil";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCreateBookingVM } from "./CreateBookingPage.vm";
import { motion } from "motion/react";
import { BookingRequestStatus, type BookingRequest } from "@/types";
import { Calendar } from "@/components/ui/calendar";
import { vi } from "date-fns/locale/vi";
import { format } from "date-fns";
import { bookingStatusConverter } from "@/utils/converter";

export default function CreateBookingPage() {
    const { form, consultationTypes, timeSlots, onSubmit } = useCreateBookingVM();
    return (
        <main>
            <BackButton />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 md:p-8 border border-border/50 shadow-lg">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Tạo lịch tư vấn mới
                        </h2>
                        <p className="text-base text-muted-foreground">
                            Vui lòng điền đầy đủ thông tin bên dưới để tạo lịch tư vấn mới cho
                            khách hàng.
                        </p>
                    </div>
                    <Form {...form}>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput<BookingRequest> title="Khách hàng" 
                                    placeholder="Nhập tên khách hàng"
                                    name="name" />

                                <FormInput<BookingRequest> title="Số điện thoại" 
                                    placeholder="Nhập số điện thoại của khách hàng"
                                    name="phone" />
                            </div>

                            <FormInput <BookingRequest>
                                placeholder="Nhập email của khách hàng"
                                title="Email" 
                                name="email" />

                            <div className="space-y-2">
                                <FormField
                                    name="type"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-blue-900 font-bold text-lg">
                                                <FileText className="w-5 h-5 text-blue-600" />
                                                Loại tư vấn
                                                <Info
                                                    className="w-4 h-4 text-blue-400 cursor-pointer"
                                                />
                                            </FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={(value) => field.onChange(value)}
                                                    value={field.value}
                                                    className="space-y-4"
                                                >
                                                    {consultationTypes.map((type, index) => {
                                                        const Icon = type.icon;
                                                        return (
                                                            <motion.div
                                                                key={type.value}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: index * 0.1 }}
                                                                whileHover={{ scale: 1.02, x: 8 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                className={`relative flex items-center space-x-4 p-5 rounded-xl border-2 cursor-pointer ${type.color} ${form.watch("type") === type.value
                                                                        ? "border-blue-600 bg-blue-100 ring-2 ring-blue-200 shadow-lg"
                                                                        : ""
                                                                    }`}
                                                            >
                                                                <RadioGroupItem
                                                                    value={type.value}
                                                                    id={type.value}
                                                                    className="border-blue-400 transition-none"
                                                                />
                                                                <Label
                                                                    htmlFor={type.value}
                                                                    className="flex items-center gap-3 cursor-pointer flex-1"
                                                                >
                                                                    <div
                                                                        className={`p-3 rounded-lg ${form.watch("type") === type.value
                                                                                ? "bg-blue-600"
                                                                                : "bg-blue-200"
                                                                            }`}
                                                                    >
                                                                        <Icon
                                                                            className={`w-6 h-6 ${form.watch("type") === type.value
                                                                                    ? "text-white"
                                                                                    : "text-blue-700"
                                                                                }`}
                                                                        />
                                                                    </div>
                                                                    <span className="text-blue-900 font-semibold text-lg">
                                                                        {type.label}
                                                                    </span>
                                                                </Label>
                                                                {form.watch("type") === type.value && (
                                                                    <motion.div
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        className="absolute right-5"
                                                                    >
                                                                        <CheckCircle2 className="w-6 h-6 text-blue-600" />
                                                                    </motion.div>
                                                                )}
                                                            </motion.div>
                                                        );
                                                    })}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {form.watch("type") === "OTHER" && (
                                    <FormInput<BookingRequest>
                                        title="Loại tư vấn khác"
                                        name="note"
                                    />
                                )}
                            </div>

                            <FormField
                                name="date"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="space-y-4"
                                        >
                                            <div className="flex items-center gap-2">
                                                <CalendarIcon className="w-5 h-5 text-blue-600" />
                                                <Label className="text-blue-900 font-bold text-lg">
                                                    Chọn ngày
                                                </Label>
                                            </div>
                                            <div className="flex justify-center bg-blue-50 p-6 rounded-xl border-2 border-blue-100">
                                                <FormControl>
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            field.value ? new Date(field.value) : undefined
                                                        }
                                                        onSelect={(date) => {
                                                            if (!date) return;
                                                            const isoLocal =
                                                                date.getFullYear() +
                                                                "-" +
                                                                String(date.getMonth() + 1).padStart(2, "0") +
                                                                "-" +
                                                                String(date.getDate()).padStart(2, "0");

                                                            field.onChange(isoLocal);
                                                        }}
                                                        locale={vi}
                                                        disabled={(date) => date < new Date()}
                                                        className="rounded-lg border-none"
                                                        classNames={{
                                                            day_selected:
                                                                "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white",
                                                            day_today: "bg-blue-100 text-blue-900 font-bold",
                                                        }}
                                                    />
                                                </FormControl>
                                            </div>
                                        </motion.div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {form.watch("date") && (
                                <FormField
                                    name="time"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="space-y-4"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-5 h-5 text-blue-600" />
                                                    <Label className="text-blue-900 font-bold text-lg">
                                                        Chọn khung giờ -{" "}
                                                        {format(form.watch("date"), "EEEE, dd/MM/yyyy", {
                                                            locale: vi,
                                                        })}
                                                    </Label>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {timeSlots.map((time, index) => (
                                                        <motion.button
                                                            key={time}
                                                            type="button"
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            whileHover={{ scale: 1.05, y: -2 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => field.onChange(time)}
                                                            className={`relative py-4 px-6 rounded-xl font-semibold text-lg transition-all ${form.watch("time") === time
                                                                    ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl ring-4 ring-blue-200"
                                                                    : "bg-white text-blue-700 hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400 shadow-md"
                                                                }`}
                                                        >
                                                            <Clock
                                                                className={`w-4 h-4 inline mr-2 ${form.watch("time") === time
                                                                        ? "text-white"
                                                                        : "text-blue-600"
                                                                    }`}
                                                            />
                                                            {time}
                                                            {form.watch("time") === time && (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                                                </motion.div>
                                                            )}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormSelect<BookingRequest> 
                                title="Trạng thái"
                                name="status"
                                options={
                                    Object.values(
                                        BookingRequestStatus
                                    ).map((status) => ({
                                        key: status,
                                        render: bookingStatusConverter(status),
                                    }))
                                }
                            />

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                <MotionButton
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                    onClick={() => form.handleSubmit(onSubmit)()}
                                    className="flex-1 text-xl h-12 rounded-2xl transition-none"
                                    size="lg"
                                >
                                    Tạo Lịch
                                </MotionButton>
                                <MotionButton
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                    variant="outline"
                                    className="flex-1 text-xl h-12 rounded-2xl transition-none"
                                    size="lg"
                                    onClick={() => form.reset()}
                                >
                                    Hủy Bỏ
                                </MotionButton>
                            </div>
                        </div>
                    </Form>
                </Card>
            </div>
        </main>
    );
}
