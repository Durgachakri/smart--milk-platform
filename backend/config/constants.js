const constants = {
  CUTOFF_HOUR: parseInt(process.env.CUTOFF_HOUR || '21', 10),
  ROLES: {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
    PARTNER: 'delivery_partner'
  }
};

module.exports = constants;