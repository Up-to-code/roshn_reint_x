"use client";

import { ImageUploadSectionProps } from "@/types/editor";
 import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ExternalLink } from "lucide-react";
import Image from "next/image";
import { CustomUploader } from "@/components/shared/custom-uploader";

export function ImageUploadSection({
  headerImage,
  thumbnail,
  onHeaderImageChange,
  onThumbnailChange
}: ImageUploadSectionProps) {
  return (
    <div className="space-y-6 rounded-lg border bg-background p-6">
      <h3 className="text-lg font-medium">Images</h3>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Header Image */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Header Image</label>
            {headerImage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onHeaderImageChange('')}
                className="size-8 p-0"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
          
          {headerImage ? (
            <Card>
              <CardContent className="p-4">
                <div className="group relative">
                  <Image
                    src={headerImage}
                    alt="Header preview"
                    width={400}
                    height={200}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open(headerImage, '_blank')}
                    >
                      <ExternalLink className="mr-1 size-4" />
                      View
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onHeaderImageChange('')}
                    >
                      <X className="mr-1 size-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <CustomUploader
              bucket="IMAGES"
              acceptedFileTypes="image"
              buttonText="Upload Header Image"
              onUploadComplete={onHeaderImageChange}
              maxFiles={1}
              maxSize={5}
            />
          )}
        </div>

        {/* Thumbnail Image */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Thumbnail</label>
            {thumbnail && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onThumbnailChange('')}
                className="size-8 p-0"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
          
          {thumbnail ? (
            <Card>
              <CardContent className="p-4">
                <div className="group relative">
                  <Image
                    src={thumbnail}
                    alt="Thumbnail preview"
                    width={200}
                    height={200}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open(thumbnail, '_blank')}
                    >
                      <ExternalLink className="mr-1 size-4" />
                      View
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onThumbnailChange('')}
                    >
                      <X className="mr-1 size-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <CustomUploader
              bucket="IMAGES"
              acceptedFileTypes="image"
              buttonText="Upload Thumbnail"
              onUploadComplete={onThumbnailChange}
              maxFiles={1}
              maxSize={2}
            />
          )}
        </div>
      </div>

      {/* Image Guidelines */}
      <div className="rounded-lg bg-muted/30 p-4">
        <h4 className="mb-2 text-sm font-medium">Image Guidelines</h4>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li>• Header Image: Recommended 1200×600px, max 5MB</li>
          <li>• Thumbnail: Recommended 400×400px, max 2MB</li>
          <li>• Supported formats: JPG, PNG, WebP</li>
          <li>• Use high-quality, relevant images for better engagement</li>
        </ul>
      </div>
    </div>
  );
}