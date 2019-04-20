let userTableModel = require('../Models/UserInfoJson');
let accountPrivacyTable = require('../Models/AccountPrivacyJson');
let userPostsTable = require('../Models/UserPostsJson');
let postsCommentsTable = require('../Models/PostsCommentsJson');
let notifiFrndReqTable = require('../Models/Notifications');
let friendsTable = require('../Models/Friends');


//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.user_create = function (req, res, next) {
    // console.log(req.file);
    var bool = false;
    var userModel = new userTableModel(
        {

            name: req.body.name,
            address: req.body.address,
            dateOfBirth: req.body.dateOfBirth,
            email: req.body.email,
            password: req.body.password,
            personPic: req.file.originalname
        }
    );

    userModel.save(function (err) {
        if (err) {
            bool = true;
            return next(err);
        }
        res.send({"error": bool});
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
        res.send({"res":'Deleted User successfully!'});
    })
};

exports.user_update = function (req, res, next) {

    userTableModel.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, product) {
        if (err) return next(err);
        res.send({"res":'User Info udpated.'});
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
        res.send({userModel,"error":flag});
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

    console.log(req.file);

    var postModel = new userPostsTable(
        {
            email: req.body.email,
            datePosted: req.body.datePosted,
            textEntered: req.body.textEntered,
            postImageOrVideo: req.file.originalname,
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


exports.create_friend_list = function (req, res, next) {
    var friendsTableModel = new friendsTable(
        {
            emailKey: req.params.email,
            listEmail: [],
        }
    );

    friendsTableModel.save(function (err) {
        if (err) {
            console.log(err.toString());
            return next(err);
        }
        res.send({"res":'new friend list Created successfully'});
    });
};

exports.acceptingFriendRequest = function (req, res, next) {
    console.log("asd : "+req.params.fromEmail );
    friendsTable.findOneAndUpdate( { emailKey: req.params.fromEmail }, {$push : {listEmail : req.params.toEmail}}, function (err, product) {
        if (err) {
            console.log(err.toString());
            return next(err);
        }

        console.log("asd 111 : "+product);

        friendsTable.findOneAndUpdate( { emailKey: req.params.toEmail }, {$push : {listEmail : req.params.fromEmail}} , function (err, product) {
            if (err) {
                console.log(err.toString());
                return next(err);
            }


            notifiFrndReqTable.findOneAndUpdate( { emailFrom: req.params.toEmail, emailTo: req.params.fromEmail }, {$set: {accepted: true}} , function (err, product) {
                if (err) {
                    console.log(err.toString());
                    return next(err);
                }

                if(product){
                    console.log("changed the notifications table row to true if the friend accepts the request");
                }
            });


            res.send({"res":"friend List updated."});
        });
    });
};

exports.removeFriend = function (req, res, next) {
    console.log("asd : "+req.params.fromEmail );
    friendsTable.findOneAndUpdate( { emailKey: req.params.fromEmail }, {$pull : {listEmail : req.params.toEmail}}, function (err, product) {
        if (err) {
            console.log(err.toString());
            return next(err);
        }

        console.log("asd 111 : "+product);

        friendsTable.findOneAndUpdate( { emailKey: req.params.toEmail }, {$pull : {listEmail : req.params.fromEmail}} , function (err, product) {
            if (err) {
                console.log(err.toString());
                return next(err);
            }


            notifiFrndReqTable.findOneAndRemove( { emailFrom: req.params.fromEmail, emailTo: req.params.toEmail } , function (err, product) {
                if (err) {
                    console.log(err.toString());
                    return next(err);
                }

                if(product){
                    console.log("removing From to To in notification table");
                }
            });

            notifiFrndReqTable.findOneAndRemove( { emailFrom: req.params.toEmail, emailTo: req.params.fromEmail } , function (err, product) {
                if (err) {
                    console.log(err.toString());
                    return next(err);
                }

                if(product){
                    console.log("removing To to From in notification table");
                }

            });


            res.send({"res":"friend List updated."});
        });
    });
};


exports.createNotificationForFriends = function (req, res, next) {
    // console.log(req.file);
    var notificationModel = new notifiFrndReqTable(
        {

            emailFrom: req.params.fromEmail,
            emailTo: req.params.toEmail,
            accepted: false
        }
    );

    notificationModel.save(function (err) {
        if (err) {
            return next(err);
        }
        res.status(200).send({"reply":" Friend Request Notification created"});
    });
};



exports.updateNotificationForFriends = function (req, res, next) {
    // console.log(req.file);
    notifiFrndReqTable.findOneAndUpdate( { emailFrom: req.params.fromEmail, emailTo: req.params.toEmail } , {$set: {accepted: req.body.accepted}}, function (err, product) {
        if (err) {
            console.log(err.toString());
            return next(err);
        }
        res.send({"res":"friend notification Info udpated."});
    });
};


exports.getTheFriendRequestInfo = function (req, res, next) {
    var resStr = "1";
    var bool = false;


    console.log("from : "+req.params.fromEmail+" to : "+req.params.toEmail );
    notifiFrndReqTable.findOne( { emailFrom: req.params.fromEmail, emailTo: req.params.toEmail } , function(err, userModel) {


        if (err) {
            console.log(err);
            res.status(500).send({"error":"server side error in getting the posts data"});
        }
        if (userModel) {
            bool = true;
            console.log('friend req found 1');



            if(userModel.accepted == false){
                //new request which has not been accepted yet
                resStr = "2";
                console.log("two : "+userModel);
            }
            else
            {
                //already friends
                resStr = "3";
                console.log("three : "+userModel);
            }

            res.status(200).send({ userModel, "res": resStr });

        }

        if(!bool){
            notifiFrndReqTable.findOne( { emailFrom: req.params.toEmail, emailTo: req.params.fromEmail } , function(err, userModel) {

                if (err) {
                    console.log(err);
                    res.status(500).send({"error":"server side error in getting the posts data"});
                }
                if (userModel) {
                    console.log('friend req found 2');


                    if(userModel.accepted == false){
                        //toEmail has already sent request to fromEmail. fromEmail has to accept the request
                        resStr = "4";
                        console.log("four : "+userModel);
                    }
                }

                res.status(200).send({ userModel, "res": resStr });

            });
        }
    });
};


exports.cancelNotificationOrRequest = function (req, res, next) {
    // console.log(req.file);
    notifiFrndReqTable.findOneAndRemove( { emailFrom: req.params.fromEmail, emailTo: req.params.toEmail } , function (err, product) {
        if (err) {
            console.log(err.toString());
            return next(err);
        }
        res.send({"res":"cancelled friend request."});
    });
};
