
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { uploadToSupabase, getFileType, getBucketForFileType, getBucketName, type StorageBucket } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  X, 
  Upload, 
  File, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  RefreshCw
} from "lucide-react";

interface UploadFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

interface CustomUploaderProps {
  bucket?: StorageBucket;
  onUploadComplete?: (url: string) => void;
  onMultipleUploadComplete?: (urls: string[]) => void;
  className?: string;
  buttonText?: string;
  acceptedFileTypes?: 'image' | 'video' | 'all';
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
}

export function CustomUploader({
  bucket = 'IMAGES',
  onUploadComplete,
  onMultipleUploadComplete,
  className = "",
  buttonText,
  acceptedFileTypes = 'all',
  multiple = false,
  maxFiles = 10,
  maxSize,
}: CustomUploaderProps) {
  const t = useTranslations('uploader');
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Smart default based on bucket type
  const getDefaultMaxSize = (bucket: StorageBucket, acceptedFileTypes: string): number => {
    if (bucket === 'VIDEOS' || acceptedFileTypes === 'video') {
      return 100; // 100MB for videos
    }
    return 10; // 10MB default for others
  };

  const effectiveMaxSize = maxSize ?? getDefaultMaxSize(bucket, acceptedFileTypes);
  
  // Get file type label
  const getFileTypeLabel = () => {
    if (acceptedFileTypes === 'all') return t('types.files');
    return t(`types.${acceptedFileTypes}`);
  };

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Clear previous error
    setError(null);

    // Validate file count
    const currentUploadedCount = uploadFiles.filter(uf => uf.status === 'success').length;
    const currentTotalCount = uploadFiles.length;
    const totalAfterAdd = multiple ? currentTotalCount + fileArray.length : fileArray.length;
    
    if (multiple && totalAfterAdd > maxFiles) {
      const errorMsg = t('messages.maxFilesAllowed', { 
        maxFiles, 
        current: currentTotalCount,
        count: currentTotalCount 
      });
      setError(errorMsg);
      toast.error(t('errors.tooManyFiles'), {
        description: errorMsg,
      });
      return;
    }

    // Validate each file
    const validFiles: UploadFile[] = [];
    
    for (const file of fileArray) {
      // Validate file type
      const fileType = getFileType(file);
      if (acceptedFileTypes !== 'all' && fileType !== acceptedFileTypes) {
        const errorMsg = t('messages.invalidFileType', { 
          fileName: file.name, 
          type: acceptedFileTypes 
        });
        setError(errorMsg);
        toast.error(t('errors.invalidFileType'), {
          description: errorMsg,
        });
        continue;
      }

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (file.size > effectiveMaxSize * 1024 * 1024) {
        const errorMsg = t('messages.fileTooLarge', { 
          fileName: file.name, 
          size: fileSizeMB.toFixed(2), 
          maxSize: effectiveMaxSize 
        });
        setError(errorMsg);
        console.error('File size validation failed:', {
          fileName: file.name,
          fileSizeMB: fileSizeMB.toFixed(2),
          maxSizeMB: effectiveMaxSize,
          bucket,
          acceptedFileTypes,
        });
        toast.error(t('errors.fileTooLarge'), {
          description: errorMsg,
        });
        continue;
      }

      validFiles.push({
        file,
        progress: 0,
        status: 'uploading'
      });
    }

    if (validFiles.length === 0) return;

    // Add new files to existing ones (don't replace)
    setUploadFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
    uploadFilesSequentially(validFiles);
  };

  const uploadFilesSequentially = async (files: UploadFile[]) => {
    const uploadedUrls: string[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Log bucket configuration before starting uploads
    const firstFileType = files[0] ? getFileType(files[0].file) : 'file';
    const targetBucket = bucket === 'IMAGES' && firstFileType !== 'image' 
      ? getBucketForFileType(firstFileType) 
      : getBucketName(bucket);
    
    console.log('Starting upload batch:', {
      bucket: bucket,
      targetBucket,
      fileType: firstFileType,
      acceptedFileTypes,
      maxSizeMB: effectiveMaxSize,
      fileCount: files.length,
      files: files.map(f => ({
        name: f.file.name,
        sizeMB: (f.file.size / (1024 * 1024)).toFixed(2),
        type: f.file.type,
      })),
    });

    for (const uploadFile of files) {
      try {
        const fileType = getFileType(uploadFile.file);
        const targetBucket = bucket === 'IMAGES' && fileType !== 'image' 
          ? getBucketForFileType(fileType) 
          : getBucketName(bucket);

        const fileSizeMB = uploadFile.file.size / (1024 * 1024);
        console.log('Uploading file:', {
          fileName: uploadFile.file.name,
          fileSizeMB: fileSizeMB.toFixed(2),
          fileType,
          targetBucket,
          maxSizeMB: effectiveMaxSize,
        });

        const result = await uploadToSupabase(
          uploadFile.file, 
          targetBucket, 
          (progress) => {
            setUploadFiles(prev => prev.map(uf => 
              uf.file === uploadFile.file ? { ...uf, progress } : uf
            ));
          }
        );

        setUploadFiles(prev => prev.map(uf => 
          uf.file === uploadFile.file 
            ? { ...uf, status: 'success', url: result.url, progress: 100 }
            : uf
        ));

        console.log('Upload successful:', {
          fileName: uploadFile.file.name,
          url: result.url,
          path: result.path,
          targetBucket,
        });

        uploadedUrls.push(result.url);
        successCount++;
        
        // Call single upload callback if provided
        if (onUploadComplete) {
          onUploadComplete(result.url);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('errors.uploadFailed');
        const userFriendlyError = errorMessage.includes('Bucket not found')
          ? t('messages.bucketNotConfigured')
          : errorMessage.includes('RLS') || errorMessage.includes('row-level security')
          ? t('messages.permissionDenied')
          : errorMessage.includes('Network error') || errorMessage.includes('Failed to fetch')
          ? t('messages.networkError')
          : errorMessage;

        // Enhanced error logging
        const fileSizeMB = uploadFile.file.size / (1024 * 1024);
        console.error('Upload error:', {
          fileName: uploadFile.file.name,
          fileSizeMB: fileSizeMB.toFixed(2),
          fileType: getFileType(uploadFile.file),
          targetBucket,
          maxSizeMB: effectiveMaxSize,
          error: err,
          errorMessage,
          errorStack: err instanceof Error ? err.stack : undefined,
          uploadProgress: uploadFiles.find(uf => uf.file === uploadFile.file)?.progress || 0,
          bucket,
          acceptedFileTypes,
        });

        setUploadFiles(prev => prev.map(uf => 
          uf.file === uploadFile.file 
            ? { ...uf, status: 'error', error: userFriendlyError, progress: 0 }
            : uf
        ));

        errorCount++;
        
        // Show toast for errors
        toast.error(`${t('errors.uploadFailed')}: ${uploadFile.file.name}`, {
          description: userFriendlyError,
          duration: 5000,
        });
      }
    }

    // Show summary toast
    if (successCount > 0) {
      toast.success(t('success.uploaded', { count: successCount }), {
        duration: 3000,
      });
    }

    // Call multiple upload callback if provided (only with successful uploads)
    if (onMultipleUploadComplete && uploadedUrls.length > 0) {
      onMultipleUploadComplete(uploadedUrls);
    }
    
    // Don't clear files after upload - keep them visible
    // Files will remain in the uploadFiles state for user to see
  };

  const retryUpload = async (fileToRetry: File) => {
    const fileType = getFileType(fileToRetry);
    const targetBucket = bucket === 'IMAGES' && fileType !== 'image' 
      ? getBucketForFileType(fileType) 
      : getBucketName(bucket);

    // Reset file status
    setUploadFiles(prev => prev.map(uf => 
      uf.file === fileToRetry 
        ? { ...uf, status: 'uploading', error: undefined, progress: 0 }
        : uf
    ));

    try {
      const result = await uploadToSupabase(
        fileToRetry, 
        targetBucket, 
        (progress) => {
          setUploadFiles(prev => prev.map(uf => 
            uf.file === fileToRetry ? { ...uf, progress } : uf
          ));
        }
      );

      setUploadFiles(prev => prev.map(uf => 
        uf.file === fileToRetry 
          ? { ...uf, status: 'success', url: result.url, progress: 100 }
          : uf
      ));

      toast.success(t('success.uploaded', { count: 1 }), {
        duration: 3000,
      });

      // Call callbacks
      if (onUploadComplete) {
        onUploadComplete(result.url);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setUploadFiles(prev => prev.map(uf => 
        uf.file === fileToRetry 
          ? { ...uf, status: 'error', error: errorMessage, progress: 0 }
          : uf
      ));

      toast.error(`${t('errors.retryFailed')}: ${fileToRetry.name}`, {
        description: errorMessage,
        duration: 5000,
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const removeFile = (fileToRemove: File) => {
    setUploadFiles(prev => prev.filter(uf => uf.file !== fileToRemove));
  };

  const clearAll = () => {
    setUploadFiles([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Don't auto-clear successful uploads - let user manage them

  const getIcon = () => {
    if (acceptedFileTypes === 'video') return <VideoIcon className="mr-2 size-4" />;
    if (acceptedFileTypes === 'image') return <ImageIcon className="mr-2 size-4" />;
    return <File className="mr-2 size-4" />;
  };

  const getAcceptAttribute = () => {
    switch (acceptedFileTypes) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      default:
        return '*/*';
    }
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="size-4 animate-spin" />;
      case 'success':
        return <CheckCircle2 className="size-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="size-4 text-red-500" />;
      default:
        return null;
    }
  };

  const isUploading = uploadFiles.some(file => file.status === 'uploading');
  const hasFiles = uploadFiles.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card className={`border-2 border-dashed transition-colors ${
        isDragging 
          ? 'border-primary bg-primary/5' 
          : 'border-muted-foreground/25 hover:border-muted-foreground/50'
      }`}>
        <CardContent className="p-6">
          <div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="rounded-full bg-primary/10 p-3">
              <Upload className="size-6 text-primary" />
            </div>
            
            <div className="space-y-2">
              <p className="font-medium">
                {t('dragAndDrop', { type: getFileTypeLabel() })}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('orClickToBrowse')}
              </p>
              {multiple && (
                <p className="text-xs text-muted-foreground">
                  {t('upToFiles', { maxFiles, maxSize: effectiveMaxSize })}
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="default"
              disabled={isUploading}
              className="relative"
              onClick={() => fileInputRef.current?.click()}
            >
              {getIcon()}
              {isUploading ? t('uploading') : (buttonText || t('uploadFiles'))}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept={getAcceptAttribute()}
              multiple={multiple}
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="size-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Upload Progress */}
      {hasFiles && (
        <Card>
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-medium">
                {t('files')} ({uploadFiles.filter(f => f.status === 'success').length}/{uploadFiles.length})
              </h4>
              {hasFiles && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  disabled={isUploading}
                >
                  {t('clearAll')}
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {uploadFiles.map((uploadFile, index) => (
                <div
                  key={`${uploadFile.file.name}-${index}`}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  {/* File Icon */}
                  <div className="shrink-0">
                    {uploadFile.file.type.startsWith('image/') ? (
                      <ImageIcon className="size-8 text-blue-500" />
                    ) : uploadFile.file.type.startsWith('video/') ? (
                      <VideoIcon className="size-8 text-purple-500" />
                    ) : (
                      <File className="size-8 text-gray-500" />
                    )}
                  </div>

                  {/* File Info & Progress */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="truncate text-sm font-medium">
                        {uploadFile.file.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            uploadFile.status === 'success' ? 'default' :
                            uploadFile.status === 'error' ? 'destructive' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {t(`status.${uploadFile.status}`)}
                        </Badge>
                        {getStatusIcon(uploadFile.status)}
                      </div>
                    </div>
                    
                    {uploadFile.status === 'uploading' && (
                      <Progress 
                        value={uploadFile.progress} 
                        className="h-2 bg-muted" 
                      />
                    )}
                    
                    {uploadFile.error && (
                      <div className="mt-1 space-y-1">
                        <p className="text-xs text-red-600">{uploadFile.error}</p>
                        {uploadFile.status === 'error' && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => retryUpload(uploadFile.file)}
                            className="h-6 text-xs"
                          >
                            <RefreshCw className="mr-1 size-3" />
                            {t('retry')}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex shrink-0 gap-1">
                    {uploadFile.status === 'error' && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => retryUpload(uploadFile.file)}
                        className="text-blue-600 hover:text-blue-700"
                        title={t('retry')}
                      >
                        <RefreshCw className="size-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadFile.file)}
                      disabled={uploadFile.status === 'uploading'}
                      className="text-muted-foreground hover:text-foreground"
                      title={t('clearAll')}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Previews */}
      {uploadFiles.some(uf => uf.status === 'success' && uf.file.type.startsWith('image/')) && (
        <Card>
          <CardContent className="p-4">
            <h4 className="mb-3 font-medium">{t('previews')}</h4>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {uploadFiles
                .filter(uf => uf.status === 'success' && uf.url && uf.file.type.startsWith('image/'))
                .map((uploadFile, index) => (
                  <div key={index} className="group relative">
                    <Image
                      src={uploadFile.url!}
                      alt={`Uploaded ${uploadFile.file.name}`}
                      width={120}
                      height={120}
                      className="h-24 w-full rounded-lg border object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(uploadFile.url, '_blank')}
                      >
                        {t('view')}
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}