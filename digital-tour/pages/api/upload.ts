// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File, Fields, Files } from "formidable";
import fs from "fs/promises"; // Use promises to avoid sync issues
import cloudinary from "@/lib/cloudinary";
import Resource from "@/models/Resource";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  try {
    const [fields, files] = await form.parse(req);

    // Extract file safely
    const fileArray = Array.isArray(files.file) ? files.file : [files.file];
    const file = fileArray[0];

    if (!file || !file.filepath) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Extract fields safely
    const getField = (field: string | string[] | undefined) =>
      Array.isArray(field) ? field[0] : field?.toString() || "";

    const caption = getField(fields.caption)?.trim();
    const description = getField(fields.description)?.trim() || "";
    const location = getField(fields.location)?.trim();
    const uploadedBy = Number(getField(fields.uploaded_by));

    if (!uploadedBy || isNaN(uploadedBy)) {
      return res.status(400).json({ error: "Invalid or missing user" });
    }

    if (!caption) {
      return res.status(400).json({ error: "Caption is required" });
    }

    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }

    let uploadResult;
    try {
      uploadResult = await cloudinary.uploader.upload(file.filepath, {
        folder: "forest-trails/resources",
        resource_type: "auto",
      });
    } catch (cloudError: any) {
      console.error("Cloudinary upload failed:", cloudError);
      return res.status(500).json({
        error: "Failed to upload to storage",
        details: cloudError.message || "Cloudinary error",
      });
    }

    // Clean up temp file safely
    try {
      await fs.unlink(file.filepath);
    } catch (unlinkError) {
      console.warn("Failed to delete temp file:", unlinkError);
      // Not critical — temp files usually cleaned by system
    }

    // Save to DB
    try {
      const resource = await Resource.create({
        url: uploadResult.secure_url,
        type: uploadResult.resource_type === "video" ? "video" : "image",
        caption,
        description,
        location,
        uploaded_by: uploadedBy,
        listing_id: null,
        status: "pending",
      });

      return res.status(200).json({
        success: true,
        message: "Upload successful! Your content is pending review.",
        resource,
      });
    } catch (dbError: any) {
      console.error("DB insert failed:", dbError);
      return res.status(500).json({
        error: "Failed to save to database",
        details: dbError.message || "Prisma error",
      });
    }
  } catch (parseError: any) {
    console.error("Form parsing failed:", parseError);
    return res.status(500).json({
      error: "Failed to process upload",
      details: parseError.message,
    });
  }
}
