import { Card } from "@/components/ui/card";
import Upload from "@/components/general/Upload";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFileDownload } from "@/hooks/useFileHook";
import type { FileResponse } from "@/types";
import { getFileIcon } from "@/utils/renderUtil";
import SpiralLoader from "@/components/ui/SpiralLoader";
import { Badge } from "@/components/ui/badge";

interface DocumentUploadProps {
    documents: FileResponse[];
    onDocumentAdd: (file: File) => void;
    onDocumentRemove: (index: number) => void;
}

export const DocumentUpload = ({
    documents,
    onDocumentAdd,
    onDocumentRemove,
}: DocumentUploadProps) => {
    // const formatFileSize = (bytes?: number): string => {
    //     if (!bytes || bytes === 0) return "0 Bytes";
    //     const k = 1024;
    //     const sizes = ["Bytes", "KB", "MB", "GB"];
    //     const i = Math.floor(Math.log(bytes) / Math.log(k));
    //     return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    // };
    //
    const { download } = useFileDownload();

    return (
        <Card className="p-6 rounded-[24px] w-full">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Tài liệu & Hồ sơ
                </h2>
                <p className="text-gray-500">
                    Tải lên các giấy tờ pháp lý, sổ hồng, giấy phép xây dựng, v.v...
                </p>
            </div>

            <div className="space-y-4">
                {documents.length > 0 && (
                    <div className="space-y-3">
                        {documents.map((doc, index) => (
                            <div
                                key={index}
                                className="relative flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 transition-colors"
                            >
                                <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    {getFileIcon(doc.originalName || "")}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {doc.originalName || "Tài liệu"}
                                    </p>
                                    {/* {doc.size && ( */}
                                    {/*     <p className="text-sm text-gray-500 dark:text-gray-400"> */}
                                    {/*         {formatFileSize(doc.size)} */}
                                    {/*     </p> */}
                                    {/* )} */}
                                    <Badge
                                        className={
                                            doc.status === "PENDING"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : doc.status === "REJECTED"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-green-100 text-green-800"
                                        }
                                    >
                                        {doc.status === "PENDING"
                                            ? "Đang chờ hệ thống kiểm tra"
                                            : doc.status === "REJECTED"
                                                ? "Bị từ chối do tiềm ẩn rủi ro"
                                                : "An toàn và được chấp nhận"}
                                    </Badge>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => download(doc.objectName as string)}
                                    className="flex-shrink-0"
                                >
                                    <Download className="size-5 text-gray-600" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onDocumentRemove(index)}
                                    className="flex-shrink-0 hover:bg-red-100 hover:text-red-600"
                                >
                                    <X className="size-5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                <Upload
                    name="documents"
                    onUpload={(files) => onDocumentAdd(files[0])}
                    isSingle={true}
                    accept={{
                        "application/*": [".pdf", ".doc", ".docx", ".txt", ".csv"],
                        "image/*": [".jpg", ".jpeg", ".png"],
                        "video/*": [".mp4", ".mov"],
                    }}
                />

                <p className="text-sm text-gray-500 text-center">
                    Hỗ trợ: PDF, DOC, DOCX, TXT, CSV, JPG, PNG, MP4, MOV (Tối đa 10MB)
                </p>
            </div>
        </Card>
    );
};
