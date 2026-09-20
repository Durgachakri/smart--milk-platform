const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db.js');

const authController = {
  register: async (req, res, next) => {
    try {
      const { name, phone, password, address, email } = req.body;

      if (!name || !phone || !password) {
        return res.status(400).json({ message: 'Name, phone, and password are required.' });
      }

      // Check if user already exists
      const [existing] = await db.execute('SELECT id FROM users WHERE phone = ?', [phone]);
      if (existing.length > 0) {
        return res.status(409).json({ message: 'Phone number is already registered.' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const DEFAULT_ROLE = 'customer';

      // Ensure no parameters are undefined by falling back to null or empty strings
      const safeName = name.trim();
      const safePhone = phone.trim();
      const safeEmail = email ? email.trim() : null;

      // 1. Insert user into `users` table
      // If your table does not have an `email` column, remove `email` from the query
      const [userResult] = await db.execute(
        'INSERT INTO users (name, phone, password_hash, role) VALUES (?, ?, ?, ?)',
        [safeName, safePhone, hashedPassword, DEFAULT_ROLE]
      );

      const userId = userResult.insertId;

      // 2. Insert address into `addresses` table
      if (address && address.trim() !== '') {
        await db.execute(
          'INSERT INTO addresses (user_id, address_line1, area_zone, pincode, is_default) VALUES (?, ?, ?, ?, TRUE)',
          [
            userId,
            address.trim(),
            'Central Zone', // default area zone if not provided
            '500001'        // default pincode if not provided
          ]
        );
      }

      // 3. Generate JWT
      const token = jwt.sign(
        { id: userId, role: DEFAULT_ROLE },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '7d' }
      );

      // Return user data in the shape expected by Navbar and AuthContext
      res.status(201).json({
        message: 'Account registered successfully.',
        token,
        user: {
          id: userId,
          name: safeName,
          phone: safePhone,
          role: DEFAULT_ROLE
        }
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { phone, password } = req.body;

      if (!phone || !password) {
        return res.status(400).json({ message: 'Phone and password are required.' });
      }

      const [users] = await db.execute('SELECT * FROM users WHERE phone = ?', [phone]);
      if (users.length === 0) {
        return res.status(401).json({ message: 'Invalid phone or password.' });
      }

      const user = users[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid phone or password.' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;