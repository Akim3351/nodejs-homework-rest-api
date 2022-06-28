const { NotFound, BadRequest } = require("http-errors");
const { addContactSchema, patchContactSchema } = require("../schemas");
const { Contact } = require("../models/contact");

const getContacts = async (req, res, next) => {
  try {
		const contacts = await Contact.find({});
		res.status(200).json({
			status: "success",
			contacts,
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findOne({_id: contactId});

    if (!result) {
      throw new NotFound(`Contact with Id ${contactId} was not found!!`);
    }

		res.status(200).json({
			status: "success",
			code: 200,
			data: { result },
		});
  } catch (error) {
    next(error);
  }
};

const addNewCont = async (req, res, next) => {
  try {
    const { error } = addContactSchema.validate(req.body);
    if (error) {
      throw new BadRequest();
    }

    const result = await Contact.create(req.body);
		res.status(201).json({
			status: "success",
			code: 201,
			data: { result },
		});
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const result = await Contact.findByIdAndRemove(contactId);

    if (!result) {
      throw new NotFound(`Contact with Id ${contactId} was not found or already deleted!!`);
    }

		res.status(200).json({
			status: "success",
			code: 200,
			data: { result },
		});
  } catch (error) {
    next(error);
  }
};

const changeContact = async (req, res, next) => {
  try {
    const { error } = addContactSchema.validate(req.body);
    if (error) {
      throw new BadRequest();
    }

    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
    console.log(result);
    if (!result) {
      throw new NotFound(`Contact with Id ${contactId} was not found!`);
    }
		res.status(200).json({
			status: "success",
			code: 200,
			data: { result },
		});
  } catch (error) {
		if (error.message.includes("validation failed")) {
			throw new BadRequest();
		}
    next(error);
  }
};

const changeContactStats = async (req, res, next) => {
  try {

    const { contactId } = req.params;
		const { error } = patchContactSchema.validate(req.body);

    		if (error) {
			throw new BadRequest();
		}

    const favoriteKey = "favorite" in req.body;

		if (!favoriteKey) {
			throw new NotFound("Key 'favorite' doesn`t exist");
		}
    
    const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
    console.log(result);
    if (!result) {
      throw new BadRequest();
    }
    res.json(result);
  } catch (error) {
    if (error.message.includes("validation failed")) {
			throw new NotFound();
		}

    next(error);
  }
};

module.exports = {
  getContacts,
  getById,
  addNewCont,
  deleteContact,
  changeContact,
  changeContactStats,
};