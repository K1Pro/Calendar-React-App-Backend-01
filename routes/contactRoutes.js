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
  .route('/ContactsWithEvents')
  .get(contactController.getAllContactsWithCalEvents);

router
  .route('/:id')
  .get(contactController.getContact)
  .patch(contactController.updateContact)
  .delete(contactController.deleteContact);

router
  .route('/Policy1RenewMMDD/:Policy1RenewMMDD')
  .get(contactController.getContactByPolicy1RenewMMDD);

router.route('/events/:id').get(contactController.getCalendarEvents);

router
  .route('/lastname/:LastName')
  .get(contactController.getContactLastName)
  .patch(contactController.updateContact)
  .delete(contactController.deleteContact);

module.exports = router;
