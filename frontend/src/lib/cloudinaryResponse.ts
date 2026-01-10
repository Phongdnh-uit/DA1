export type CloudinaryUploadResponse = {
    public_id: string;
    version: number;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: "image" | "video" | "raw" | "auto";
    created_at: string;
    tags: string[];
    bytes: number;
    url: string;
    secure_url: string;
    asset_id: string;
    original_filename: string;
    eager?: {
        transformation: string;
        width: number;
        height: number;
        bytes: number;
        format: string;
        url: string;
        secure_url: string;
    }[];

    placeholder?: boolean | string;

    colors?: [string, number][];

    image_metadata?: Record<string, unknown>;

    moderation?: unknown[];
};
