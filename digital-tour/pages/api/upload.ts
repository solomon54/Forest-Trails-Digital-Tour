// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File, Fields, Files } from "formidable";
import fs from "fs";
import cloudinary from "@/lib/cloudinary";
import Resource from "@/models/Resource";

export const config = { api: { bodyParser: false } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const form = formidable({ multiples: false });

  form.parse(req, async (err: unknown, fields: Fields, files: Files) => {
    if (err) return res.status(500).json({ error: "Form parse error" });

    const file: File | undefined = Array.isArray(files.file)
      ? files.file[0]
      : files.file;
    const listingId = Number(fields.listing_id);
    const caption = fields.caption?.toString() || "";
const descriptionField = fields.description as string | string[] | undefined;
const description =
  Array.isArray(descriptionField) ? descriptionField[0] : descriptionField?.toString() || "";


    if (!file || !listingId) {
      return res.status(400).json({ error: "File or listing_id missing" });
    }

    try {
      const upload = await cloudinary.uploader.upload(file.filepath, {
        folder: "solomon_project",
        resource_type: "auto",
      });

      fs.unlinkSync(file.filepath);

      const resource = await Resource.create({
        listing_id: listingId,
        type: upload.resource_type === "video" ? "video" : "image",
        url: upload.secure_url,
        caption,
        description,
      });

      return res.status(200).json({ success: true, resource });
    } catch (err) {
      console.error("❌ Upload error:", err);
      return res.status(500).json({ error: "Upload failed", details: err });
    }
  });
}
