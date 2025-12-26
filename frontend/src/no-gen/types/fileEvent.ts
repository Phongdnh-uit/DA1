import type { FileResponseStatus } from "@/types";

export type FileEvent = {
    status?: FileResponseStatus;
    url?: string;
};
