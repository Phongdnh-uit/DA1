import { queryClient } from "@/lib/queryClient";
import PropertyDetailPage from "@/pages/client/property/DetailPage";
import { getDownloadSignedUrl } from "@/services/file/file";
import { getFindPropertyByIdQueryOptions } from "@/services/property/property";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/__client/detail/$id")({
    beforeLoad: async ({ params }) => {
        if (isNaN(+params.id)) {
            throw notFound();
        }
    },
    loader: async ({ params }) => {
        const id = +params.id;
        const property = await queryClient.ensureQueryData(
            getFindPropertyByIdQueryOptions(id),
        );
        const thumbnailUrl = await getDownloadSignedUrl({
            objectKey: property?.data?.thumbnail?.objectName as string,
            options: "rs:fit:1600:900:0/g:sm",
        });
        const galleryUrls = await Promise.all(
            (property?.data?.galleries || []).map((file) =>
                getDownloadSignedUrl({
                    objectKey: file.objectName as string,
                    options: "rs:fit:1600:900:0/g:sm",
                }),
            ),
        );
        return { property, galleryUrls, thumbnailUrl };
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <PropertyDetailPage />;
}
