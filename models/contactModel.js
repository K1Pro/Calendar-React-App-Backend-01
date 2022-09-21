const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  FirstName: String,
  LastName: String,
  BirthDate: String,
});
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
