import { useCallback } from "react";
import { AlertCircle, CheckCircle2, Circle, ShieldCheck } from "lucide-react";
import { ACCESSIBLE_MODULES } from "@/constant/AccessibleModule";

interface ModuleManageProps {
    value: string[];
    onChange: (newValue: string[]) => void;
}

export function ModuleManage({ value, onChange }: ModuleManageProps) {
    // Tối ưu hàm xử lý logic để tránh tạo lại hàm khi re-render
    const toggleModule = useCallback(
        (code: string) => {
            const newValue = value.includes(code)
                ? value.filter((item) => item !== code)
                : [...value, code];
            onChange(newValue);
        },
        [value, onChange],
    );

    const isAllSelected = value.length === ACCESSIBLE_MODULES.length;

    const handleSelectAll = () => {
        onChange(isAllSelected ? [] : ACCESSIBLE_MODULES.map((m) => m.code));
    };

    return (
        <div className="max-w-4xl mx-auto p-6 animate-in fade-in duration-500 pt-0 px-2">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Header Section */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6 text-blue-500" />
                            Quản lý Module
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Chọn các trang mà bạn muốn vai trò có thể truy cập.
                        </p>
                    </div>
                    <button
                        onClick={handleSelectAll}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        {isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                    </button>
                </div>

                <div className="m-4 flex gap-4 p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl shadow-sm">
                    {/* Icon làm điểm nhấn thị giác */}
                    <div className="flex-shrink-0">
                        <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>

                    {/* Nội dung thông báo */}
                    <div className="space-y-1">
                        <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                            Lưu ý quan trọng
                        </h4>
                        <p className="text-sm leading-relaxed text-amber-800 dark:text-amber-300">
                            Các lựa chọn này{" "}
                            <span className="font-semibold underline">
                                chỉ ảnh hưởng đến giao diện
                            </span>{" "}
                            quản trị, không tác động đến hệ thống phân quyền (Permissions).
                            Hãy cân nhắc kỹ để tối ưu hóa trải nghiệm người dùng.
                        </p>
                    </div>
                </div>
                {/* List Section */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ACCESSIBLE_MODULES.map((module) => {
                        const isSelected = value.includes(module.code);
                        return (
                            <label
                                key={module.code}
                                className={`
                  relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer
                  ${isSelected
                                        ? "border-blue-500 bg-blue-50/30 dark:bg-blue-900/10"
                                        : "border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                                    }
                `}
                            >
                                <div
                                    className={`p-2 rounded-lg ${isSelected ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-400"}`}
                                >
                                    {isSelected ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                        <Circle className="w-5 h-5" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <span
                                        className={`block font-semibold ${isSelected ? "text-blue-900 dark:text-blue-100" : "text-gray-700 dark:text-gray-300"}`}
                                    >
                                        {module.title}
                                    </span>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">
                                        {module.code}
                                    </span>
                                </div>

                                <input
                                    type="checkbox"
                                    className="hidden" // Ẩn checkbox mặc định để dùng UI tùy chỉnh bên trên
                                    checked={isSelected}
                                    onChange={() => toggleModule(module.code)}
                                />
                            </label>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
