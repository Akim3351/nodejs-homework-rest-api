const { NotFound, BadRequest } = require("http-errors");
const { Contact } = require("../models/contact");

const getContacts = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const {page = 1, limit = 10} = req.query;
    const skip = (page - 1) * limit;
		const contacts = await Contact.find({owner: _id}, "", {skip, limit: Number(limit)}).populate("owner", "_id name email");
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
    const { _id } = req.user;
    const result = await Contact.create({...req.body, owner: _id});
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

    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
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
    const favoriteKey = "favorite" in req.body;

		if (!favoriteKey) {
			throw new NotFound("Key 'favorite' doesn`t exist");
		}
    
    const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
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