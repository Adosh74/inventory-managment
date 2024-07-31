const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer')
const cron = require('node-cron')
const Email = require("./utils/Email")
const authRouter = require('./router/authRouter')
const ProductRouter = require('./router/productRouter')
require('dotenv').config()
require('./services/cache')

const app = express();
app.use(express.json());




// MongoDB connection
mongoose
.connect(process.env.MONGO_URL, {
     useNewUrlParser: true,
     useUnifiedTopology: true
 })
 .then(() => console.log('DB connection successful!'));


app.use('/api/v1/product',ProductRouter)
app.use('/api/v1/auth',authRouter)




const emailService = new Email();
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     host:'smtp-gmail.com',
//     port:587,
//     secure:false,
//     auth: {
//       user: process.env.APP_MAIL,
//       pass: process.env.APP_PASSWORD,
//     },
//   });
  
  
//   // Cron job to check for expiring products
// cron.schedule('0 0 1 * *', async () => {
//     console.log('Cron job running...');
//     const now = new Date();
//     const upcomingExpirationDate = new Date();
//     upcomingExpirationDate.setMonth(now.getMonth() + 3); // add 3 months
//     console.log(upcomingExpirationDate); // 3 months from now
  
//     const expiringProducts = await Product.find({
//       expirationDate: { $gte: now, $lte: upcomingExpirationDate },
//     });
//     console.log(expiringProducts);
//     console.log(expiringProducts.length);
  
//     if (expiringProducts.length > 0) {
//       const emailText = expiringProducts.map(product => 
//         `Product: ${product.name}, Quantity: ${product.quantity}, Expiration Date: ${product.expirationDate}`
//       ).join('\n');
  
//       try {
//         await transporter.sendMail({
//           from: 'ahmeddmahmoud11122@gmail.com',
//           to: 'ahmeddmahmoudd3456@gmail.com',
//           subject: 'Expiring Products Alert',
//           text: emailText,
//         });
//         console.log('Expiring products email sent.');
//       } catch (error) {
//         console.error('Error sending email:', error);
//       }
//     }
//   });






// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});


