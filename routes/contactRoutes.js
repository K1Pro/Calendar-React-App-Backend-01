const express = require("express");
const contactController = require("./../controllers/contactController");
const router = express.Router();

router.param("id", contactController.checkID);

// prettier-ignore
router
  .route("/")
  .get(contactController.getAllContacts)
  .post(contactController.createContact);

// prettier-ignore
router
  .route("/:id/:x?")
  .get(contactController.getContact)
  .patch(contactController.updateContact)
  .delete(contactController.deleteContact)

module.exports = router;
