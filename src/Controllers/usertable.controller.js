let userTableModel = require('../Models/UserInfoJson');
let accountPrivacyTable = require('../Models/AccountPrivacyJson');
let userPostsTable = require('../Models/UserPostsJson');
let postsCommentsTable = require('../Models/PostsCommentsJson');
let notifiFrndReqTable = require('../Models/Notifications');
let friendsTable = require('../Models/Friends');
let chatRoomTable = require('../Models/ChatGroupsJson');
let notificationCommentsTable = require('../Models/NotificationsComments');
const Bcrypt = require("bcryptjs");

//Simple version, without validation or sanitation
exports.test = function (req, res) {
    res.send('Greetings from the Test controller!');
};

exports.user_create = function (req, res, next) {
    // console.log(req.file);
    var bool = false;
    req.body.password = Bcrypt.hashSync(req.body.password, 10);
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
    userTableModel.findOne ({ email: req.params.email }, function (err, userModel) {
        var flag = false;
        if (err) console.log (err);
        if (!userModel || !Bcrypt.compareSync(req.params.password, userModel.password)) {
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

exports.search_user_posts_with_this_title = function (req, res, next) {
    userPostsTable.find({textEntered : new RegExp(req.params.textEntered, 'i'), email: req.params.friendId }, function(err, userModel){
        var flag = false;
        if (err) console.log (err);
        if (!userModel) {
            console.log('no posts found');
            flag = true;
        }
        // const lst = userModel.map(user => user._id);
        console.log('posts'+userModel);
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
            res.status(500).send({"reply":"Privacy settings udpated error in server."});
        }
        res.status(200).send({"reply":"Privacy settings udpated."});
    });
};



exports.areTheseTwoConnected = function(req, res, next) {
    var privacySettings="";
    accountPrivacyTable.findOne({ email: req.params.friendId }, function (err, userModel) {
        privacySettings = userModel.privacy;
        console.log("pri : "+privacySettings);

        if(privacySettings === "Public")
        {
            res.status(200).send({"res": true});
        }
        else if(privacySettings === "Private")////Friends////Friends of friends
        {
            res.status(200).send({"res": false});
        }
        else if(privacySettings === "Friends")
        {
            console.log("from : "+req.params.myId+" to : "+req.params.friendId);
            friendsTable.findOne( { emailKey: req.params.friendId, listEmail: req.params.myId }, function (err, friendsListObj) {
                console.log("from : "+err+" to : "+friendsListObj);
                if(err){
                    res.status(500).send({"res":"areTheseTwoConnected - friend error in server."});
                }
                if( friendsListObj ) {
                    res.status(200).send({"res": true});
                }
                else{
                    res.status(200).send({"res": false});
                }
            });
        }
        else if(privacySettings === "Friends of friends") {
            console.log("from : "+req.params.myId+" to : "+req.params.friendId);

            //to check if they both are directly related
            friendsTable.findOne({
                emailKey: req.params.friendId,
                listEmail: req.params.myId
            })
                .then(friendsListObj => {
                    if( friendsListObj ) {
                        console.log("directly friends");
                        res.status(200).send({"res": true});
                        return new Error({ ERROR_CODE: "FOUND" });
                    }


                    return friendsTable.findOne({ emailKey: req.params.friendId }).select({ "listEmail": 1, "_id": 0});

                })
                .then(list =>{
                    var emails = Array.from(list.listEmail);
                    return friendsTable.find({ emailKey: emails }).select(["emailKey", "listEmail"]);
                })
                .then(friends => {
                    for (let i = 0; i < friends.length; i++){
                        const { listEmail } = friends[i];
                        if (listEmail.includes(req.params.myId)) {
                            return res.status(200).send({"res":true});
                        }
                    }

                    return res.status(200).send({
                        "res":false
                    })
                })
                .catch(ex => {
                    if (ex.ERROR_CODE === "FOUND") {
                        return res.status(200).send({"res":true});
                    }
                    console.error(ex);
                    res.status(500).send({
                        "res":"areTheseTwoConnected - friend error in server.",
                        ex
                    });
                })
        }
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


exports.user_post_delete_byId = function (req, res, next) {
    userPostsTable.findByIdAndRemove(req.params.id, function(err, userModel){
        if (err) {
            console.log(err);
            return next(err);
        }

        if(userModel){
            console.log( "post details"+userModel );
            postsCommentsTable.deleteMany( {postId: userModel._id }, function (err, model) {
                if(err) console.log(err);
                res.send({"res":true});
            } );

            notificationCommentsTable.deleteMany( {postId: userModel._id }, function (err, commentsModel) {
                if(err) console.log(err);
            } );
        }
        else {
            res.send({"res":true});
        }

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
                    else {
                        //already friends
                        resStr = "3";
                        console.log("three : "+userModel);
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

exports.getFriendRequestNotifications = function (req, res, next) {
    notifiFrndReqTable.find({emailTo: req.params.email, accepted: false}, function (err, notiFrndReqs) {
        if (err) {
            console.log(err);
            res.status(500).send("Internal Server Error");
            return next(err);
        }
        res.send(notiFrndReqs);
    });
};

exports.isCommentableStatus = function (req, res, next) {

    notificationCommentsTable.findOne({
        commentedByEmail: req.params.myId,
        commentedOnEmail: req.params.friendId,
        postId: req.params.postId
    }, function (err, userModel) {


        if (err) {
            console.log(err);
            res.status(500).send({"error": "server side error in getting the request comment info"});
        }
        if (userModel) {
            console.log('isCommentableStatus done');

            res.status(200).send({userModel});

        } else {
            res.send({userModel});
        }
    });
};

exports.isCommentableStatusChange = function (req, res, next) {


    notificationCommentsTable.findByIdAndUpdate(req.params.commentId, {$set: {status: req.params.status}}, function (err, product) {
        if (err) {
            console.log(err);
            res.send({"res": 0});
            return next(err);
        }
        console.log("updated the comment status");
        res.send({"res": 1});
    });

    /*notificationCommentsTable.findOneAndUpdate( { commentedByEmail: req.params.friendId, commentedOnEmail: req.params.myId, postId: req.params.postId }, {$set: {status: req.params.status}} , function(err, userModel) {


        if (err) {
            console.log(err);
            res.status(500).send({"error":"server side error in updating the request comment info"});
        }
        if (userModel) {
            console.log('isCommentableStatusChange done');

            res.status(200).send({ "response":"successfully updated the status" });

        }
        else{
            res.send({"response": "no such notification"});
        }
    });*/
};

exports.isCommentableCreateNew = function (req, res, next) {

    var isCommentableNewObj = new notificationCommentsTable(
        {
            commentedOnEmail: req.params.friendId,
            commentedByEmail: req.params.myId,
            status: 1,
            postId: req.params.postId
        }
    );

    isCommentableNewObj.save(function (err) {
        if (err) {
            res.send({"response": "comments notification created un-successfully"});
            return next(err);
        }
        res.send({"response": "created successfully"});
    });

};


exports.isCommentableRemoveNotification = function (req, res, next) {

    notificationCommentsTable.findOneAndRemove({
        commentedByEmail: req.params.myId,
        commentedOnEmail: req.params.friendId,
        postId: req.params.postId,
    }, function (err, userModel) {

        if (err) {
            console.log(err);
            res.status(500).send({"error": "server side error in updating the request comment info"});
        }
        if (userModel) {
            console.log('isCommentableRemoveNotification done');

            res.status(200).send({"response": "deleted successfully"});

        } else {
            res.send({"response": "no such notification"});
        }
    });

};


exports.commentsNotificationsByThisUser = function (req, res, next) {

    notificationCommentsTable.find({commentedOnEmail: req.params.myId, status: 1}, function (err, userModel) {
        console.log("param : " + req.params.myId);
        var flag = false;
        if (err) {
            console.log(err);
            res.status(500).send({"error": "server side error in getting the posts data"});
        }
        if (!userModel) {
            console.log('no user found');
            flag = true;
        }
        // const lst = userModel.map(user => user._id);
        console.log('comments notification for this user: ' + userModel);
        res.send({userModel, "error": flag});

    });

};


exports.thisCommentDetails = function (req, res, next) {

    notificationCommentsTable.findById(req.params.commentId, function (err, userModel) {
        if (err) return next(err);
        res.send(userModel);
    });

};


exports.getTheChatRoom = function (req, res, next) {
    var bool = false;

    console.log("from : " + req.params.fromEmail + " to : " + req.params.toEmail);
    chatRoomTable.findOne({
        fromEmail: req.params.fromEmail,
        toEmail: req.params.toEmail
    }, function (err, userModel) {


        if (err) {
            console.log(err);
            res.status(500).send({"error": "server side error in getting the posts data"});
        } else if (userModel) {
            bool = true;
            console.log('found chatId in from - to');

            res.status(200).send({userModel, "response": "from:to"});

        } else if (!userModel) {
            console.log('not found chatId in from - to');
        }

        if (!bool) {
            chatRoomTable.findOne({
                fromEmail: req.params.toEmail,
                toEmail: req.params.fromEmail
            }, function (err, userModel) {

                if (err) {
                    console.log(err);
                    res.status(500).send({"error": "server side error in getting the posts data"});
                }
                if (userModel) {
                    console.log('found chatId in to - from');


                    res.status(200).send({userModel, "response": "to:from"});

                } else if (!userModel) {
                    console.log('not found chatId in to - from');

                    var chatRoomObj = new chatRoomTable(
                        {
                            fromEmail: req.params.fromEmail,
                            toEmail: req.params.toEmail
                        }
                    );

                    chatRoomObj.save(function (err, userModelCreated) {
                        if (err) {
                            console.log(err);
                            return next(err);
                        } else {
                            console.log("chatGroup : " + userModelCreated);
                            res.status(200).send({userModelCreated, "reply": "created the chat"});
                        }
                    });
                }

                // res.status(200).send({ userModel, "response":"create the chat" });


            });
        }
    });
};


exports.getTheChatRoomFriends = function (req, res, next) {

    friendsTable.findOne({emailKey: req.params.fromEmail}, function (err, userModel) {
        if (err) return next(err);
        res.send(userModel);
    });
};


exports.deleteThisUserFromUserTable = function (req, res, next) {

    userTableModel.findOneAndRemove({email: req.params.friendId}, function (err, userModel) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.send({"res":true});
    });
};

exports.deleteThisUserFromPrivacyTable = function (req, res, next) {

    accountPrivacyTable.findOneAndRemove({email: req.params.friendId}, function (err, userModel) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.send({"res":true});
    });
};


exports.deleteThisUserFromChatTable = function (req, res, next) {

    chatRoomTable.deleteMany({ fromEmail: req.params.friendId } , function (err, userModel) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.send({"res":true});

    });
};

exports.deleteThisUserFromCommentsTable = function (req, res, next) {

    postsCommentsTable.deleteMany({commentedEmail: req.params.friendId}, function (err, userModel) {
        if (err) {
            console.log(err);
            return next(err);
        }

        res.send({"res":true});
    });
};


exports.deleteThisUserFromFriendsTable = function (req, res, next) {

    friendsTable.findOneAndRemove({emailKey: req.params.friendId}, function (err, userModel) { //findOneAndRemove
        if (err) {
            console.log(err);
            return next(err);
        }
        if(userModel) {
            var lstOfFriends = userModel.listEmail;
            console.log("lstOfFriends : "+lstOfFriends);

            friendsTable.find({ emailKey: lstOfFriends }, ["emailKey", "listEmail"], function (err, userModel1) {
                console.log("inside length : "+userModel1.length);
                for(var i = 0; i<userModel1.length; i++) {
                    console.log("inside lengthhhh : "+userModel1[i]);
                    friendsTable.findOneAndUpdate( {emailKey: userModel1[i].emailKey}, {$pull: {listEmail: req.params.friendId}} , (err, finalList) => { //findOneAndUpdate
                        console.log("final list : : : : "+finalList);
                    } );
                }
                res.status(200).send({"res":true});
            });
        }
        else {
            res.send({"res":true});
        }
    });
};

exports.deleteThisUserFromNotifyCommentsTable = function (req, res, next) {

    notificationCommentsTable.deleteMany({commentedByEmail: req.params.friendId}, function (err, userModel) {
        if (err) {
            console.log(err);
            return next(err);
        }


        notificationCommentsTable.deleteMany({commentedOnEmail: req.params.friendId}, function (err, userModel) {
            if (err) {
                console.log(err);
                return next(err);
            }

            res.send({"res":true});

        });
    });
};


exports.deleteThisUserFromNotifyFriendsTable = function (req, res, next) {

    notifiFrndReqTable.deleteMany({emailFrom: req.params.friendId}, function (err, userModel) {
        if (err) {
            console.log(err);
            return next(err);
        }

        notifiFrndReqTable.deleteMany({emailTo: req.params.friendId}, function (err, userModel) {
            if (err) {
                console.log(err);
                return next(err);
            }

            res.send({"res":true});

        });

    });
};


exports.deleteThisUserFromPostsTable = function (req, res, next) {

    userPostsTable.deleteMany({email: req.params.friendId}, function (err, userModel) {
        if (err) {
            console.log(err);
            return next(err);
        }
        res.send({"res":true});
    });
};

exports.emailDuplicationCheck = function (req, res, next) {
    console.log(req.body);
    userTableModel.findOne ({ email: req.body.email }, function (err, userModel) {
        var flag = true;
        console.log("email "+req.body.email);
        if (err) console.log (err);
        if (!userModel) {
            console.log('user not found');
            flag = false;
        }
        // do something with user
        res.send(flag);
    });

};


exports.generateRandomMails = function (req, res, next) {

    friendsTable.findOne( { emailKey: req.params.myId }, function (err, friendsModel) {
        if(err) {
            console.log(err);
            res.status(500).send({"res":false});
        }


        var myFriendsList = friendsModel.listEmail;
        myFriendsList.push(req.params.myId);
        console.log("lst : "+myFriendsList);

        userTableModel.find( { }, (err, userModel) => {
            if(err) {
                console.log(err);
                res.status(500).send({"res":false});
            }

            var allUsers = userModel.map( a => a.email );
            console.log("allUsers : "+allUsers);

            var diffList = arr_diff(myFriendsList, allUsers);

            console.log("diff : "+diffList);
            var rand = diffList[Math.floor(Math.random() * diffList.length)];
            console.log("rand : "+rand);

            res.status(200).send({"res":true, "randomId":rand});

        } );


    } );

};

function arr_diff (a1, a2) {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } else {
            a[a2[i]] = true;
        }
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
}