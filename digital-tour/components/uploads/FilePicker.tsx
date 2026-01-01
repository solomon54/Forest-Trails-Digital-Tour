// components/uploads/FilePicker.tsx
import { useState } from "react";
import {
  PhotoIcon,
  VideoCameraIcon,
  CloudArrowUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

type Props = {
  onFileSelect: (file: File) => void;
  onRemove?: () => void;
  preview: string | null;
  fileType: string | null;
  fileName?: string | null;
  uploading: boolean;
};

export default function FilePicker({
  onFileSelect,
  onRemove,
  preview,
  fileType,
  fileName,
  uploading,
}: Props) {
  const [dragActive, setDragActive] = useState(false); // ← THIS WAS MISSING!

  const handleFile = (file: File) => {
    if (!file.type.match(/^image\/|^video\//)) {
      alert("Please select an image or video file");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      alert("File too large — maximum 100MB allowed");
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className="relative">
      <div
        className={`
          relative border-2 sm:border-4 border-dashed rounded-2xl sm:rounded-3xl
          text-center transition-all duration-300 overflow-hidden
          ${uploading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
          ${preview ? "p-4 sm:p-6" : "py-10 sm:py-14 px-4 sm:px-8"}
          ${
            dragActive
              ? "border-emerald-500 bg-emerald-50/60"
              : "border-slate-300 hover:border-slate-400 bg-white"
          }
        `}
        onDragOver={(e) => {
          e.preventDefault();
          if (!uploading) setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}>
        {/* Hidden input */}
        <input
          type="file"
          accept="image/*,video/*"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        {/* Content */}
        <div className="relative z-20 pointer-events-none">
          {preview ? (
            <div className="space-y-6 pointer-events-auto">
              <div className="relative inline-block">
                {fileType?.startsWith("video/") ? (
                  <video
                    src={preview}
                    controls
                    className="max-w-full max-h-64 sm:max-h-80 mx-auto rounded-xl sm:rounded-2xl object-cover border border-slate-200 shadow-lg"
                  />
                ) : (
                  <img
                    src={preview}
                    alt="Selected preview"
                    className="max-w-full max-h-64 sm:max-h-80 mx-auto rounded-xl sm:rounded-2xl object-cover border border-slate-200 shadow-lg"
                  />
                )}

                {onRemove && !uploading && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove();
                    }}
                    className="absolute -top-3 -right-3 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-xl transition"
                    aria-label="Remove file">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 text-slate-700">
                {fileType?.startsWith("video/") ? (
                  <VideoCameraIcon className="h-5 w-5 text-emerald-600" />
                ) : (
                  <PhotoIcon className="h-5 w-5 text-emerald-600" />
                )}
                <span className="text-sm font-medium truncate max-w-xs">
                  {fileName || "Selected file"}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-100">
                <CloudArrowUpIcon className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-700" />
              </div>

              <div className="space-y-3">
                <p className="text-xl sm:text-2xl font-semibold text-slate-800">
                  Drag & drop your photo or video
                </p>
                <p className="text-base sm:text-lg text-slate-600">
                  or{" "}
                  <span className="text-emerald-600 font-medium underline">
                    click to browse
                  </span>
                </p>
                <p className="text-sm text-slate-500">
                  Images & videos • Max 100MB • Landscape recommended
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
