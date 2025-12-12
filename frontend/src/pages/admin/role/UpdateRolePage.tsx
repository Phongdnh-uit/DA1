import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, ChevronDown } from "lucide-react";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/utils/formUtil";
import type { RoleRequest } from "@/types";
import { BackButton } from "@/components/general/BackButton";
import { MotionButton } from "@/components/general/MotionShadcn";
import { useUpdateRoleVM } from "./UpdateRolePage.vm";

export function UpdateRolePage() {
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
    } = useUpdateRoleVM();
    return (
        <main>
            <BackButton />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 md:p-8 border border-border/50 shadow-lg">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Cập nhật Vai Trò
                        </h2>
                        <p className="text-base text-muted-foreground">
                            Cập nhật thông tin vai trò và quyền truy cập của nó.
                        </p>
                    </div>
                    <Form {...form}>
                        <div className="space-y-3 mb-8">
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
                        </div>
                    </Form>

                    {/* Permissions Section */}
                    <div className="space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <Label className="text-sm font-semibold">
                                    Quyền truy cập <span className="text-destructive">*</span>
                                </Label>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Chọn quyền mà vai trò này sẽ có (
                                    {form.getValues().permissionIds?.length} đã chọn)
                                </p>
                            </div>
                            {Array.isArray(form.watch("permissionIds")) &&
                                form.watch("permissionIds")!.length > 0 && (
                                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                                        {form.getValues().permissionIds?.length} quyền
                                    </div>
                                )}
                        </div>

                        <div className="relative overflow-hidden input-field">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm quyền..."
                                onChange={(e) => searchDebounced(e.target.value)}
                                className="pl-10 h-10"
                            />
                        </div>

                        {/* Permissions List */}
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-3 border rounded-lg p-4 bg-muted/20">
                            {Object.entries(groupedPermissions).length === 0 ? (
                                <p className="text-center text-sm text-muted-foreground py-8">
                                    Không tìm thấy quyền nào
                                </p>
                            ) : (
                                Object.entries(groupedPermissions).map(
                                    ([resource, permissions]) => {
                                        const selectedPermissions =
                                            form.watch("permissionIds") || [];
                                        const isExpanded = expandedResource[resource] !== false;
                                        const allCategorySelected = permissions.every((p) =>
                                            selectedPermissions.includes(p.id as number),
                                        );
                                        {
                                            /* const someCategorySelected = permissions.some((p) => */
                                        }
                                        {
                                            /*     selectedPermissions.includes(p.id as number), */
                                        }
                                        {
                                            /* ); */
                                        }

                                        return (
                                            <div
                                                key={resource}
                                                className="border rounded-lg overflow-hidden bg-background"
                                            >
                                                <div
                                                    onClick={() =>
                                                        setExpandedResource((prev) => ({
                                                            ...prev,
                                                            [resource]: !isExpanded,
                                                        }))
                                                    }
                                                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors border-b group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <ChevronDown
                                                            className={`w-4 h-4 transition-transform ${isExpanded ? "" : "-rotate-90"}`}
                                                        />
                                                        <span className="font-semibold text-sm text-foreground">
                                                            {resource}
                                                        </span>
                                                        <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                                                            {permissions.length} quyền
                                                        </span>
                                                    </div>
                                                    <Checkbox
                                                        onClick={(e) => e.stopPropagation()}
                                                        onCheckedChange={() => {
                                                            toggleResourcePermission(
                                                                resource,
                                                                allCategorySelected,
                                                            );
                                                        }}
                                                        checked={allCategorySelected}
                                                    />
                                                </div>

                                                {isExpanded && (
                                                    <div className="space-y-2 p-3 bg-muted/10">
                                                        {permissions.map((permission) => (
                                                            <div
                                                                key={permission.id}
                                                                className="flex items-center gap-3 p-3 rounded-md hover:bg-accent/20 transition-colors cursor-pointer group"
                                                            >
                                                                <Checkbox
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    id={permission.id?.toString()}
                                                                    checked={form
                                                                        .watch("permissionIds")
                                                                        ?.includes(permission.id as number)}
                                                                    onCheckedChange={() =>
                                                                        togglePermission(permission.id as number)
                                                                    }
                                                                />

                                                                <Label
                                                                    htmlFor={permission.id?.toString()}
                                                                    className="text-sm font-normal cursor-pointer flex-1"
                                                                >
                                                                    {permission.name}
                                                                </Label>
                                                                <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    {permission.urlPattern}
                                                                </span>
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

                        {/* Permissions Summary */}
                        {Array.isArray(form.watch("permissionIds")) &&
                            form.watch("permissionIds")!.length > 0 && (
                                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                    <p className="text-sm text-primary font-medium mb-2">
                                        Đã chọn {form.getValues().permissionIds?.length} quyền
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {flattenedPermissions
                                            .filter((perm) =>
                                                form
                                                    .getValues()
                                                    .permissionIds?.includes(perm.id as number),
                                            )
                                            .map((perm) => (
                                                <span
                                                    key={perm.id}
                                                    className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium"
                                                >
                                                    {perm?.name}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3 pt-4">
                        <MotionButton
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            onClick={() => form.handleSubmit(onSubmit)()}
                            className="flex-1 text-xl h-12 rounded-2xl transition-none"
                            size="lg"
                        >
                            Cập Nhật Vai Trò
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
                </Card>
            </div>
        </main>
    );
}
