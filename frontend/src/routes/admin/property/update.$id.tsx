import { queryClient } from "@/lib/queryClient";
import { UpdatePropertyPage } from "@/pages/admin/property/UpdatePropertyPage";
import { getDownloadSignedUrl } from "@/services/file/file";
import { getFindPropertyByIdQueryOptions } from "@/services/property/property";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/property/update/$id")({
    beforeLoad: async ({ params }) => {
        if (isNaN(Number(params.id))) {
            throw notFound();
        }
    },
    loader: async ({ params }) => {
        const property = await queryClient.ensureQueryData(
            getFindPropertyByIdQueryOptions(+params.id),
        );
        const thumbnailUrl = await getDownloadSignedUrl(
            {
                objectKey: property?.data?.thumbnail?.objectName as string,
                options: "rs:fill:300:300:0/g:sm",
            }
        );
        const galleryUrls = await Promise.all(
            (property?.data?.galleries || []).map((file) =>
                getDownloadSignedUrl({
                    objectKey: file.objectName as string,
                    options: "rs:fill:300:300:0/g:sm",
                }),
            ),
        );
        return {
            property,
            thumbnailUrl,
            galleryUrls,
        };
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <UpdatePropertyPage />;
}
