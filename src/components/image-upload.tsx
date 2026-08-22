"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { SAMPLE_IMAGES, type SampleImage } from "@/lib/sample-images";

interface ImageUploadProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
}

export function ImageUpload({ selectedFile, onFileSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  // I hold on to the File instance I built from a sample so I can tell whether
  // the currently selected file is still that sample or something the user dropped.
  const [sampleSelection, setSampleSelection] = useState<{
    id: string;
    label: string;
    file: File;
  } | null>(null);
  const [pendingSampleId, setPendingSampleId] = useState<string | null>(null);
  const [sampleError, setSampleError] = useState<string | null>(null);

  const activeSample =
    sampleSelection && selectedFile === sampleSelection.file
      ? sampleSelection
      : null;

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
        setSampleError(null);
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
    setSampleError(null);
    onFileSelect(null);
  };

  // I fetch the static sample and wrap it in a File so the rest of the app can
  // treat it exactly like an uploaded image.
  const handleSampleSelect = async (sample: SampleImage) => {
    if (pendingSampleId) return;

    setPendingSampleId(sample.id);
    setSampleError(null);

    try {
      const response = await fetch(sample.src);
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const blob = await response.blob();
      const file = new File([blob], sample.fileName, {
        type: blob.type || "image/jpeg",
      });

      setSampleSelection({ id: sample.id, label: sample.label, file });
      onFileSelect(file);
    } catch {
      setSampleError("Couldn't load that example. Please try again.");
    } finally {
      setPendingSampleId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {preview ? (
        <div className="relative flex h-64 w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          <img
            src={preview}
            alt="Upload preview"
            className="h-full w-full object-cover opacity-80 transition-opacity hover:opacity-100"
          />
          {activeSample && (
            <span className="absolute bottom-3 left-3 rounded-full bg-zinc-950/70 px-3 py-1 text-xs font-medium text-zinc-300 backdrop-blur-md">
              {activeSample.label} example
            </span>
          )}
          <button
            onClick={handleClear}
            className="absolute right-3 top-3 rounded-full bg-zinc-950/70 p-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100 backdrop-blur-md"
            aria-label="Clear image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
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
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <label className="text-sm font-medium text-zinc-400">
            Or pick an example
          </label>
          <span className="text-xs text-zinc-600">no upload needed</span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {SAMPLE_IMAGES.map((sample) => {
            const isActive = activeSample?.id === sample.id;
            const isPending = pendingSampleId === sample.id;

            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSampleSelect(sample)}
                disabled={pendingSampleId !== null}
                title={`${sample.label} example`}
                aria-label={`Use ${sample.label} example image`}
                aria-pressed={isActive}
                className={`group relative aspect-square overflow-hidden rounded-lg border transition-all disabled:cursor-not-allowed ${isActive
                    ? "border-blue-500 ring-2 ring-blue-500/40"
                    : "border-zinc-800 hover:border-zinc-600"
                  }`}
              >
                <img
                  src={sample.src}
                  alt={`${sample.label} example`}
                  loading="lazy"
                  className={`h-full w-full object-cover transition-opacity ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                    }`}
                />
                {isPending && (
                  <span className="absolute inset-0 flex items-center justify-center bg-zinc-950/60">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {sampleError && <p className="text-xs text-red-400">{sampleError}</p>}
      </div>
    </div>
  );
}
