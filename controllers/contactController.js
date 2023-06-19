const Contact = require(`${__dirname}/../models/contactModel`);
const APIFeatures = require(`${__dirname}/../utils/apiFeatures`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);

// Middleware
exports.aliasSorted = (req, res, next) => {
  req.query.limit = '1000';
  req.query.sort = 'LastName';
  // req.query.fields = 'FirstName,LastName'
  next();
};

// Route Handlers
exports.getAllContacts = catchAsync(async (req, res, next) => {
  // Execute Query
  const features = new APIFeatures(Contact.find(), req.query)
    .filter()
    .sort()
    .limitFields();
  // .paginate();
  const contacts = await features.query;

  // Send response
  res.status(200).json({
    status: 'success',
    results: contacts.length,
    data: {
      contacts,
    },
  });
});

exports.getMostRecentEdittedContact = catchAsync(async (req, res, next) => {
  // Execute Query
  const features = new APIFeatures(Contact.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const contacts = await features.query;

  // Send response
  res.status(200).json({
    status: 'success',
    results: contacts.length,
    data: {
      contacts,
    },
  });
});

exports.getCalendarEvents = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  const CalendarEvents = contact.CalendarEvents;
  // .aggregate([
  //   {
  //     $sortArray: { input: '$CalendarEvents', sortBy: { DateYYYYMMDD: 1 } },
  //   },
  // ]);
  if (!contact) {
    return next(new AppError('No contact found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      CalendarEvents,
    },
  });
});

exports.getCalendarEvent = catchAsync(async (req, res, next) => {
  const contact = await Contact.findOne({
    'CalendarEvents._id': { _id: req.params.id },
  });
  res.status(200).json({
    status: 'success',
    data: {
      contact,
    },
  });
});
exports.updateCalendarEvent = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  const contact = await Contact.findOneAndUpdate(
    { 'CalendarEvents._id': { _id: req.params.id } },
    { $set: { 'CalendarEvents.$': req.body } },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    status: 'success',
    data: {
      contact,
    },
  });
});
exports.getContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return next(new AppError('No contact found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      contact,
    },
  });
});
exports.updateContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!contact) {
    return next(new AppError('No contact found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { contact },
  });
});

exports.deleteEmptyField = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { $unset: req.body },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!contact) {
    return next(new AppError('No contact found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { contact },
  });
});

