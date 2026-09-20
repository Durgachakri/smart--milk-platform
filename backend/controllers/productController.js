const db = require('../config/db.js');

const productController = {
  getAllProducts: async (req, res, next) => {
    try {
      const [products] = await db.execute('SELECT * FROM products ORDER BY id DESC');
      res.json(products);
    } catch (err) {
      next(err);
    }
  },

  createProduct: async (req, res, next) => {
    try {
      const {
        name,
        category,
        unit,
        price,
        original_price,
        stock,
        specs,
        description,
        image_url,
        is_organic,
        is_featured
      } = req.body;

      let finalImageUrl = image_url || '/images/Buffalo_milk.png';
      if (req.file) {
        finalImageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
      }

      const regularPrice = parseFloat(original_price) || parseFloat(price);
      const offerPrice = parseFloat(price);
      let calculatedDiscount = 0;

      if (regularPrice > offerPrice) {
        calculatedDiscount = Math.round(((regularPrice - offerPrice) / regularPrice) * 100);
      }

      const [result] = await db.execute(
        `INSERT INTO products 
        (name, category, unit, price, original_price, discount_percent, stock, specs, description, image_url, is_organic, is_featured) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          category,
          unit,
          offerPrice,
          regularPrice,
          calculatedDiscount,
          parseInt(stock, 10) || 50,
          specs || 'Standard',
          description || '',
          finalImageUrl,
          is_organic === 'true' || is_organic === true ? 1 : 0,
          is_featured === 'true' || is_featured === true ? 1 : 0
        ]
      );

      res.status(201).json({ message: 'Product added successfully.', id: result.insertId });
    } catch (err) {
      next(err);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        name,
        category,
        unit,
        price,
        original_price,
        stock,
        specs,
        description,
        image_url,
        is_organic,
        is_featured
      } = req.body;

      let finalImageUrl = image_url;
      if (req.file) {
        finalImageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
      }

      const regularPrice = parseFloat(original_price) || parseFloat(price);
      const offerPrice = parseFloat(price);
      let calculatedDiscount = 0;

      if (regularPrice > offerPrice) {
        calculatedDiscount = Math.round(((regularPrice - offerPrice) / regularPrice) * 100);
      }

      await db.execute(
        `UPDATE products 
         SET name = ?, category = ?, unit = ?, price = ?, original_price = ?, discount_percent = ?, stock = ?, specs = ?, description = ?, image_url = ?, is_organic = ?, is_featured = ? 
         WHERE id = ?`,
        [
          name,
          category,
          unit,
          offerPrice,
          regularPrice,
          calculatedDiscount,
          parseInt(stock, 10) || 50,
          specs || 'Standard',
          description || '',
          finalImageUrl,
          is_organic === 'true' || is_organic === true ? 1 : 0,
          is_featured === 'true' || is_featured === true ? 1 : 0,
          id
        ]
      );

      res.json({ message: 'Product updated successfully.' });
    } catch (err) {
      next(err);
    }
  },

  deleteProduct: async (req, res, next) => {
    let connection;
    try {
      connection = await db.getConnection();
      const { id } = req.params;

      await connection.beginTransaction();

      await connection.execute('DELETE FROM delivery_logs WHERE product_id = ?', [id]);
      await connection.execute(`
        DELETE se FROM subscription_exceptions se
        INNER JOIN subscriptions s ON se.subscription_id = s.id
        WHERE s.product_id = ?
      `, [id]);
      await connection.execute('DELETE FROM subscriptions WHERE product_id = ?', [id]);
      await connection.execute('UPDATE order_items SET product_id = NULL WHERE product_id = ?', [id]);
      const [result] = await connection.execute('DELETE FROM products WHERE id = ?', [id]);

      await connection.commit();

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      res.json({ message: 'Product deleted successfully.' });
    } catch (err) {
      if (connection) await connection.rollback();
      next(err);
    } finally {
      if (connection) connection.release();
    }
  }
};

module.exports = productController;