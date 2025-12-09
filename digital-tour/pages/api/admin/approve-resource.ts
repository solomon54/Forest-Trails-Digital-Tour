// pages/api/admin/approve-resource.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next'; // If using NextAuth; otherwise, use your auth check
import { sequelize } from '@/lib/db';
import Resource from '@/models/Resource'; // Adjust to your model (e.g., Tour, Media)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST/PATCH
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Auth check: Ensure admin (adapt to your auth system)
    const session = await getServerSession(req, res, {}); // Or your custom auth
    if (!session || session.user.role !== 'admin') {
      return res.status(401).json({ message: 'Unauthorized: Admin only' });
    }

    const { resourceId, status = 'approved' } = req.body; // e.g., { resourceId: 123, status: 'approved' }
    if (!resourceId) {
      return res.status(400).json({ message: 'Missing resourceId' });
    }

    // Update in DB (using Sequelize)
    const [updatedCount] = await Resource.update(
      { status }, // Add other fields if needed, e.g., { status, approvedAt: new Date() }
      { where: { id: resourceId } }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Optional: Fetch updated resource for response
    const updatedResource = await Resource.findByPk(resourceId, {
      attributes: ['id', 'title', 'status', 'updatedAt'], // Safe fields
    });

    res.status(200).json({ 
      message: 'Resource approved successfully', 
      resource: updatedResource 
    });
  } catch (error) {
    console.error('Approve resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}