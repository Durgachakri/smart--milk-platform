const express = require('express');
const cors = require('cors');
require('dotenv').config();

// const startManifestCron = require('./cron/dailyManifestCron');
// startManifestCron();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const walletRoutes = require('./routes/walletRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');
const orderRoutes = require('./routes/orderRoutes');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server operational on port ${PORT}`));

module.exports = app;