const invoiceGenerator = {
  generateInvoiceData: (sub, delivery) => ({
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    amount: delivery.quantity * (sub.price || 0),
    status: 'PAID'
  })
};

module.exports = invoiceGenerator;