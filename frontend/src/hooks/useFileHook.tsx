import {
    useGetDownloadSignedUrl,
    useGetUploadSignedUrl,
} from "@/services/file/file";
import type {
    PresignedUploadRequestPurpose,
    PresignedUploadResponse,
} from "@/types";
import axios, { type AxiosProgressEvent } from "axios";
import { toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";

type UploadOptions = {
    onProgress?: (percent: number) => void;
};

export const useFileUpload = () => {
    const uploadFileSigned = useGetUploadSignedUrl({});

    const calcTimeout = (file: File) => {
        const sizeMB = file.size / 1024 / 1024;

        if (sizeMB < 10) return 30_000;
        if (sizeMB < 100) return 120_000;
        return 300_000; // file lớn
    };

    const uploadFile = useCallback(
        async (
            file: File,
            purpose: PresignedUploadRequestPurpose,
            options?: UploadOptions,
        ): Promise<PresignedUploadResponse> => {
            if (!file) {
                throw new Error("File không hợp lệ");
            }

            if (file.size === 0) {
                throw new Error("File rỗng");
            }

            try {
                const signedUploadUrlResponse = await uploadFileSigned.mutateAsync({
                    data: {
                        contentType: file.type,
                        originalName: file.name,
                        purpose,
                    },
                });

                if (
                    !signedUploadUrlResponse.data ||
                    !signedUploadUrlResponse.data.presignedURL?.url
                ) {
                    throw new Error("Không nhận được URL upload.");
                }

                const { url } = signedUploadUrlResponse.data.presignedURL;

                const response = await axios.put(url, file, {
                    headers: {
                        "Content-Type": file.type,
                    },
                    timeout: calcTimeout(file),
                    onUploadProgress: (event: AxiosProgressEvent) => {
                        if (!event.total) return;
                        const percent = Math.round((event.loaded / event.total) * 100);
                        options?.onProgress?.(percent);
                    },
                });

                if (response.status >= 300 || response.status < 200) {
                    throw new Error("Upload file thất bại.");
                }

                toast.success("Tải lên thành công.");

                return signedUploadUrlResponse.data;
            } catch (error) {
                toast.error("Tải file lên thất bại.");
                throw error;
            }
        },
        [uploadFileSigned],
    );

    return {
        uploadFile,
    };
};

export const useFileDownload = () => {
    const mutation = useGetDownloadSignedUrl();

    const download = async (objectKey: string) => {
        const url = await mutation.mutateAsync({
            data: {
                objectKey,
            },
        });
        window.open(url.data?.url, "_blank");
    };

    return {
        download,
    };
};

export const useFilePreview = (objectKey?: string, options?: string) => {
    const [url, setUrl] = useState<string | null>(null);
    const mutation = useGetDownloadSignedUrl();

    useEffect(() => {
        if (!objectKey) return;

        mutation.mutate(
            { data: { objectKey, options: options } },
            {
                onSuccess: (res) => {
                    setUrl(res.data?.url ?? null);
                },
            },
        );
    }, [objectKey]);

    return { url };
};
