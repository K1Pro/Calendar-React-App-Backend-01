const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    FirstName: String,
    LastName: String,
    BirthDate: String,
    SpouseName: String,
    SpouseLastName: String,
    SpouseBirthDate: String,
    Address: String,
    Address2: String,
    City: String,
    State: String,
    Zip: String,
    Phone: String,
    Email: String,
    Source: String,
    Status: String,
    EHV: String,
    Car1: String,
    Car2: String,
    Car3: String,
    Car4: String,
    Company: String,
    CreatedBy: String,
    CreateDate: String,
    LastEditedBy: String,
    LastEditDate: String,
    Notes: String,
    Policy1Type: String,
    Policy1RenewDate: String,
    Policy1Number: String,
    Policy2Type: String,
    Policy2RenewDate: String,
    Policy2Number: String,
    Policy3Type: String,
    Policy3RenewDate: String,
    Policy3Number: String,
    Policy4Type: String,
    Policy4RenewDate: String,
    Policy4Number: String,
    CalendarEvents: [],
  }
  // ,
  // {
  //   toJSON: { virtuals: true },
  //   toObject: { virtuals: true },
  // }
);

// contactSchema.virtual('Policy1RenewDateMMDD').get(function () {
//   return this.Policy1RenewDate.slice(5, 10);
// });

// function obfuscate(Policy1RenewDate) {
//   Policy1RenewDate = Policy1RenewDate.slice(5, 10);
//   return Policy1RenewDate;
// }

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
