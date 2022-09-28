const Contact = require(`${__dirname}/../models/contactModel`);
const APIFeatures = require(`${__dirname}/../utils/apiFeatures`);

// Middleware
exports.aliasSorted = (req, res, next) => {
  req.query.limit = '1000';
  req.query.sort = 'LastName';
  // req.query.fields = 'FirstName,LastName'
  next();
};

// Route Handlers
exports.getAllContacts = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        contact,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getContactLastName = async (req, res) => {
  try {
    console.log(req.params.LastName);
    const contact = await Contact.find({ LastName: req.params.LastName });
    res.status(200).json({
      status: 'success',
      data: {
        contact,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createContact = async (req, res) => {
  try {
    const newContact = await Contact.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        contact: newContact,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: 'Invalid Data set' });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: { contact },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// work on this with more appropriate queries
exports.getContactStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