exports.deleteContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) {
    return next(new AppError('No contact found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getContactByPolicyRenewDate = catchAsync(async (req, res, next) => {
  // console.log(`Policy1RenewMMDD: ${req.params.Policy1RenewMMDD}`);
  const contacts = await Contact.find({
    $or: [
      {
        Policy1RenewMMDD: req.params.PolicyRenewDate,
      },
      {
        Policy2RenewMMDD: req.params.PolicyRenewDate,
      },
      {
        Policy3RenewMMDD: req.params.PolicyRenewDate,
      },
      {
        Policy4RenewMMDD: req.params.PolicyRenewDate,
      },
    ],
  });
  res.status(200).json({
    status: 'success',
    results: contacts.length,
    type: 'renewal',
    data: {
      contacts,
    },
  });
});

exports.getContactOnceAllEventTypes = catchAsync(async (req, res, next) => {
  const dateYYYYMMDD = req.params.VariousCalFormats;
  const dateMMDD = req.params.VariousCalFormats.slice(5, 10);
  const dateDD = req.params.VariousCalFormats.slice(8, 10);
  let renewalDate = Date.parse(req.params.VariousCalFormats);
  let renewalMMDD = new Date(
    renewalDate +
      1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * 28 /*# of days*/
  )
    .toJSON()
    .slice(5, 10);
  const contactsWCalEvents = await Contact.find({
    $or: [
      {
        'CalendarEvents.DateYYYYMMDD': dateYYYYMMDD,
      },
    ],
  });
  const contactsWRecurEvents = await Contact.find({
    $or: [
      {
        MonthlyEvent1DD: dateDD,
      },
      {
        MonthlyEvent2DD: dateDD,
      },
      {
        YearlyEvent1MMDD: dateMMDD,
      },
      {
        YearlyEvent2MMDD: dateMMDD,
      },
    ],
  });
  const contactsWRenewals = await Contact.find({
    $or: [
      {
        Policy1RenewMMDD: renewalMMDD,
      },
      {
        Policy2RenewMMDD: renewalMMDD,
      },
      {
        Policy3RenewMMDD: renewalMMDD,
      },
      {
        Policy4RenewMMDD: renewalMMDD,
      },
    ],
  });
  contactsWCalEvents.forEach((element) => (element.Type = 'event'));
  contactsWRecurEvents.forEach((element) => (element.Type = 'recurring'));
  contactsWRenewals.forEach((element) => (element.Type = 'renewal'));
  const contacts = contactsWCalEvents.concat(
    contactsWRecurEvents,
    contactsWRenewals
  );
  res.status(200).json({
    status: 'success',
    results: contacts.length,
    type: 'various',
    data: {
      contacts,
    },
  });
});

exports.getAllContactsWithCalEvents = catchAsync(async (req, res, next) => {
  const contacts = await Contact.find({
    'CalendarEvents.DateYYYYMMDD': req.params.DateYYYYMMDD,
  });
  res.status(200).json({
    status: 'success',
    results: contacts.length,
    type: 'event',
    data: {
      contacts,
    },
  });
});

exports.getAllAnnualEvents = catchAsync(async (req, res, next) => {
  const contacts = await Contact.find({
    'AnnualEvents.DayOfYear': req.params.DayOfYear,
  });
  res.status(200).json({
    status: 'success',
    results: contacts.length,
    type: 'annual',
    data: {
      contacts,
    },
  });
});

exports.getAllSemiAnnualEvents = catchAsync(async (req, res, next) => {
  const contacts = await Contact.find({
    $or: [
      { 'SemiAnnualEvents.DayOfYear': req.params.DayOfYear },
      { 'SemiAnnualEvents.SecondDayOfYear': req.params.DayOfYear },
    ],
  });
  res.status(200).json({
    status: 'success',
    results: contacts.length,
    type: 'semiannual',
    data: {
      contacts,
    },
  });
});

exports.getAllMonthlyEvents = catchAsync(async (req, res, next) => {
  const contacts = await Contact.find({
    'MonthlyEvents.DayOfMonth': req.params.DayOfMonth,
  });
  res.status(200).json({
    status: 'success',
    results: contacts.length,
    type: 'monthly',
    data: {
      contacts,
    },
  });
});

exports.getAllWeeklyEvents = catchAsync(async (req, res, next) => {
  const contacts = await Contact.find({
    'WeeklyEvents.DayOfWeek': req.params.DayOfWeek,
  });
  res.status(200).json({
    status: 'success',
    results: contacts.length,
    type: 'weekly',
    data: {
      contacts,
    },
  });
});

exports.getRecurEvents = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  const WeeklyEvents = contact.WeeklyEvents;
  let RecurEvents = WeeklyEvents;
  let Type = 'Weekly';
  const MonthlyEvents = contact.MonthlyEvents;
  if (MonthlyEvents.length) {
    RecurEvents = MonthlyEvents;
    Type = 'Monthly';
  }
  const SemiAnnualEvents = contact.SemiAnnualEvents;
  if (SemiAnnualEvents.length) {
    RecurEvents = SemiAnnualEvents;
    Type = 'SemiAnnual';
  }
  const AnnualEvents = contact.AnnualEvents;
  if (AnnualEvents.length) {
    RecurEvents = AnnualEvents;
    Type = 'Annual';
  }
  // .aggregate([
  //   {
  //     $sortArray: { input: '$CalendarEvents', sortBy: { DateYYYYMMDD: 1 } },
  //   },
  // ]);
  if (!contact) {
    return next(new AppError('No contact found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    type: Type,
    data: {
      RecurEvents,
    },
  });
});

exports.getContactLastName = catchAsync(async (req, res, next) => {
  // console.log(req.params.LastName);
  const contacts = await Contact.find({ LastName: req.params.LastName });
  res.status(200).json({
    status: 'success',
    data: {
      contacts,
    },
  });
});

exports.createContact = catchAsync(async (req, res, next) => {
  const newContact = await Contact.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      contact: newContact,
    },
  });
});

// work on this with more appropriate queries
exports.getContactStats = catchAsync(async (req, res, next) => {
  const stats = await Contact.aggregate([
    {
      $match: { Phone: { $gte: '0' } },
    },
    {
      $group: {
        _id: null,
        // _id: { $toUpper: '$FirstName' }, if you want stats grouped
        totalNumberOfContacts: { $sum: 1 },
        numContactsWithEHV: { $sum: 'Phone' },
        avgEHV: { $avg: '$Phone' },
        minEHV: { $min: '$Phone' },
        maxEHV: { $max: '$Phone' },
      },
    },
    {
      $sort: { FirstName: 1 },
    },
    {
      // just an example
      $match: { _id: { $ne: 'EASY' } },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});
