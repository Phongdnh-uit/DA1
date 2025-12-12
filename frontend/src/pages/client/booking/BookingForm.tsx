import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    CalendarIcon,
    FileText,
    Clock,
    User,
    Phone,
    Mail,
    CheckCircle2,
    Building2,
    HomeIcon,
    Building2Icon,
    FileTextIcon,
    InfoIcon,
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { BookingRequest, BookingRequestType } from "@/types";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { useCreateBooking } from "@/services/booking/booking";
import { toast } from "react-toastify";
import { useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBookingBody } from "@/services/booking/booking.zod";

const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

const consultationTypes = [
    {
        value: "BUY_ADVICE",
        label: "Tư vấn mua nhà",
        icon: HomeIcon,
        color: "bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100",
    },
    {
        value: "SELL_ADVICE",
        label: "Tư vấn bán bất động sản",
        icon: Building2Icon,
        color: "bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100",
    },
    {
        value: "LEGAL_ADVICE",
        label: "Tư vấn pháp lý",
        icon: FileTextIcon,
        color: "bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100",
    },
    {
        value: "OTHER",
        label: "Khác",
        icon: InfoIcon,
        color: "bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100",
    },
] as {
    value: BookingRequestType;
    label: string;
    icon: React.ComponentType<unknown>;
    color: string;
}[];

