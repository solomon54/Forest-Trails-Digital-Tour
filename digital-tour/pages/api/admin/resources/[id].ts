// pages/api/admin/resources/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Resource, Listing } from '@/models';
import { sequelize } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Valid resource ID is required' });
  }

  try {
    await sequelize.authenticate();

    if (req.method === 'GET') {
      const resource = await Resource.findByPk(id, {
        include: [{ model: Listing, as: 'resourceListing', attributes: ['id', 'name', 'description', 'location', 'price', 'status', 'url'] }],
      });
      if (!resource) return res.status(404).json({ message: 'Resource not found' });
      return res.status(200).json(resource);
    }

    if (req.method === 'POST') {
      // Lock/Unlock actions
      const { action } = req.query;  // ?action=lock or unlock
      const headerAdminId = req.headers['x-admin-id'] as string;
      if (!headerAdminId) {
        return res.status(401).json({ message: 'Admin ID required (x-admin-id header)' });
      }
      const effectiveAdminId = Number(headerAdminId);  // Cast to number for locked_by

      const resource = await Resource.findByPk(id);
      if (!resource) return res.status(404).json({ message: 'Resource not found' });

      if (action === 'lock') {
        if (resource.locked_by) {
          return res.status(400).json({ message: 'Resource already locked (by admin ' + resource.locked_by + ')' });
        }
        await resource.update({ locked_by: effectiveAdminId, locked_at: new Date() });
        return res.status(200).json({ message: `Resource locked by admin ${effectiveAdminId}` });
      }

      if (action === 'unlock') {
        if (resource.locked_by !== effectiveAdminId) {
          return res.status(403).json({ message: 'Can only unlock your own locks' });
        }
        await resource.update({ locked_by: null, locked_at: null });
        return res.status(200).json({ message: `Resource unlocked by admin ${effectiveAdminId}` });
      }

      return res.status(405).json({ message: 'Action required (?action=lock|unlock)' });
    }

    if (req.method === 'PUT') {
      const { status, rejection_reason, adminId, ...updates } = req.body;
      const headerAdminId = req.headers['x-admin-id'] as string;
      const effectiveAdminId = Number(adminId || headerAdminId);  // Cast to number

      if (!effectiveAdminId) {
        console.log('Missing adminId - body:', adminId, 'header:', headerAdminId);
        return res.status(401).json({ message: 'Admin ID required (body or x-admin-id header)' });
      }

      console.log('Approve payload:', updates);  // Debug: See what Modal sends

      if (!status && Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'Update data required (e.g., status)' });
      }

      const resource = await Resource.findByPk(id);
      if (!resource) return res.status(404).json({ message: 'Resource not found' });

      if (status === 'approved') {
        if (resource.status !== 'pending') {
          return res.status(400).json({ message: 'Only pending resources can be approved' });
        }

        // Always create NEW Listing (add another list)
        const newListing = await Listing.create({
          name: updates.caption || resource.caption || 'Untitled',  // Copy caption
          description: updates.description || resource.description || null,
          location: updates.location || null,
          price: updates.price ? Number(updates.price) : 0,  // Default 0 if null (avoids error)
          status: 'active',
          url: resource.url,  // Copy url
          created_by: effectiveAdminId,  // Number cast
        });

        // Link Resource to new Listing
        await resource.update({ 
          status: 'approved', 
          listing_id: newListing.id,  // Set to new ID
          ...updates 
        });

        const updatedResource = await Resource.findByPk(id, { 
          include: [{ model: Listing, as: 'resourceListing' }] 
        });
        return res.status(200).json({ 
          message: `Resource approved by admin ${effectiveAdminId}. New Listing #${newListing.id} created & synced.`, 
          resource: updatedResource 
        });
      } else if (status === 'rejected') {
        if (!rejection_reason || rejection_reason.trim().length < 10) {
          return res.status(400).json({ message: 'Rejection reason required (min 10 chars for user feedback)' });
        }
        await resource.update({ 
          status: 'rejected', 
          rejection_reason, 
          ...updates 
        });
        return res.status(200).json({ 
          message: `Resource rejected by admin ${effectiveAdminId}. Reason: ${rejection_reason.substring(0, 50)}...`, 
          resource 
        });
      } else {
        // Generic update
        await resource.update({ status, rejection_reason, ...updates });
        const updatedResource = await Resource.findByPk(id, { 
          include: [{ model: Listing, as: 'resourceListing' }] 
        });
        return res.status(200).json({ message: 'Resource updated', resource: updatedResource });
      }
    }

    if (req.method === 'DELETE') {
      const resource = await Resource.findByPk(id);
      if (!resource) return res.status(404).json({ message: 'Resource not found' });
      await resource.destroy();
      return res.status(200).json({ message: 'Resource deleted' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error processing resource:', error);
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}