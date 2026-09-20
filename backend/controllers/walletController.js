const db = require('../config/db');

const walletController = {
  getWalletDetails: async (req, res, next) => {
    try {
      const [user] = await db.execute('SELECT wallet_balance FROM users WHERE id = ?', [req.user.id]);
      const [txns] = await db.execute('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
      res.json({ balance: user[0]?.wallet_balance || 0, transactions: txns });
    } catch (error) {
      next(error);
    }
  },

  addMockFunds: async (req, res, next) => {
    try {
      const { amount } = req.body;
      await db.execute('UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?', [amount, req.user.id]);
      await db.execute(
        'INSERT INTO transactions (user_id, amount, type, description, payment_method, status) VALUES (?, ?, ?, ?, ?, ?)',
        [req.user.id, amount, 'credit', 'Mock Wallet Topup', 'mock_gateway', 'success']
      );
      res.json({ message: 'Wallet recharged successfully' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = walletController;