let userTableModel = require('../Models/UserInfoJson');
let accountPrivacyTable = require('../Models/AccountPrivacyJson');
let userPostsTable = require('../Models/UserPostsJson');
let postsCommentsTable = require('../Models/PostsCommentsJson');


//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.user_create = function (req, res, next) {
    // console.log(req.file);
    var userModel = new userTableModel(
        {

            name: req.body.name,
            address: req.body.address,
            dateOfBirth: req.body.dateOfBirth,
            email: req.body.email,
            password: req.body.password,
            personPic: req.file.path
        }
    );

    userModel.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send('User Created successfully')
    });
};

exports.user_create_video = (req, res, next) =>{

    console.log(req.file);

};

exports.user_details = function (req, res, next) {
    userTableModel.findById(req.params.id, function (err, userModel) {
        if (err) return next(err);
        res.send(userModel);
    })
};

exports.user_delete = function (req, res, next) {
    // console.log(`delete req ${req.params.id}`);
    userTableModel.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted User successfully!');
    })
};

exports.user_update = function (req, res, next) {

    userTableModel.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, product) {
        if (err) return next(err);
        res.send('User Info udpated.');
    });
};

exports.specific_user_details = function (req, res, next) {
    userTableModel.findOne ({ email: req.params.email }, function (err, userModel) {
        var flag = false;
        if (err) console.log (err);
        if (!userModel) {
            console.log('user not found');
            flag = true;
        }
        // do something with user
        // res.send(userModel);
        res.send({userModel,"error":flag});
        // res.send({"id":userModel._id, "name":userModel.name, "address": userModel.address, });
    });
};

exports.specific_user_Login_check = function(req, res, next) {
    userTableModel.findOne ({ email: req.params.email, password: req.params.password }, function (err, userModel) {
        var flag = false;
        if (err) console.log (err);
        if (!userModel) {
            console.log('user not found');
            flag = true;
        }
        // do something with user
        // res.send(userModel);
        res.send({userModel,"error":flag});
        // res.send({"id":userModel._id, "name":userModel.name, "address": userModel.address, });
    });
};

exports.search_user_details = function (req, res, next) {
    userTableModel.find({name : new RegExp(req.params.name, 'i')}, function(err, userModel){
        var flag = false;
        if (err) console.log (err);
        if (!userModel) {
            console.log('no user found');
            flag = true;
        }
        // const lst = userModel.map(user => user._id);
        console.log('users'+userModel);
        res.send({userModel,"error":flag});
    });
};

exports.user_privacy_change = function(req, res, next) {
    accountPrivacyTable.findOne({ email: req.params.email }, function (err, userModel) {
        res.send("resss : "+req.params.email);
    });
};

exports.user_privacy_get = function(req, res, next) {
    accountPrivacyTable.findOne({ email: req.params.email }, function (err, userModel) {
        res.send("resss : "+req.params.email);
    });
};

exports.user_privacy_post= function(req, res, next) {

    var accountPrivacyModel = new accountPrivacyTable(
        {
            email: req.body.email,
            privacy: req.body.privacy
        }
    );

    accountPrivacyModel.save(function (err) {
        if (err) {
            return next(err);
        }
        res.status(200).send({"reply":"Privacy settings created udpated."})
    });

};

exports.user_privacy_update = function (req, res, next) {

    accountPrivacyTable.findOneAndUpdate({email: req.params.email}, {$set: {privacy: req.body.privacy}}, function (err, product) {
        if (err)
        {
            res.status(500).send({"reply":"Privacy settings udpated."});
        }
        res.status(200).send({"reply":"Privacy settings udpated."});
    });
};

exports.user_posting_post = function (req, res, next) {

    // console.log(req.file);
    let fileName;
    if(req.file) {
        fileName = req.file.originalname;
    }
    else {
        fileName = null;
    }

    var postModel = new userPostsTable(
        {
            email: req.body.email,
            datePosted: req.body.datePosted,
            textEntered: req.body.textEntered,
            postImageOrVideo: fileName,
            isCommentable: req.body.isCommentable
        }
    );

    postModel.save(function (err) {
        if (err) {
            res.status(500).send({"response":"error at server side in posting the post"});
        }
        res.status(200).send({"response":"Post Created successfully"});
    });

};

exports.user_posting_get = function (req, res, next) {
    userPostsTable.find({email : req.params.email}, function(err, userModel){
        var flag = false;
        if (err) {
            console.log(err);
            res.status(500).send({"error":"server side error in getting the posts data"});
        }
        if (!userModel) {
            console.log('no user found');
            flag = true;
        }
        // const lst = userModel.map(user => user._id);
        console.log('posts made by this user : '+userModel);
        res.send({userModel,"error":flag});
    });
};

exports.user_posting_get_byId = function (req, res, next) {
    userPostsTable.findById(req.params.id, function(err, userModel){
        var flag = false;
        if (err) {
            console.log(err);
            res.status(500).send({"error":"server side error in getting the posts data"});
        }
        if (!userModel) {
            console.log('no post found');
            flag = true;
        }
        // const lst = userModel.map(user => user._id);
        console.log('specific post by this id: '+userModel);
        res.send({userModel,"error":flag});
    });
};

exports.user_comments_post = function (req, res, next) {

    // console.log("asdasdasd : "+req.file);
    let fileName;
    if(req.file)
    {
        fileName = req.file.originalname;
    }
    else {
        fileName = null;
    }

    var postModel = new postsCommentsTable(
        {
            postId: req.body.postId,
            commentedEmail: req.body.commentedEmail,
            datePosted: req.body.datePosted,
            textEntered: req.body.textEntered,
            postImageOrVideo: fileName
        }
    );

    postModel.save(function (err) {
        if (err) {
            res.status(500).send({"response":"error at server side in posting the post"});
        }
        res.status(200).send({"response":"comment Created successfully"});
    });

};

exports.user_comments_on_post_get = function (req, res, next) {
    postsCommentsTable.find({postId : req.params.postId}, function(err, userModel){
        var flag = false;
        if (err) {
            console.log(err);
            res.status(500).send({"error":"server side error in getting the posts data"});
        }
        if (!userModel) {
            console.log('no user found');
            flag = true;
        }
        // const lst = userModel.map(user => user._id);
        console.log('comments made on this posts are: '+userModel);
        res.send({userModel,"error":flag});
    });
};

exports.user_comment_get_byId = function (req, res, next) {
    postsCommentsTable.findById(req.params.commentId, function(err, userModel){
        var flag = false;
        if (err) {
            console.log(err);
            res.status(500).send({"error":"server side error in getting the posts data"});
        }
        if (!userModel) {
            console.log('no post found');
            flag = true;
        }
        // const lst = userModel.map(user => user._id);
        console.log('specific comment by this id: '+userModel);
        res.send({userModel,"error":flag});
    });
};