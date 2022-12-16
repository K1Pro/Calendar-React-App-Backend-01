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
    Phone: { type: String, unique: true, required: true },
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
    Policy1RenewMMDD: String,
    Policy1Number: String,
    Policy2Type: String,
    Policy2RenewMMDD: String,
    Policy2Number: String,
    Policy3Type: String,
    Policy3RenewMMDD: String,
    Policy3Number: String,
    Policy4Type: String,
    Policy4RenewMMDD: String,
    Policy4Number: String,
    LastReviewDate: String,
    CalendarEvents: [
      {
        // EventID: Number,
        EventAuthor: String,
        DateYYYYMMDD: String,
        DateHHMMSS: String,
        Description: String,
        Completed: Boolean,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

contactSchema.virtual('Policy1RenewDate').get(function () {
  const thisYearA = new Date(Date.now()).toJSON().slice(0, 4);
  const thisRenewalA = `${thisYearA}-${this.Policy1RenewMMDD}`;
  if (this.Policy1RenewMMDD) {
    return thisRenewalA;
  }
});
contactSchema.virtual('Policy2RenewDate').get(function () {
  const thisYearB = new Date(Date.now()).toJSON().slice(0, 4);
  const thisRenewalB = `${thisYearB}-${this.Policy2RenewMMDD}`;
  if (this.Policy2RenewMMDD) {
    return thisRenewalB;
  }
});
contactSchema.virtual('Policy3RenewDate').get(function () {
  const thisYearC = new Date(Date.now()).toJSON().slice(0, 4);
  const thisRenewalC = `${thisYearC}-${this.Policy3RenewMMDD}`;
  if (this.Policy3RenewMMDD) {
    return thisRenewalC;
  }
});
contactSchema.virtual('Policy4RenewDate').get(function () {
  const thisYearD = new Date(Date.now()).toJSON().slice(0, 4);
  const thisRenewalD = `${thisYearD}-${this.Policy4RenewMMDD}`;
  if (this.Policy4RenewMMDD) {
    return thisRenewalD;
  }
});

// function obfuscate(Policy1RenewDate) {
//   Policy1RenewDate = Policy1RenewDate.slice(5, 10);
//   return Policy1RenewDate;
// }

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
