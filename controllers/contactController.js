const Contact = require(`${__dirname}/../models/contactModel`);

// Route Handlers
exports.getAllContacts = async (req, res) => {
  try {
    // Build Query
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    const query = Contact.find(JSON.parse(queryStr));

    // Execute Query
    const contacts = await query;
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
