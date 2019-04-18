const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//creating FriendSchema

const FriendSchema = new Schema(
    {
        email: [String]
    }
);


module.exports = mongoose.model('FriendSchemaTable', FriendSchema);
