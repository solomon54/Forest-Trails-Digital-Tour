// components/uploads/types.ts
export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UploadProgress {
  percentage: number;
  speed: string; // e.g., "2.4 MB/s"
}
