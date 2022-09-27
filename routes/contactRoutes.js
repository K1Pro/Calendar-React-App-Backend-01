const express = require('express');

const contactController = require(`${__dirname}/../controllers/contactController`);

const router = express.Router();

// router.param('id', contactController.checkID);

router
  .route('/cross-sell')
  .get(contactController.aliasCrossSell, contactController.getContact);

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
