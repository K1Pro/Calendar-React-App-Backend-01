const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  FirstName: String,
  LastName: String,
  BirthDate: String,
  City: String,
  Policy1RenewMonth,
  Policy1RenewDay,
});
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
