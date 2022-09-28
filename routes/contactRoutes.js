const express = require('express');

const contactController = require(`${__dirname}/../controllers/contactController`);

const router = express.Router();

// router.param('id', contactController.checkID);

router
  .route('/sorted')
  .get(contactController.aliasSorted, contactController.getAllContacts);

router.route('/contact-stats').get(contactController.getContactStats);

router
  .route('/')
  .get(contactController.getAllContacts)
  .post(contactController.createContact);

router
  .route('/:id')
  .get(contactController.getContact)
  .patch(contactController.updateContact)
  .delete(contactController.deleteContact);

router
  .route('/lastname/:LastName')
  .get(contactController.getContactLastName)
  .patch(contactController.updateContact)
  .delete(contactController.deleteContact);

module.exports = router;
