// components/uploads/UploadForm.tsx
import { useState, useEffect, useRef } from "react";
import FilePicker from "./FilePicker";
import UploadProgress from "./UploadProgress";
import UploadSuccess from "./UploadSuccess";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

type Props = {
  userId: number;
};

export default function UploadForm({ userId }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  // Field errors
  const [fileError, setFileError] = useState("");
  const [captionError, setCaptionError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [serverError, setServerError] = useState("");

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState("");
  const [success, setSuccess] = useState(false);

  // Auto-growing textarea ref
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [description]);

  // Real-time error clearing
  useEffect(() => {
    if (caption.trim()) setCaptionError("");
    if (location.trim()) setLocationError("");
    if (description.trim()) setDescriptionError("");
  }, [caption, location, description]);

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.match(/^image\/|^video\//)) {
      setFileError("Please select an image or video file");
      return;
    }
    if (selectedFile.size > 100 * 1024 * 1024) {
      setFileError("File too large — maximum 100MB");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setPreview(URL.createObjectURL(selectedFile));
    setFileType(selectedFile.type);
    setFileError("");
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setFileType(null);
    setFileName(null);
  };

  const validateForm = () => {
    let valid = true;

    if (!file) {
      setFileError("Please select a photo or video");
      valid = false;
    }
    if (!caption.trim()) {
      setCaptionError("Caption is required");
      valid = false;
    }
    if (!location.trim()) {
      setLocationError("Location is required");
      valid = false;
    }
    if (!description.trim()) {
      setDescriptionError(
        "Description is required — helps us review your content"
      );
      valid = false;
    }

    return valid;
  };

  const handleUpload = () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("file", file!);
    formData.append("caption", caption.trim());
    formData.append("description", description.trim());
    formData.append("location", location.trim());
    formData.append("uploaded_by", String(userId));

    setUploading(true);
    setServerError("");

    const xhr = new XMLHttpRequest();
    const startTime = Date.now();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setProgress(percent);

        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed > 0.5) {
          const speedMbps = (e.loaded / 1024 / 1024 / elapsed).toFixed(1);
          setSpeed(`${speedMbps} MB/s`);
        }
      }
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        setSuccess(true);
        resetForm();
      } else {
        try {
          const data = JSON.parse(xhr.responseText);
          setServerError(data.error || "Upload failed — please try again");
        } catch {
          setServerError("Upload failed — please try again");
        }
      }
      setUploading(false);
    };

    xhr.onerror = () => {
      setServerError("Network error — check your connection");
      setUploading(false);
    };

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setFileType(null);
    setFileName(null);
    setCaption("");
    setDescription("");
    setLocation("");
    setProgress(0);
    setSpeed("");
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-emerald-100">
      {success ? (
        <UploadSuccess />
      ) : (
        <>
          {/* File Picker */}
          <div className="mb-10">
            <FilePicker
              onFileSelect={handleFileSelect}
              onRemove={handleRemoveFile}
              preview={preview}
              fileType={fileType}
              fileName={fileName}
              uploading={uploading}
            />
            {fileError && (
              <div className="mt-4 flex items-center justify-center gap-2 text-red-600">
                <ExclamationCircleIcon className="h-5 w-5" />
                <p className="text-sm font-medium">{fileError}</p>
              </div>
            )}
          </div>

          {/* Progress */}
          {uploading && <UploadProgress percentage={progress} speed={speed} />}

          {/* Form Fields */}
          <div className="space-y-8">
            {/* Caption */}
            <div>
              <label
                htmlFor="caption"
                className="block text-sm font-semibold text-slate-800 mb-2">
                Caption / Title <span className="text-red-500">*</span>
              </label>
              <input
                id="caption"
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g., Ancient church hidden in Zege Forest at dawn"
                disabled={uploading}
                className={`w-full px-5 py-4 rounded-xl border-2 text-base transition-all
                  ${
                    captionError
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  } focus:outline-none text-slate-500`}
              />
              {captionError && (
                <p className="mt-2 flex items-center gap-2 text-red-600 text-sm font-medium">
                  <ExclamationCircleIcon className="h-5 w-5" />
                  {captionError}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-slate-800 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Zege Peninsula, near Bahir Dar, Amhara Region"
                disabled={uploading}
                className={`w-full px-5 py-4 rounded-xl border-2 text-base transition-all
                  ${
                    locationError
                      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  } focus:outline-none text-slate-500`}
              />
              {locationError && (
                <p className="mt-2 flex items-center gap-2 text-red-600 text-sm font-medium">
                  <ExclamationCircleIcon className="h-5 w-5" />
                  {locationError}
                </p>
              )}
            </div>

            {/* Description – Required, Auto-Grow with Max Height & Scroll */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-slate-800 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  ref={textareaRef}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell the story behind this place — its cultural or spiritual significance, what makes it special, tips for visitors, or your personal experience..."
                  disabled={uploading}
                  rows={4}
                  className={`w-full px-5 py-4 text-slate-500 placeholder-slate-300 rounded-xl border-2 text-base transition-all resize-none
        ${
          descriptionError
            ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
            : "border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
        } focus:outline-none placeholder-slate-300 pr-10`}
                  style={{
                    minHeight: "140px",
                    maxHeight: "320px", // ← Prevents taking over small screens
                    overflowY:
                      description.split("\n").length > 12 ? "auto" : "hidden",
                  }}
                />
                {/* Optional: subtle scroll indicator */}
                {description.split("\n").length > 12 && (
                  <div className="absolute right-3 bottom-3 text-slate-400 text-xs pointer-events-none">
                    scroll ↓
                  </div>
                )}
              </div>

              {descriptionError && (
                <p className="mt-2 flex items-center gap-2 text-red-600 text-sm font-medium">
                  <ExclamationCircleIcon className="h-5 w-5" />
                  {descriptionError}
                </p>
              )}

              <p className="mt-2 text-xs text-slate-500">
                Helps our team understand and approve your contribution faster
              </p>
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <ExclamationCircleIcon className="h-6 w-6 text-red-600 shrink-0" />
                <p className="text-red-700 font-medium">{serverError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleUpload}
              disabled={
                uploading ||
                !file ||
                !caption.trim() ||
                !location.trim() ||
                !description.trim()
              }
              className="w-full py-5 rounded-xl text-white font-bold text-xl shadow-xl transition-all
                disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none
                bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]">
              {uploading ? "Uploading..." : "Submit for Review"}
            </button>
          </div>

          <p className="mt-10 text-center text-slate-500 text-sm">
            Your story brings Ethiopia&apos;s sacred places to life 🌍
          </p>
        </>
      )}
    </div>
  );
}
