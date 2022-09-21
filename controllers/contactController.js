const Contact = require('./../models/contactModel');

// Route Handlers

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({
      status: 'Bart success',
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

exports.updateContact = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { contact: '<Updated contact here...>' },
  });
};

exports.deleteContact = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
