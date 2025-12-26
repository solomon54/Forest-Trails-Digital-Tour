// pages/api/admin/resources/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Resource, Listing, User } from '@/models';
import { sequelize } from '@/lib/db';
import { Op } from 'sequelize';
import { QueryTypes } from 'sequelize'; // ← Add this import

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ message: 'Invalid ID' });

  const resourceId = Number(id);
  if (isNaN(resourceId)) return res.status(400).json({ message: 'Invalid ID' });

  const headerAdminId = req.headers['x-admin-id'];
  const adminIdFromHeader = headerAdminId ? Number(headerAdminId) : null;

  // For PUT (approve/reject), adminId can come from body or header
  const { adminId: adminIdFromBody } = req.body as { adminId?: number };
  const effectiveAdminId = adminIdFromBody || adminIdFromHeader;

  try {
    await sequelize.authenticate();

    // Helper: auto-unlock expired
    const autoUnlockIfExpired = async (resource: Resource) => {
      if (resource.locked_by && resource.lock_expires_at && new Date() > new Date(resource.lock_expires_at)) {
        await resource.update({
          locked_by: null,
          locked_at: null,
          lock_expires_at: null,
          lock_reason: null,
        });
        return await resource.reload();
      }
      return resource;
    };
        // GET: Fetch + auto-unlock expired
    if (req.method === 'GET') {
      let resource = await Resource.findByPk(resourceId, {
        include: [
          { model: Listing, as: 'resourceListing', attributes: ['id', 'name', 'description', 'location', 'price', 'status', 'url'] },
          { model: User, as: 'locker', attributes: ['id', 'name'], required: false },
        ],
      });

      if (!resource) return res.status(404).json({ message: 'Not found' });
      resource = await autoUnlockIfExpired(resource);
      return res.status(200).json(resource);
    }

      // POST: lock/unlock
    if (req.method === 'POST') {
      if (!adminIdFromHeader) return res.status(401).json({ message: 'x-admin-id required' });
      const { action } = req.query as { action?: 'lock' | 'unlock' };
      if (!action || !['lock', 'unlock'].includes(action)) {
        return res.status(400).json({ message: 'action=lock|unlock required' });
      }

      const t = await sequelize.transaction();
      try {
        let resource = await Resource.findByPk(resourceId, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (!resource) {
          await t.rollback();
          return res.status(404).json({ message: 'Not found' });
        }

        resource = await autoUnlockIfExpired(resource);

        if (action === 'lock') {
          if (resource.locked_by) {
            await t.rollback();
            return res.status(409).json({ message: `Locked by admin ${resource.locked_by}` });
          }

          const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min
          await resource.update({
            locked_by: adminIdFromHeader,
            locked_at: new Date(),
            lock_expires_at: expiresAt,
            lock_reason: req.body.lock_reason || null,
          }, { transaction: t });

          await t.commit();
          return res.status(200).json({ message: 'Locked', expiresAt });
        }

        if (action === 'unlock') {
          if (resource.locked_by !== adminIdFromHeader) {
            await t.rollback();
            return res.status(403).json({ message: 'Can only unlock your own lock' });
          }
          await resource.update({
            locked_by: null,
            locked_at: null,
            lock_expires_at: null,
            lock_reason: null,
          }, { transaction: t });
          await t.commit();
          return res.status(200).json({ message: 'Unlocked' });
        }
      } catch (err) {
        await t.rollback();
        console.error(`POST transaction failed for resource ${resourceId}:`, err); 
        throw err;
      }
    }

    // PUT: Approve/Reject + Sync + **AUDIT LOGGING**
    if (req.method === 'PUT') {
      const { status, rejection_reason, adminId, ...updates } = req.body;
      const effectiveAdminId = adminId ? Number(adminId) : adminIdFromHeader;

      if (!effectiveAdminId) return res.status(401).json({ message: 'Admin ID required' });

      const t = await sequelize.transaction();
      try {
        let resource = await Resource.findByPk(resourceId, { transaction: t, lock: t.LOCK.UPDATE });
        if (!resource) {
          await t.rollback();
          return res.status(404).json({ message: 'Not found' });
        }

        resource = await autoUnlockIfExpired(resource);

        // Enforce lock
        if (resource.locked_by && resource.locked_by !== effectiveAdminId) {
          await t.rollback();
          return res.status(403).json({ message: `Locked by admin ${resource.locked_by}` });
        }

        // Capture BEFORE state
        const beforeState = {
          status: resource.status,
          listing_id: resource.listing_id,
          rejection_reason: resource.rejection_reason,
        };

        // Prepare update data
        const updateData: any = { ...updates };

        let auditAction = null;
        if (status === 'approved') {
          updateData.status = 'approved';
          auditAction = 'approve_resource';
        } else if (status === 'rejected') {
          if (!rejection_reason || rejection_reason.trim().length < 10) {
            await t.rollback();
            return res.status(400).json({ message: 'Rejection reason required (min 10 chars)' });
          }
          updateData.status = 'rejected';
          updateData.rejection_reason = rejection_reason.trim();
          auditAction = 'reject_resource';
        }

        // APPROVE SYNC LOGIC (unchanged — kept your excellent code)
        if (status === 'approved') {
          let listingId: number | null = resource.listing_id;
          const listingData = {
            name: updates.name || updates.caption || resource.caption || 'Untitled Listing',
            description: updates.description || resource.description || '',
            location: updates.location || 'TBD',
            price: updates.price ? Number(updates.price) : 0.00,
            status: 'active',
            url: resource.url,
            cover_image_url: resource.url,
            created_by: resource.uploaded_by || effectiveAdminId,
            updated_by: effectiveAdminId
          };

          if (!listingId) {
            const newListing = await Listing.create(listingData, { transaction: t });
            listingId = newListing.id;
            updateData.listing_id = listingId;
          } else {
            const existingListing = await Listing.findByPk(listingId, { transaction: t });
            if (!existingListing) {
              const newListing = await Listing.create(listingData, { transaction: t });
              listingId = newListing.id;
              updateData.listing_id = listingId;
            } else {
              await Listing.update(listingData, { where: { id: listingId }, transaction: t });
            }
          }
        }

        // Always release lock
        updateData.locked_by = null;
        updateData.locked_at = null;
        updateData.lock_expires_at = null;
        updateData.lock_reason = null;

        // Update Resource
        await resource.update(updateData, { transaction: t });

        // Capture AFTER state
        const afterState = {
          status: resource.status,
          listing_id: resource.listing_id,
          rejection_reason: resource.rejection_reason,
        };

        // === AUDIT LOGGING ===
        if (auditAction) {
          try {
            await sequelize.query(
              `INSERT INTO admin_audits 
               (admin_id, action, target_type, target_id, before_state, after_state, reason, created_at)
               VALUES (?, ?, 'resource', ?, ?, ?, ?, NOW())`,
              {
                replacements: [
                  effectiveAdminId,
                  auditAction,
                  resourceId,
                  JSON.stringify(beforeState),
                  JSON.stringify(afterState),
                  status === 'rejected' ? rejection_reason.trim() : null
                ],
                type: QueryTypes.INSERT,
              }
            );
          } catch (auditErr) {
            console.error("Failed to log resource audit:", auditErr);
            // Non-critical — don't fail the whole request
          }
        }

        await t.commit();

        const finalResource = await Resource.findByPk(resourceId, {
          include: [
            { model: Listing, as: 'resourceListing', attributes: ['id', 'name', 'description', 'location', 'price', 'status', 'url'] },
            { model: User, as: 'locker', attributes: ['id', 'name'], required: false },
          ],
        });

        return res.status(200).json(finalResource);
      } catch (err) {
        await t.rollback();
        console.error(`PUT transaction failed for resource ${resourceId}:`, err);
        return res.status(500).json({ message: 'Failed to process resource and sync listing.' });
      }
    }

    return res.status(405).end();
  } catch (error) {
    console.error('Resource API general error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}    