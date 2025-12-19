import {
    FileArchive,
    FileIcon,
    FileSpreadsheet,
    FileText,
    ImageIcon,
    Video,
} from "lucide-react";

export const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();

    if (!ext) return <FileIcon className="h-5 w-5" />;

    if (["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"].includes(ext)) {
        return <ImageIcon className="h-5 w-5" />;
    }

    if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) {
        return <Video className="h-5 w-5" />;
    }

    if (["pdf", "doc", "docx", "txt", "rtf"].includes(ext)) {
        return <FileText className="h-5 w-5" />;
    }

    if (["xls", "xlsx", "csv"].includes(ext)) {
        return <FileSpreadsheet className="h-5 w-5" />;
    }

    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
        return <FileArchive className="h-5 w-5" />;
    }

    return <FileIcon className="h-5 w-5" />;
};
