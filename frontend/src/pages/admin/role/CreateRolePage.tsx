import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, ChevronDown } from "lucide-react";
import { useCreateRoleVM } from "./CreateRolePage.vm";
import { Form } from "@/components/ui/form";
import { FormCheckbox, FormInput } from "@/utils/formUtil";
import type { RoleRequest } from "@/types";
import { BackButton } from "@/components/general/BackButton";
import { MotionButton } from "@/components/customs/MotionButton";
import { ModuleManage } from "./components/ModuleManage";

export function CreateRolePage() {
    const {
        searchDebounced,
        onSubmit,
        form,
        groupedPermissions,
        togglePermission,
        toggleResourcePermission,
        flattenedPermissions,
        expandedResource,
        setExpandedResource,
    } = useCreateRoleVM();
    const selectedIds = form.watch("permissionIds") || [];
    return (
        <main>
            <BackButton />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 md:p-8 border border-border/50 shadow-lg">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Thiết Lập Vai Trò Mới
                        </h2>
                        <p className="text-base text-muted-foreground">
                            Cấp phát quyền hạn cho các nhóm người dùng.
                        </p>
                    </div>
                    <Form {...form}>
                        <div className="space-y-3">
                            {/* Role Name Input */}
                            <FormInput<RoleRequest>
                                title="Tên vai trò"
                                placeholder="Ví dụ: Quản lý bán hàng, Nhân viên hỗ trợ..."
                                name="name"
                            />
                            <FormInput<RoleRequest>
                                title="Mô tả vai trò"
                                type="textarea"
                                placeholder="Mô tả ngắn về vai trò này..."
                                name="description"
                            />
                            <div className="flex flex-col md:flex-row md:items-center md:gap-6 mt-2">
                                <FormCheckbox<RoleRequest>
                                    title="Mặc định cho người dùng mới"
                                    direction="row"
                                    name="default"
                                />
                                <FormCheckbox<RoleRequest>
                                    title="Cho phép quản trị"
                                    direction="row"
                                    name="canManage"
                                />
                            </div>
                        </div>
                    </Form>

                    {/* Permissions Section */}
                    <div className="space-y-4">
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-bold uppercase tracking-wider text-foreground/70">
                                    Danh sách quyền hạn{" "}
                                    <span className="text-destructive">*</span>
                                </Label>
                            </div>

                            <div className="relative input-field">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Tìm kiếm quyền (Ví dụ: xem, tạo, xóa...)"
                                    onChange={(e) => searchDebounced(e.target.value)}
                                    className="pl-10 h-11 bg-muted/30 border-none outline-none focus-visible:ring-0 w-full"
                                />
                            </div>

                            {/* Permissions List with Custom Scrollbar */}
                            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                                {Object.entries(groupedPermissions).length === 0 ? (
                                    <div className="text-center py-12 border-2 border-dashed rounded-xl italic text-muted-foreground">
                                        Không tìm thấy quyền nào phù hợp
                                    </div>
                                ) : (
                                    Object.entries(groupedPermissions).map(
                                        ([resource, permissions]) => {
                                            const isExpanded = expandedResource[resource] !== false;
                                            const allCategorySelected = permissions.every((p) =>
                                                selectedIds.includes(p.id as number),
                                            );

                                            return (
                                                <div
                                                    key={resource}
                                                    className="border border-border/40 rounded-xl overflow-hidden bg-background/50 shadow-sm transition-all hover:shadow-md"
                                                >
                                                    <div
                                                        onClick={() =>
                                                            setExpandedResource((prev) => ({
                                                                ...prev,
                                                                [resource]: !isExpanded,
                                                            }))
                                                        }
                                                        className="flex items-center justify-between px-4 py-3 cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className={`p-1 rounded-md transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"}`}
                                                            >
                                                                <ChevronDown className="w-4 h-4" />
                                                            </div>
                                                            <span className="font-bold text-sm uppercase tracking-tight">
                                                                {resource}
                                                            </span>
                                                            <span className="text-[10px] font-bold bg-background px-2 py-0.5 rounded-full border">
                                                                {permissions.length}
                                                            </span>
                                                        </div>
                                                        <Checkbox
                                                            checked={allCategorySelected}
                                                            onClick={(e) => e.stopPropagation()}
                                                            onCheckedChange={() =>
                                                                toggleResourcePermission(
                                                                    resource,
                                                                    allCategorySelected,
                                                                )
                                                            }
                                                            className="h-5 w-5 rounded-md"
                                                        />
                                                    </div>

                                                    {isExpanded && (
                                                        <div className="p-2 grid grid-cols-1 gap-1 animate-in fade-in slide-in-from-top-2">
                                                            {permissions.map((permission) => (
                                                                <div
                                                                    key={permission.id}
                                                                    onClick={() =>
                                                                        togglePermission(permission.id as number)
                                                                    }
                                                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 cursor-pointer group transition-all"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <Checkbox
                                                                            checked={selectedIds.includes(
                                                                                permission.id as number,
                                                                            )}
                                                                        />
                                                                        <span className="text-sm font-medium">
                                                                            {permission.name}
                                                                        </span>
                                                                    </div>
                                                                    <code className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        {permission.urlPattern}
                                                                    </code>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        },
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
                <div className="relative">
                    <ModuleManage
                        value={form.watch("accessibleModules") || []}
                        onChange={(newValue) => {
                            form.setValue("accessibleModules", newValue);
                        }}
                    />
                    <div className="space-y-6 sticky top-8 w-lg">
                        {/* Summary Card */}
                        <Card className="p-6 border-primary/20 bg-primary/[0.02] rounded-2xl overflow-hidden relative ">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Search size={100} />
                            </div>

                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        Quyền đã chọn
                                        <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                                            {selectedIds.length}
                                        </span>
                                    </h3>
                                    {selectedIds.length > 0 && (
                                        <button
                                            onClick={() => form.setValue("permissionIds", [])}
                                            className="text-xs text-destructive hover:underline font-medium"
                                        >
                                            Xóa tất cả
                                        </button>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pt-2">
                                    {selectedIds.length === 0 ? (
                                        <p className="text-sm text-muted-foreground italic">
                                            Chưa có quyền nào được chọn...
                                        </p>
                                    ) : (
                                        flattenedPermissions
                                            .filter((p) => selectedIds.includes(p.id as number))
                                            .map((p) => (
                                                <span
                                                    key={p.id}
                                                    className="bg-background border border-primary/20 text-primary text-[11px] px-3 py-1 rounded-full font-bold shadow-sm animate-in zoom-in-95"
                                                >
                                                    {p.name}
                                                </span>
                                            ))
                                    )}
                                </div>

                                <div className="pt-6 space-y-3 space-x-4">
                                    <MotionButton
                                        onClick={() => form.handleSubmit(onSubmit)()}
                                        className="w-full h-10 text-base font-bold shadow-lg shadow-primary/20 rounded-xl"
                                    >
                                        Tạo Vai Trò Ngay
                                    </MotionButton>
                                    <MotionButton
                                        variant="outline"
                                        className="w-full h-10 text-base font-medium border-dashed rounded-xl"
                                        onClick={() => form.reset()}
                                    >
                                        Hủy bỏ & Làm lại
                                    </MotionButton>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}
