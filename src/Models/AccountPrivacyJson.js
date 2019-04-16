const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//creating userInfo Schema

const AccountPrivacySchema = new Schema(
    {
        email: { type: String, unique: true },
        privacy: { type: String }
    }
);

const AccountPrivacyTable = mongoose.model('AccountPrivacyTable', AccountPrivacySchema);

module.exports = AccountPrivacyTable;