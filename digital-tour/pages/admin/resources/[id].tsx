// pages/api/admin/resources/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { Resource } from "@/models";
import { sequelize } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return res.status(401).json({ message: "Not authenticated" });
    const payload = verifyToken(token) as any;
    if (!payload?.role || payload.role !== "admin") return res.status(403).json({ message: "Admin required" });

    await sequelize.authenticate();

    const id = Number(req.query.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    if (req.method === "GET") {
      const r = await Resource.findByPk(id);
      if (!r) return res.status(404).json({ message: "Not found" });
      return res.status(200).json(r);
    }

    if (req.method === "PUT") {
      // Accept { status: "approved" | "rejected", caption?, description?, reason? }
      const { status, caption, description, reason } = req.body;
      const r = await Resource.findByPk(id);
      if (!r) return res.status(404).json({ message: "Not found" });

      // Update allowed fields
      const updates: any = {};
      if (status) updates.status = status;
      if (caption !== undefined) updates.caption = caption;
      if (description !== undefined) updates.description = description;

      await r.update(updates);

      // Optionally, write an audit record later (you asked about audits)
      // TODO: create AdminAudit record with admin id, before/after, reason

      return res.status(200).json(r);
    }

    return res.status(405).end();
  } catch (err) {
    console.error("admin/resources/[id] error", err);
    return res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
}
