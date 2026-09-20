const db = require('../config/db');

const adminController = {
  getDashboardAnalytics: async (req, res, next) => {
    try {
      const [totalSubs] = await db.execute("SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active'");
      const [totalDeliveries] = await db.execute("SELECT COUNT(*) as count FROM delivery_logs WHERE status = 'delivered'");
      const [monthlyRevenue] = await db.execute("SELECT SUM(amount) as revenue FROM transactions WHERE type = 'credit' AND status = 'success'");

      res.json({
        activeSubscriptions: totalSubs[0].count,
        completedDeliveries: totalDeliveries[0].count,
        totalRevenue: monthlyRevenue[0].revenue || 0,
        volumeChart: [
          { name: 'Mon', liters: 420 }, { name: 'Tue', liters: 480 },
          { name: 'Wed', liters: 460 }, { name: 'Thu', liters: 520 },
          { name: 'Fri', liters: 500 }, { name: 'Sat', liters: 590 }, { name: 'Sun', liters: 640 }
        ]
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = adminController;