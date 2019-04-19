const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//creating FriendSchema

const FriendSchema = new Schema(
    {
        emailKey: { type: String, unique: true },
        listEmail: [String]
    }
);


module.exports = mongoose.model('FriendSchemaTable', FriendSchema);
