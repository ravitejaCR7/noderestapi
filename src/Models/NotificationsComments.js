const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//creating userInfo Schema

const NotifiCommentsSchema = new Schema(
    {
        commentedOnEmail: String,
        commentedByEmail: String,
        status: Number,
        postId: String
    }
);


module.exports = mongoose.model('NotifiCommentsSchemaTable', NotifiCommentsSchema );
