const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//creating userInfo Schema

const PostsCommentsSchema = new Schema(
    {
        postId: { type: String, required:true },
        commentedEmail: { type: String },
        datePosted: { type: String },
        textEntered: { type: String },
        postImageOrVideo: { type:String },
    }
);

const CommentsTable = mongoose.model('CommentsTable', PostsCommentsSchema);

module.exports = CommentsTable;