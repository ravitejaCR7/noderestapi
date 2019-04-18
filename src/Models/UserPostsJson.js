const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//creating userInfo Schema

const UserPostsSchema = new Schema(
    {
        email: { type: String },
        datePosted: { type: String },
        textEntered: { type: String },
        postImageOrVideo: { type:String },
        isCommentable: {type: Boolean}
    }
);

const PostsTable = mongoose.model('PostsTable', UserPostsSchema);

module.exports = PostsTable;