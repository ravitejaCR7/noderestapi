const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//creating userInfo Schema

const UserTableSchema = new Schema(
    {
        name: String,
        address: String,
        dateOfBirth: Date,
        email: { type: String, unique: true },
        password: String,
        personPic: { type:String, required: true}
    }
);

const UserTable = mongoose.model('UserTable', UserTableSchema);

module.exports = UserTable;