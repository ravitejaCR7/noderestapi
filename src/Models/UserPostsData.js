const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//creating userInfo Schema

const UserPostsSchema = new Schema(
    {
        email: { type: String },
        datePosted: { type: String },
        textEntered: { type: String },
        postImageOrVideo: { type:String }
    }
);

const UserTable = mongoose.model('UserTable', UserTableSchema);

module.exports = UserTable;