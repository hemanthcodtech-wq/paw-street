const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true,
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    default: ''
  },
  orderId: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['Delivery Delay', 'Damaged Item', 'Prescription / Vet Help', 'Refund & Returns', 'General Inquiry'],
    default: 'General Inquiry'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  assignedStaff: {
    id: { type: String, default: null },
    name: { type: String, default: 'Unassigned' }
  },
  messages: [{
    sender: { type: String, required: true }, // 'Customer', 'Support Agent', 'System'
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
