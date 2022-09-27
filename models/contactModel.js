const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  FirstName: String,
  LastName: String,
  BirthDate: String,
  City: String,
  Policy1RenewMonth: String,
  Policy1RenewDay: String,
});
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
