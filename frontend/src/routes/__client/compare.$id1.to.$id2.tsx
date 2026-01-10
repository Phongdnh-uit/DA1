import { queryClient } from "@/lib/queryClient";
import { PropertyComparison } from "@/pages/client/comparison/PropertyComparison";
import { getDownloadSignedUrl } from "@/services/file/file";
import { getFindPropertyByIdQueryOptions } from "@/services/property/property";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__client/compare/$id1/to/$id2")({
    beforeLoad: async ({ params }) => {
        if (params.id1 === params.id2) {
            throw new Response("Cannot compare the same property", { status: 400 });
        }
        if (isNaN(Number(params.id1)) || isNaN(Number(params.id2))) {
            throw new Response("Invalid property ID", { status: 400 });
        }
    },
    loader: async ({ params }) => {
        const property1 = await queryClient.ensureQueryData(
            getFindPropertyByIdQueryOptions(+params.id1),
        );

        const property2 = await queryClient.ensureQueryData(
            getFindPropertyByIdQueryOptions(+params.id2),
        );
        const thumbnailUrl1 = await getDownloadSignedUrl({
            objectKey: property1?.data?.thumbnail?.objectName as string,
        });
        const thumbnailUrl2 = await getDownloadSignedUrl({
            objectKey: property2?.data?.thumbnail?.objectName as string,
        });
        return {
            property1: {
                ...property1,
                thumbnailUrl: thumbnailUrl1,
            },
            property2: {
                ...property2,
                thumbnailUrl: thumbnailUrl2,
            },
        };
    },
    component: RouteComponent,
});

function RouteComponent() {
    return <PropertyComparison />;
}
