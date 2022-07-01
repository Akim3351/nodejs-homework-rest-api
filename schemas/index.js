const { addContactSchema, patchContactSchema } = require("./contactsSchema");
const { authSchema } = require('./authSchema');

module.exports = {
    addContactSchema,
    patchContactSchema,
    authSchema
};