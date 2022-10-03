const Contact = require(`${__dirname}/../models/contactModel`);
const APIFeatures = require(`${__dirname}/../utils/apiFeatures`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);

// Middleware
exports.aliasSorted = (req, res) => {
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

exports.getContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      contact,
    },
  });
});

exports.getContactLastName = catchAsync(async (req, res, next) => {
  console.log(req.params.LastName);
  const contact = await Contact.find({ LastName: req.params.LastName });
  res.status(200).json({
    status: 'success',
    data: {
      contact,
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

exports.updateContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: { contact },
  });
});

exports.deleteContact = catchAsync(async (req, res, next) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// work on this with more appropriate queries
exports.getContactStats = catchAsync(async (req, res, next) => {
  const stats = await Contact.aggregate([
    {
      $match: { EHV: { $gte: '0' } },
    },
    {
      $group: {
        _id: null,
        // _id: { $toUpper: '$FirstName' }, if you want stats grouped
        totalNumberOfContacts: { $sum: 1 },
        numContactsWithEHV: { $sum: 'EHV' },
        avgEHV: { $avg: '$EHV' },
        minEHV: { $min: '$EHV' },
        maxEHV: { $max: '$EHV' },
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
