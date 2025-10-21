import type { UploadSignatureResponse } from "@/types";
import axios, { AxiosError } from "axios";
import imageCompression from "browser-image-compression";

const compressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1440,
    useWebWorker: true,
};

export const upload = async (
    file: File,
    signatureData: UploadSignatureResponse,
) => {
    try {
        // --- BƯỚC NÉN ẢNH ---
        const canBeConverted = ["image/jpeg", "image/png"].includes(file.type);
        let fileToUpload = file;
        if (file.type.startsWith("image/")) {
            try {
                const compressedFile = await imageCompression(file, {
                    ...compressionOptions,
                    fileType: canBeConverted ? "image/webp" : file.type,
                });
                fileToUpload = compressedFile;
            } catch (compressionError) {
                console.error("Image compression failed:", compressionError);
            }
        }

        // --- BƯỚC TẠO FORMDATA ---
        const formData = new FormData();
        formData.append("file", fileToUpload);
        formData.append("api_key", signatureData.apiKey || "");
        formData.append("signature", signatureData.signature || "");
        formData.append("timestamp", signatureData.timestamp || "");
        formData.append("public_id", signatureData.publicId || "");
        formData.append("transformation", "w_1024,h_1024,c_fill,q_auto,f_auto");
        if (signatureData.tags) {
            formData.append("tags", signatureData.tags.join(","));
        }

        // --- BƯỚC GỌI API UPLOAD ---
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/upload`,
            formData,
        );

        return response.data;
    } catch (err) {
        let errorMessage = "Upload thất bại. Vui lòng thử lại.";
        if (axios.isAxiosError(err)) {
            const axiosError = err as AxiosError<{ error: { message: string } }>;
            errorMessage = axiosError.response?.data?.error?.message || errorMessage;
        }
        throw new Error(errorMessage);
    }
};
