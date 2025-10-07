import { useCreateUser } from "@/services/user/user";
import type { UserRequest } from "@/types/userRequest";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { ApiResponseVoid } from "@/types/apiResponseVoid";
import { useFindAllRole } from "@/services/role/role";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserBody } from "@/services/user/user.zod";

export const useCreateUserVM = () => {
    const form = useForm<UserRequest>({
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            password: "",
            emailVerified: false,
            phoneVerified: false,
            roleId: undefined,
            status: "ACTIVE",
        },
        mode: "onBlur",
        resolver: zodResolver(createUserBody),
    });
    const roles = useFindAllRole().data?.data?.content || [];
    const mutation = useCreateUser({
        mutation: {
            onSuccess: () => {
                toast.success("User created successfully");
                form.reset();
            },
            onError: (error) => {
                const err = error.response?.data as ApiResponseVoid;
                const errors = err?.errors ?? {};

                Object.entries(errors).forEach(([key, message]) => {
                    form.setError(key as keyof UserRequest, { message });
                });
            },
        },
    });
    const onSubmit = (data: UserRequest) => {
        mutation.mutate({ data });
    };
    return {
        form,
        onSubmit,
        roles,
    };
};