export function BookingForm() {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const createBooking = useCreateBooking({
        mutation: {
            onSuccess: () => {
                toast.success("Đặt lịch tư vấn thành công!");
                form.reset();
                navigate({ to: "/" });
            },
            onError: (error) => {
                console.log("Error creating booking:", error);
                toast.error(`Đặt lịch tư vấn thất bại.Vui lòng thử lại sau.`);
            },
        },
    });

    const form = useForm<BookingRequest>({
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            type: undefined,
            note: "",
            date: undefined,
            time: undefined,
            status: "PENDING",
        },
        mode: "onBlur",
        resolver: zodResolver(createBookingBody),
    });

    const onSubmit = (data: BookingRequest) => {
        createBooking.mutate({ data });
    };

    const isStepValid = () => {
        if (step === 1) {
            return (
                form.watch("name")?.trim() !== "" &&
                form.watch("phone")?.trim() !== "" &&
                form.getFieldState("name").invalid === false &&
                form.getFieldState("phone").invalid === false
            );
        }
        if (step === 2) {
            return (
                form.watch("type") !== undefined &&
                form.getFieldState("type").invalid === false &&
                (form.getValues("type") !== "OTHER" ||
                    form.watch("note")?.trim() !== "")
            );
        }
        if (step === 3) {
            return (
                form.watch("date") !== undefined &&
                form.watch("time") !== undefined &&
                form.getFieldState("date").invalid === false &&
                form.getFieldState("time").invalid === false
            );
        }
        return true;
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.3 },
        },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-block p-4 bg-blue-600 rounded-2xl mb-4 shadow-lg"
                    >
                        <Building2 className="w-10 h-10 text-white" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl font-bold text-blue-900 mb-2"
                    >
                        Đặt lịch tư vấn
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-blue-600"
                    >
                        Chúng tôi sẽ hỗ trợ bạn tìm được bất động sản phù hợp nhất
                    </motion.p>
                </div>

                <Card className="shadow-2xl border-0 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white pb-8">
                        <CardTitle className="text-2xl font-bold text-center mb-2">
                            Thông tin đặt lịch
                        </CardTitle>
                        <CardDescription className="text-blue-100 text-center">
                            Vui lòng điền đầy đủ thông tin để chúng tôi có thể phục vụ bạn tốt
                            nhất
                        </CardDescription>

                        <div className="flex justify-center items-center mt-6 gap-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center">
                                    <motion.div
                                        animate={{
                                            scale: i === step ? 1.1 : 1,
                                            backgroundColor:
                                                i < step
                                                    ? "rgb(34 197 94)"
                                                    : i === step
                                                        ? "rgb(255 255 255)"
                                                        : "rgb(147 197 253)",
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg ${i === step ? "text-blue-600" : "text-white"
                                            }`}
                                    >
                                        {i < step ? <CheckCircle2 className="w-6 h-6" /> : i}
                                    </motion.div>
                                    {i < 3 && (
                                        <div
                                            className={`w-12 h-1 mx-1 rounded transition-all duration-300 ${i < step ? "bg-green-400" : "bg-blue-300"
                                                }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center mt-4">
                            <Badge
                                variant="secondary"
                                className="bg-white/20 text-white border-0"
                            >
                                Bước {step} / 3
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8 md:p-10">
                        <Form {...form}>
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-blue-100">
                                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl w-12 h-12 flex items-center justify-center font-bold shadow-lg">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-blue-900">
                                                    Thông tin liên hệ
                                                </h3>
                                                <p className="text-sm text-blue-600">
                                                    Để chúng tôi có thể liên hệ với bạn
                                                </p>
                                            </div>
                                        </div>

                                        <FormField
                                            name="name"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.1 }}
                                                        className="space-y-2"
                                                    >
                                                        <Label
                                                            htmlFor="name"
                                                            className="text-blue-900 font-semibold flex items-center gap-2"
                                                        >
                                                            <User className="w-4 h-4 text-blue-600" />
                                                            Họ và tên <span className="text-red-500">*</span>
                                                        </Label>
                                                        <FormControl>
                                                            <Input
                                                                id="name"
                                                                placeholder="Nguyễn Văn A"
                                                                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                    </motion.div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            name="phone"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.2 }}
                                                        className="space-y-2"
                                                    >
                                                        <Label
                                                            htmlFor="phone"
                                                            className="text-blue-900 font-semibold flex items-center gap-2"
                                                        >
                                                            <Phone className="w-4 h-4 text-blue-600" />
                                                            Số điện thoại{" "}
                                                            <span className="text-red-500">*</span>
                                                        </Label>
                                                        <FormControl>
                                                            <Input
                                                                id="phone"
                                                                type="tel"
                                                                placeholder="0901234567"
                                                                {...field}
                                                                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                                                            />
                                                        </FormControl>
                                                    </motion.div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            name="email"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.3 }}
                                                        className="space-y-2"
                                                    >
                                                        <Label
                                                            htmlFor="email"
                                                            className="text-blue-900 font-semibold flex items-center gap-2"
                                                        >
                                                            <Mail className="w-4 h-4 text-blue-600" />
                                                            Email{" "}
                                                            <span className="text-blue-400 text-sm font-normal">
                                                                (tuỳ chọn)
                                                            </span>
                                                        </Label>
                                                        <FormControl>
                                                            <Input
                                                                id="email"
                                                                type="email"
                                                                placeholder="email@example.com"
                                                                {...field}
                                                                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                                                            />
                                                        </FormControl>
                                                    </motion.div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-blue-100">
                                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl w-12 h-12 flex items-center justify-center font-bold shadow-lg">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-blue-900">
                                                    Chọn loại tư vấn
                                                </h3>
                                                <p className="text-sm text-blue-600">
                                                    Bạn cần tư vấn về vấn đề gì?
                                                </p>
                                            </div>
                                        </div>

                                        <FormField
                                            name="type"
                                            control={form.control}
                                            render={({ field }) => (
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
                                            )}
                                        />

                                        {form.watch("type") === "OTHER" && (
                                            <FormField
                                                name="note"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="space-y-2 mt-4"
                                                        >
                                                            <Label className="text-blue-900 font-semibold">
                                                                Vui lòng ghi rõ loại tư vấn
                                                            </Label>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Nhập loại tư vấn bạn cần..."
                                                                    {...field}
                                                                    className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                                                                />
                                                            </FormControl>
                                                        </motion.div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-blue-100">
                                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl w-12 h-12 flex items-center justify-center font-bold shadow-lg">
                                                <CalendarIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-blue-900">
                                                    Chọn thời gian
                                                </h3>
                                                <p className="text-sm text-blue-600">
                                                    Chọn ngày và giờ phù hợp với bạn
                                                </p>
                                            </div>
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
                                                                        field.value
                                                                            ? new Date(field.value)
                                                                            : undefined
                                                                    }
                                                                    onSelect={(date) => {
                                                                        if (!date) return;
                                                                        const isoLocal =
                                                                            date.getFullYear() +
                                                                            "-" +
                                                                            String(date.getMonth() + 1).padStart(
                                                                                2,
                                                                                "0",
                                                                            ) +
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
                                                                        day_today:
                                                                            "bg-blue-100 text-blue-900 font-bold",
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
                                                                    {format(
                                                                        form.watch("date"),
                                                                        "EEEE, dd/MM/yyyy",
                                                                        {
                                                                            locale: vi,
                                                                        },
                                                                    )}
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
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex justify-between gap-4 mt-10 pt-8 border-t-2 border-blue-100"
                            >
                                {step > 1 ? (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setStep(step - 1)}
                                        className="px-8 py-6 text-base border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 font-semibold"
                                    >
                                        ← Quay lại
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate({ to: "/" })}
                                        className="px-8 py-6 text-base border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 font-semibold"
                                    >
                                        Hủy
                                    </Button>
                                )}

                                {step < 3 ? (
                                    <Button
                                        type="button"
                                        onClick={() => setStep(step + 1)}
                                        disabled={!isStepValid()}
                                        className="px-8 py-6 text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Tiếp theo →
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() =>
                                            form.handleSubmit(onSubmit, (e) => {
                                                console.log("Form errors:", e);
                                            })()
                                        }
                                        type="button"
                                        disabled={!isStepValid()}
                                        className="px-8 py-6 text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <CheckCircle2 className="w-5 h-5 mr-2" />
                                        Đặt lịch ngay
                                    </Button>
                                )}
                            </motion.div>
                        </Form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
