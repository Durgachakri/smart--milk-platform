const db = require('../config/db');

const deliveryController = {
  getPartnerManifest: async (req, res, next) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [manifest] = await db.execute(`
        SELECT dl.*, u.name AS customer_name, u.phone AS customer_phone, 
               a.address_line1, a.landmark, a.area_zone, p.name AS product_name, p.unit
        FROM delivery_logs dl
        JOIN users u ON dl.user_id = u.id
        JOIN addresses a ON dl.address_id = a.id
        JOIN products p ON dl.product_id = p.id
        WHERE dl.delivery_date = ? AND (dl.assigned_partner_id = ? OR dl.assigned_partner_id IS NULL)`,
        [today, req.user.id]
      );
      res.json(manifest);
    } catch (error) {
      next(error);
    }
  },

  updateDeliveryStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, failure_reason, delivery_note } = req.body;

      await db.execute(`
        UPDATE delivery_logs 
        SET status = ?, failure_reason = ?, delivery_note = ?, delivered_at = NOW(), assigned_partner_id = ?
        WHERE id = ?`,
        [status, failure_reason || null, delivery_note || null, req.user.id, id]
      );

      res.json({ message: 'Delivery status updated' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = deliveryController;