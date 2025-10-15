"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { uploadToSupabase, getFileType, getBucketForFileType, getBucketName, type StorageBucket } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Upload, 
  File, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  AlertCircle,
  CheckCircle2,
  Loader2
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
  buttonText = "Upload Files",
  acceptedFileTypes = 'all',
  multiple = false,
  maxFiles = 10,
  maxSize = 10, // 10MB default
}: CustomUploaderProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Clear previous error
    setError(null);

    // Validate file count
    if (multiple && fileArray.length + uploadFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate each file
    const validFiles: UploadFile[] = [];
    
    for (const file of fileArray) {
      // Validate file type
      const fileType = getFileType(file);
      if (acceptedFileTypes !== 'all' && fileType !== acceptedFileTypes) {
        setError(`Please select only ${acceptedFileTypes} files`);
        continue;
      }

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File ${file.name} exceeds ${maxSize}MB limit`);
        continue;
      }

      validFiles.push({
        file,
        progress: 0,
        status: 'uploading'
      });
    }

    if (validFiles.length === 0) return;

    setUploadFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
    uploadFilesSequentially(validFiles);
  };

  const uploadFilesSequentially = async (files: UploadFile[]) => {
    const uploadedUrls: string[] = [];

    for (const uploadFile of files) {
      try {
        const fileType = getFileType(uploadFile.file);
        const targetBucket = bucket === 'IMAGES' && fileType !== 'image' 
          ? getBucketForFileType(fileType) 
          : getBucketName(bucket);

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
            ? { ...uf, status: 'success', url: result.url }
            : uf
        ));

        uploadedUrls.push(result.url);
        
        // Call single upload callback if provided
        if (onUploadComplete) {
          onUploadComplete(result.url);
        }
      } catch (err) {
        setUploadFiles(prev => prev.map(uf => 
          uf.file === uploadFile.file 
            ? { ...uf, status: 'error', error: err instanceof Error ? err.message : 'Upload failed' }
            : uf
        ));
      }
    }

    // Call multiple upload callback if provided
    if (onMultipleUploadComplete && uploadedUrls.length > 0) {
      onMultipleUploadComplete(uploadedUrls);
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
                Drag and drop your {acceptedFileTypes === 'all' ? 'files' : `${acceptedFileTypes}s`} here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse files
              </p>
              {multiple && (
                <p className="text-xs text-muted-foreground">
                  Up to {maxFiles} files, {maxSize}MB each
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
              {isUploading ? "Uploading..." : buttonText}
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
                Files ({uploadFiles.filter(f => f.status === 'success').length}/{uploadFiles.length})
              </h4>
              {hasFiles && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  disabled={isUploading}
                >
                  Clear All
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
                          {uploadFile.status}
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
                      <p className="mt-1 text-xs text-red-600">{uploadFile.error}</p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadFile.file)}
                    disabled={uploadFile.status === 'uploading'}
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </Button>
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
            <h4 className="mb-3 font-medium">Previews</h4>
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
                        View
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