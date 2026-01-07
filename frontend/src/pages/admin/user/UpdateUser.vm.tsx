import { useFindUserById, useUpdateUser } from "@/services/user/user";
import type { UserRequest } from "@/types/userRequest";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { ApiResponseVoid } from "@/types/apiResponseVoid";
import { useFindAllRole } from "@/services/role/role";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserBody } from "@/services/user/user.zod";
import { Route } from "@/routes/admin/user/update.$id";

export const useUpdateUserVM = () => {
    const { id } = Route.useParams();
    const user = useFindUserById(Number(id));
    const form = useForm<UserRequest>({
        defaultValues: {
            fullName: user.data?.data?.fullName,
            email: user.data?.data?.email,
            phone: user.data?.data?.phone,
            password: "********",
            emailVerified: user.data?.data?.emailVerified,
            phoneVerified: user.data?.data?.phoneVerified,
            roleId: user.data?.data?.roleId,
            status: user.data?.data?.status,
        },
        mode: "onSubmit",
        resolver: zodResolver(updateUserBody),
    });
    const roles = useFindAllRole().data?.data?.content || [];
    const mutation = useUpdateUser({
        mutation: {
            onSuccess: (data) => {
                toast.success("Cập nhật người dùng thành công"); 
                form.reset(data.data);
            },
            onError: (error) => {
                toast.error("Cập nhật người dùng thất bại");
                const err = error.response?.data as ApiResponseVoid;
                const errors = err?.errors ?? {};
                Object.entries(errors).forEach(([key, message]) => {
                    form.setError(key as keyof UserRequest, {
                        message,
                    });
                });
            },
        },
    });
    const onSubmit = (data: UserRequest) => {
        mutation.mutate({ id: Number(id), data });
    };
    return {
        form,
        onSubmit,
        roles,
    };
};
