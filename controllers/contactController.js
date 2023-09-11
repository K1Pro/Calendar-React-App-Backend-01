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

exports.getUniqueContactAllEventTypes = catchAsync(async (req, res, next) => {
  function compare(a, b) {
    if (a.EventTime < b.EventTime) {
      return -1;
    }
    if (a.EventTime > b.EventTime) {
      return 1;
    }
    return 0;
  }
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
    $and: [
      {
        $or: [
          {
            Policy1RenewDate: { $regex: renewalMMDD + '$' },
          },
          {
            Policy2RenewDate: { $regex: renewalMMDD + '$' },
          },
          {
            Policy3RenewDate: { $regex: renewalMMDD + '$' },
          },
          {
            Policy4RenewDate: { $regex: renewalMMDD + '$' },
          },
        ],
      },
      { Status: { $nin: ['Do-Not-Renew'] } },
    ],
  });
  // Creates an EventTime value based on query and adds event type
  contactsWCalEvents.forEach((element) => {
    element.Type = 'event';
    let sortedCalEvents = element.CalendarEvents.filter((obj) => {
      return obj.DateYYYYMMDD === req.params.VariousCalFormats;
    });
    element.EventTime = sortedCalEvents[0].DateHHMMSS.replace('T', '');
  });
  contactsWRecurEvents.forEach((element) => {
    element.Type = 'recurring';
    element.EventTime = null;
  });
  contactsWRenewals.forEach((element) => {
    element.Type = 'renewal';
    element.EventTime = null;
  });

  // Sorts all calendar events
  contactsWCalEvents.sort(compare);

  // Combines all event types
  const contactsCombined = contactsWCalEvents.concat(
    contactsWRecurEvents,
    contactsWRenewals
  );

  // Removes duplicate contacts
  const contacts = contactsCombined.filter(
    (obj, index) =>
      contactsCombined.findIndex((item) => item.id === obj.id) === index
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

exports.getRenewals = catchAsync(async (req, res, next) => {
  // Create a new Date object for the current date
  const currentDate = new Date();

  // Get the month and year of the current date
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Calculate the month and year of the next month
  let nextMonth = currentMonth + 2;
  let nextYear = currentYear;

  if (nextMonth > 10) {
    // If the next month is greater than 11 (December), add 1 to the year and set the month to 0 (January)
    nextMonth = 0;
    nextYear += 1;
  }

  const contactsArray = [];

  for (let i = 0; i < 90; i++) {
    // console.log(i);
    const nextMonthDate = new Date(nextYear, nextMonth, -i);
    const nextMonthDateShort = nextMonthDate.toISOString().slice(5, 10);
    // console.log(nextMonthDate.toISOString().slice(5, 10));

    const renewalContacts1 = await Contact.find({
      $and: [
        { Policy1RenewDate: { $regex: nextMonthDateShort + '$' } },
        { Status: { $in: ['Customer'] } },
      ],
    });
    if (renewalContacts1.length > 0) {
      renewalContacts1.forEach((element) => {
        element.RenewDate = nextMonthDateShort;
        element.RenewNumber = 1;
      });
      contactsArray.push(renewalContacts1);
    }

    const renewalContacts2 = await Contact.find({
      $and: [
        { Policy2RenewDate: { $regex: nextMonthDateShort + '$' } },
        { Status: { $in: ['Customer'] } },
      ],
    });
    if (renewalContacts2.length > 0) {
      renewalContacts2.forEach((element) => {
        element.RenewDate = nextMonthDateShort;
        element.RenewNumber = 2;
      });
      contactsArray.push(renewalContacts2);
    }

    const renewalContacts3 = await Contact.find({
      $and: [
        { Policy3RenewDate: { $regex: nextMonthDateShort + '$' } },
        { Status: { $in: ['Customer'] } },
      ],
    });
    if (renewalContacts3.length > 0) {
      renewalContacts3.forEach((element) => {
        element.RenewDate = nextMonthDateShort;
        element.RenewNumber = 3;
      });
      contactsArray.push(renewalContacts3);
    }

    const renewalContacts4 = await Contact.find({
      $and: [
        { Policy4RenewDate: { $regex: nextMonthDateShort + '$' } },
        { Status: { $in: ['Customer'] } },
      ],
    });
    if (renewalContacts4.length > 0) {
      renewalContacts4.forEach((element) => {
        element.RenewDate = nextMonthDateShort;
        element.RenewNumber = 4;
      });
      contactsArray.push(renewalContacts4);
    }
  }

  const contacts = contactsArray.flat(2);
  // Create a new Date object for the first day of the next month

  // Send response
  res.status(200).json({
    status: 'success',
    results: contacts.length,
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
