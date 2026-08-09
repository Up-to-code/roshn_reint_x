"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle, CheckCircle2, File, ImageIcon, Loader2, RefreshCw, Upload, Video, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { bucketForKind, mediaKind, uploadMedia, type MediaBucket } from "@/lib/media-storage/media-client";

type UploadStatus = "uploading" | "success" | "error";
type AcceptedKind = "image" | "video" | "all";

interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  url?: string;
  error?: string;
}

interface CustomUploaderProps {
  bucket?: MediaBucket;
  onUploadComplete?: (url: string) => void;
  onMultipleUploadComplete?: (urls: string[]) => void;
  className?: string;
  buttonText?: string;
  acceptedFileTypes?: AcceptedKind;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
}

const itemId = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

export function CustomUploader({
  bucket = "IMAGES",
  onUploadComplete,
  onMultipleUploadComplete,
  className = "",
  buttonText,
  acceptedFileTypes = "all",
  multiple = false,
  maxFiles = 10,
  maxSize,
}: CustomUploaderProps) {
  const t = useTranslations("uploader");
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const effectiveMaxSize = maxSize ?? (bucket === "VIDEOS" || acceptedFileTypes === "video" ? 100 : 10);
  const uploading = items.some(item => item.status === "uploading");

  const updateItem = (id: string, update: Partial<UploadItem>) => {
    setItems(current => current.map(item => item.id === id ? { ...item, ...update } : item));
  };

  const friendlyError = (error: unknown) => {
    const message = error instanceof Error ? error.message : t("errors.uploadFailed");
    if (message.includes("Bucket not found")) return t("messages.bucketNotConfigured");
    if (message.includes("RLS") || message.includes("row-level security")) return t("messages.permissionDenied");
    if (message.includes("Network error") || message.includes("Failed to fetch")) return t("messages.networkError");
    return message;
  };

  async function uploadOne(item: UploadItem): Promise<string | null> {
    updateItem(item.id, { status: "uploading", progress: 0, error: undefined });
    try {
      const kind = mediaKind(item.file);
      const targetBucket = bucket === "IMAGES" && kind !== "image" ? bucketForKind(kind) : bucket;
      const result = await uploadMedia(item.file, targetBucket, progress => updateItem(item.id, { progress }));
      updateItem(item.id, { status: "success", progress: 100, url: result.url });
      onUploadComplete?.(result.url);
      return result.url;
    } catch (error) {
      const message = friendlyError(error);
      updateItem(item.id, { status: "error", progress: 0, error: message });
      toast.error(`${t("errors.uploadFailed")}: ${item.file.name}`, { description: message });
      return null;
    }
  }

  async function retry(item: UploadItem) {
    const url = await uploadOne(item);
    if (url) {
      onMultipleUploadComplete?.([url]);
      toast.success(t("success.uploaded", { count: 1 }));
    }
  }

  function validate(files: File[]): UploadItem[] {
    const available = multiple ? Math.max(0, maxFiles - items.length) : 1;
    if (files.length > available) {
      const message = t("messages.maxFilesAllowed", { maxFiles, current: items.length, count: items.length });
      setValidationError(message);
      toast.error(t("errors.tooManyFiles"), { description: message });
      return [];
    }
    const valid: UploadItem[] = [];
    for (const file of files.slice(0, available)) {
      const kind = mediaKind(file);
      if (acceptedFileTypes !== "all" && kind !== acceptedFileTypes) {
        const message = t("messages.invalidFileType", { fileName: file.name, type: acceptedFileTypes });
        setValidationError(message);
        toast.error(t("errors.invalidFileType"), { description: message });
        continue;
      }
      if (file.size > effectiveMaxSize * 1024 * 1024) {
        const message = t("messages.fileTooLarge", { fileName: file.name, size: (file.size / 1024 / 1024).toFixed(2), maxSize: effectiveMaxSize });
        setValidationError(message);
        toast.error(t("errors.fileTooLarge"), { description: message });
        continue;
      }
      valid.push({ id: itemId(file), file, progress: 0, status: "uploading" });
    }
    return valid;
  }

  async function acceptFiles(fileList: FileList) {
    setValidationError(null);
    const next = validate(Array.from(fileList));
    if (!next.length) return;
    setItems(current => multiple ? [...current, ...next] : next);
    const urls = (await Promise.all(next.map(uploadOne))).filter((url): url is string => Boolean(url));
    if (urls.length) {
      onMultipleUploadComplete?.(urls);
      toast.success(t("success.uploaded", { count: urls.length }));
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  const accept = acceptedFileTypes === "image" ? "image/*" : acceptedFileTypes === "video" ? "video/*" : "*/*";
  const typeLabel = acceptedFileTypes === "all" ? t("types.files") : t(`types.${acceptedFileTypes}`);

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className={`border-2 border-dashed transition-colors ${dragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}`}>
        <CardContent
          className="flex flex-col items-center gap-3 p-6 text-center"
          onDragOver={event => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={event => { event.preventDefault(); setDragging(false); if (event.dataTransfer.files.length) void acceptFiles(event.dataTransfer.files); }}
        >
          <Upload className="size-7 text-primary" />
          <div><p className="font-medium">{t("dragAndDrop", { type: typeLabel })}</p><p className="text-sm text-muted-foreground">{t("orClickToBrowse")}</p></div>
          {multiple && <p className="text-xs text-muted-foreground">{t("upToFiles", { maxFiles, maxSize: effectiveMaxSize })}</p>}
          <Button type="button" disabled={uploading} onClick={() => inputRef.current?.click()}>
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {uploading ? t("uploading") : buttonText || t("uploadFiles")}
          </Button>
          <input ref={inputRef} hidden type="file" accept={accept} multiple={multiple} onChange={event => event.target.files && void acceptFiles(event.target.files)} />
        </CardContent>
      </Card>

      {validationError && <p className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="size-4" />{validationError}</p>}

      {items.length > 0 && (
        <Card><CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between"><p className="font-medium">{t("files")} ({items.filter(item => item.status === "success").length}/{items.length})</p><Button type="button" variant="ghost" size="sm" disabled={uploading} onClick={() => setItems([])}>{t("clearAll")}</Button></div>
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3 rounded-md border p-3">
              {item.url && item.file.type.startsWith("image/") ? <Image src={item.url} alt="" width={48} height={48} className="size-12 rounded object-cover" /> : item.file.type.startsWith("image/") ? <ImageIcon className="size-7 text-blue-500" /> : item.file.type.startsWith("video/") ? <Video className="size-7 text-purple-500" /> : <File className="size-7" />}
              <div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><p className="truncate text-sm font-medium">{item.file.name}</p>{item.status === "uploading" ? <Loader2 className="size-4 animate-spin" /> : item.status === "success" ? <CheckCircle2 className="size-4 text-green-600" /> : <AlertCircle className="size-4 text-destructive" />}</div>{item.status === "uploading" && <Progress value={item.progress} className="mt-2 h-2" />}{item.error && <p className="mt-1 text-xs text-destructive">{item.error}</p>}</div>
              {item.status === "error" && <Button type="button" variant="ghost" size="icon" onClick={() => void retry(item)} title={t("retry")}><RefreshCw className="size-4" /></Button>}
              <Button type="button" variant="ghost" size="icon" disabled={item.status === "uploading"} onClick={() => setItems(current => current.filter(candidate => candidate.id !== item.id))}><X className="size-4" /></Button>
            </div>
          ))}
        </CardContent></Card>
      )}
    </div>
  );
}
