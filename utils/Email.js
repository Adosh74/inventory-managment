const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Product = require('../models/productmodel');

class Email {
  constructor() {
    this.transporter = nodemailer.createTransport({
        service: 'gmail',
        host:'smtp-gmail.com',
        port:587,
        secure:false,
        auth: {
          user: process.env.APP_MAIL,
          pass: process.env.APP_PASSWORD,
        },
      });

    this.scheduleCronJob();
  }

  scheduleCronJob() {
    cron.schedule('* * * * *', async () => {
        const now = new Date();
        const upcomingExpirationDate = new Date();
        upcomingExpirationDate.setMonth(now.getMonth() + 3); // add 3 months

        const expiringProducts = await Product.find({
            expirationDate: { $gte: now, $lte: upcomingExpirationDate },
          });

      if (expiringProducts.length > 0) {
        const emailText = this.createEmailTemplate(expiringProducts);

        try {
            await this.transporter.sendMail({
              from: 'ahmeddmahmoud11122@gmail.com',
              to: 'ahmeddmahmoudd3456@gmail.com',
              subject: 'Expiring Products Alert',
              text: emailText,
            });
            console.log('Expiring products email sent.');
          } catch (error) {
            console.error('Error sending email:', error);
          }

      }
    });
  }

  createEmailTemplate(products) {
    const header = 'Dear Team,\n\nThe following products in our inventory are nearing their expiration dates and require immediate attention:\n\n';
    
    const productDetails = products.map(product => 
      `Product Name: ${product.name}\nQuantity: ${product.quantity}\nExpiration Date: ${product.expirationDate.toDateString()}\n\n`
    ).join('');

    const footer = 'Please ensure that these products are managed appropriately to avoid any wastage or loss.\n\nBest Regards,\nInventory Management Team';

    return header + productDetails + footer;
  }
}

module.exports = Email;
