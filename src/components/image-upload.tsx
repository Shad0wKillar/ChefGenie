"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";

interface ImageUploadProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
}

export function ImageUpload({ selectedFile, onFileSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  // I implemented this effect to safely manage the object URL lifecycle and prevent memory leaks.
  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
  });

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  if (preview) {
    return (
      <div className="relative flex h-64 w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
        <img
          src={preview}
          alt="Upload preview"
          className="h-full w-full object-cover opacity-80 transition-opacity hover:opacity-100"
        />
        <button
          onClick={handleClear}
          className="absolute right-3 top-3 rounded-full bg-zinc-950/70 p-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100 backdrop-blur-md"
          aria-label="Clear image"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`group flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 ease-in-out ${isDragActive
          ? "border-blue-500 bg-blue-500/10"
          : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50"
        }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className={`rounded-full p-4 transition-colors ${isDragActive
              ? "bg-blue-500/20 text-blue-400"
              : "bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700"
            }`}
        >
          <UploadCloud className="h-8 w-8" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-zinc-200">
            {isDragActive ? "Drop the image here" : "Click or drag and drop"}
          </p>
          <p className="text-xs text-zinc-500">JPEG, PNG, or WebP</p>
        </div>
      </div>
    </div>
  );
}
