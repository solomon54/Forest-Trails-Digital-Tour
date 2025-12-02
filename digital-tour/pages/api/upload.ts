import cloudinary from "@/lib/cloudinary";
import formidable from "formidable";
import fs from "fs";

// Disable Next.js default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Upload failed" });

      const file = Array.isArray(files.file) ? files.file[0] : files.file;

      const uploadResult = await cloudinary.uploader.upload((file as formidable.File).filepath, {
        folder: "your_project",
        resource_type: "auto", // supports images + videos
      });

      // Delete temp file
      if (file) {
        fs.unlinkSync(file.filepath);
      }

      return res.status(200).json({
        success: true,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      });
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error", detail: error });
  }
}
