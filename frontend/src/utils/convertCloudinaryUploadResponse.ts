import type { CloudinaryUploadResponse } from "@/lib/cloudinaryResponse";
import type {
    UploadConfirmRequest,
    UploadConfirmRequestPurpose,
} from "@/types";

export const convertCloudinaryUploadResponse = (
    response: CloudinaryUploadResponse,
    purpose: UploadConfirmRequestPurpose,
): UploadConfirmRequest => {
    return {
        publicId: response.public_id,
        version: response.version,
        signature: response.signature,
        secureUrl: response.secure_url,
        width: response.width,
        height: response.height,
        format: response.format,
        resourceType: response.resource_type,
        bytes: response.bytes,
        purpose: purpose,
    };
};
