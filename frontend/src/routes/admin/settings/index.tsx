import { queryClient } from "@/lib/queryClient";
import { CarouselSetting } from "@/pages/admin/settings/CarouselSetting";
import { getGetCarouselsQueryOptions } from "@/services/content-block/content-block";
import { getDownloadSignedUrl } from "@/services/file/file";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings/")({
    loader: async () => {
        const carousel = await queryClient.ensureQueryData(
            getGetCarouselsQueryOptions(),
        );
        const imageUrls = await Promise.all(
            (carousel?.data || []).map((ctBlock) =>
                getDownloadSignedUrl({
                    objectKey: ctBlock.file?.objectName as string,
                    options: "rs:fill:1600:900:0/g:sm",
                }),
            ),
        );
        return { carousel, imageUrls };
    },
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div>
            <CarouselSetting />
        </div>
    );
}
