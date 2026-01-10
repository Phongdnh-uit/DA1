import { motion } from "framer-motion";
import { Route } from "@/routes/admin/user/detail.$id";
import { BackButton } from "@/components/general/BackButton";
import { UserProfileCard } from "./components/UserProfileCard";
import { ContactInfoCard } from "./components/ContactInfoCard";
import { SystemInfoCard } from "./components/SystemInfoCard";

export function UserDetailPage() {
    const { userDetail } = Route.useLoaderData();
    const user = userDetail.data;
    return (
        <div className="min-h-screen">
            <BackButton />
            <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-8">
                <div className="flex flex-col max-w-[1200px] flex-1 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="flex flex-wrap justify-between items-center gap-4 px-4"
                    >
                        <div className="flex flex-col gap-1">
                            <h1 className="text-foreground text-3xl font-black leading-tight tracking-tight">
                                Chi tiết người dùng
                            </h1>
                            <p className="text-muted-foreground text-base font-normal leading-normal">
                                Quản lý thông tin người dùng trong hệ thống
                            </p>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4">
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            <UserProfileCard user={user} />
                        </div>
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            <ContactInfoCard user={user} />
                            <SystemInfoCard user={user} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
