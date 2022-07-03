const express = require("express");
const contactsRouter = express.Router();

const {
  ctrlWrapper,
  validation,
  authenticate,
} = require("../../middlewares");

const {
  addContactSchema,
  patchContactSchema
} = require("../../schemas");

const {
  getContacts,
  getById,
  addNewCont,
  deleteContact,
  changeContact,
  changeContactStats
} = require("../../controllers/contacts");

contactsRouter.get("/", authenticate, ctrlWrapper(getContacts));

contactsRouter.get("/:contactId", authenticate, validation(addContactSchema), ctrlWrapper(getById));

contactsRouter.post("/", authenticate, ctrlWrapper(addNewCont));

contactsRouter.delete("/:contactId", authenticate, ctrlWrapper(deleteContact));

contactsRouter.put("/:contactId", authenticate, validation(patchContactSchema), ctrlWrapper(changeContact));

contactsRouter.patch("/:contactId", authenticate, validation(patchContactSchema), ctrlWrapper(changeContactStats));

module.exports = contactsRouter;