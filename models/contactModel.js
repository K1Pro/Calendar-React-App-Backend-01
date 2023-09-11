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
    LastReviewDate: String,
    MonthlyEvent1Note: String,
    MonthlyEvent1DD: String,
    MonthlyEvent2Note: String,
    MonthlyEvent2DD: String,
    YearlyEvent1Note: String,
    YearlyEvent1MM: String,
    YearlyEvent1DD: String,
    YearlyEvent1MMDD: String,
    YearlyEvent2Note: String,
    YearlyEvent2MM: String,
    YearlyEvent2DD: String,
    YearlyEvent2MMDD: String,
    Type: String,
    EventTime: String,
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

contactSchema.virtual('FullName').get(function () {
  const fullName = this.FirstName + this.LastName;
  if (fullName) {
    return `${this.FirstName} ${this.LastName}`;
  }
});

contactSchema.virtual('SpouseFullName').get(function () {
  const spouseFullName = this.SpouseName + this.SpouseLastName;
  if (spouseFullName) {
    return `${this.SpouseName} ${this.SpouseLastName}`;
  }
});

contactSchema.virtual('Policy1RenewDateMMDD').get(function () {
  if (this.Policy1RenewDate) {
    return `${this.Policy1RenewDate.slice(5)}`;
  }
});

contactSchema.virtual('Policy2RenewDateMMDD').get(function () {
  if (this.Policy2RenewDate) {
    return `${this.Policy2RenewDate.slice(5)}`;
  }
});

contactSchema.virtual('Policy3RenewDateMMDD').get(function () {
  if (this.Policy3RenewDate) {
    return `${this.Policy3RenewDate.slice(5)}`;
  }
});

contactSchema.virtual('Policy4RenewDateMMDD').get(function () {
  if (this.Policy4RenewDate) {
    return `${this.Policy4RenewDate.slice(5)}`;
  }
});

// function obfuscate(Policy1RenewDate) {
//   Policy1RenewDate = Policy1RenewDate.slice(5, 10);
//   return Policy1RenewDate;
// }

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
