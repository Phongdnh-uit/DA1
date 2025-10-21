import { cn } from "@/lib/utils";
import { Dropzone, DropzoneEmptyState } from "../ui/shadcn-io/dropzone";
import { PlusIcon } from "lucide-react";
import type { Accept } from "react-dropzone";
import { toast } from "react-toastify";

const UploadIcon = ({ className }: { className: string }) => (
    <div className={cn(className)}>
        <svg
            className="mx-auto size-full text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
        >
            <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></path>
        </svg>
    </div>
);

interface UploadProps {
    className?: string;
    isMinimal?: boolean;
    accept?: Accept;
    onUpload?: (files: File[]) => void;
    isSingle?: boolean;
}

export default function Upload({ className, isMinimal, accept, onUpload , isSingle}: UploadProps) {
    return (
        <Dropzone
            className={cn(
                "h-48 rounded-md border-2 border-dashed border-gray-300 bg-gray-50",
                className,
            )}
            accept={accept || { "image/*": [".png", ".jpg", ".jpeg"] }}
            onDrop={(files) => {
                if (files.length > 0) {
                    if(isSingle && files.length > 1) {
                        toast.error("Chỉ được tải lên một tệp tin.");
                        return;
                    }
                    onUpload?.(files);
                }
            }}
            onError={(err) => {
                toast.error(err.message);
            }}
        >
            <DropzoneEmptyState>
                {!isMinimal ? (
                    <div className="h-full w-full flex flex-col items-center justify-center cursor-pointer">
                        <UploadIcon className="size-14" />
                        <span className="mt-2 block text-sm font-semibold text-gray-600">
                            Nhấn để tải lên
                        </span>
                        <span className="mt-1 block text-xs text-gray-500">
                            hoặc kéo thả ảnh vào đây
                        </span>
                    </div>
                ) : (
                    <PlusIcon className="size-10 text-gray-400" />
                )}
            </DropzoneEmptyState>
        </Dropzone>
    );
}
