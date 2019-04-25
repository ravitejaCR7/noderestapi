const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//creating FriendSchema

const ChatGroupsSchema = new Schema(
    {
        fromEmail: { type: String},
        toEmail: { type: String}
    }
);


module.exports = mongoose.model('ChatGroupsSchemaTable', ChatGroupsSchema);
