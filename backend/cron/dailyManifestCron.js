const cron = require('node-cron');
const db = require('../config/db');

const startManifestCron = () => {
  cron.schedule('0 22 * * *', async () => {
    console.log('⏰ Generating Daily Delivery Manifest for tomorrow...');
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const targetDate = tomorrow.toISOString().split('T')[0];
      const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][tomorrow.getDay()];

      const query = `
        SELECT s.id AS subscription_id, s.user_id, s.product_id, s.address_id, s.quantity,
               s.frequency, s.custom_days, e.action, e.override_quantity
        FROM subscriptions s
        LEFT JOIN subscription_exceptions e 
          ON s.id = e.subscription_id AND e.exception_date = ?
        WHERE s.status = 'active'
          AND s.start_date <= ?
          AND (s.end_date IS NULL OR s.end_date >= ?)`;

      const [subscriptions] = await db.execute(query, [targetDate, targetDate, targetDate]);

      for (const sub of subscriptions) {
        if (sub.action === 'skip') continue;

        let shouldDeliver = false;
        if (sub.frequency === 'daily') shouldDeliver = true;
        else if (sub.frequency === 'custom' && sub.custom_days && JSON.parse(sub.custom_days).includes(dayOfWeek)) {
          shouldDeliver = true;
        }

        if (shouldDeliver) {
          const finalQuantity = sub.action === 'modify_qty' ? sub.override_quantity : sub.quantity;
          await db.execute(
            `INSERT INTO delivery_logs (delivery_date, user_id, address_id, subscription_id, product_id, quantity, status)
             VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
            [targetDate, sub.user_id, sub.address_id, sub.subscription_id, sub.product_id, finalQuantity]
          );
        }
      }
      console.log('✅ Daily Manifest generated successfully');
    } catch (err) {
      console.error('❌ Error executing daily delivery cron:', err);
    }
  });
};

module.exports = startManifestCron;