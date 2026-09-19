const mongoose = require('mongoose');
require('dotenv').config();

const DeliveryPartner = require('./models/DeliveryPartner');
const Order = require('./models/Order');
const PlatformCMS = require('./models/PlatformCMS');
const Product = require('./models/Product');
const SupportTicket = require('./models/SupportTicket');
const Vendor = require('./models/Vendor');

async function truncateData() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    console.log('Truncating DeliveryPartner...');
    await DeliveryPartner.deleteMany({});
    
    console.log('Truncating Order...');
    await Order.deleteMany({});
    
    console.log('Truncating PlatformCMS...');
    await PlatformCMS.deleteMany({});
    
    console.log('Truncating Product...');
    await Product.deleteMany({});
    
    console.log('Truncating SupportTicket...');
    await SupportTicket.deleteMany({});
    
    console.log('Truncating Vendor...');
    await Vendor.deleteMany({});

    console.log('Data truncation complete! Kept User data.');
    process.exit(0);
  } catch (err) {
    console.error('Error truncating data:', err);
    process.exit(1);
  }
}

truncateData();
