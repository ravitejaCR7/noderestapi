let express = require('express');
let router = express.Router();

const multer = require('multer');
const storageStrategy = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }
);

const storageStrategyForPosts = multer.diskStorage(
    {
        destination: function (req, file, cb) {
            cb(null, './PostsBinaryData/');
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }
);

const fileFilters = function (req, file, cb) {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
    {
        cb(null, true);
    }
    else
    {
        cb(new Error('Wrong file type - profile pic'), false);
    }
};

const fileFiltersForPosts = function (req, file, cb) {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'video/mp4')
    {
        cb(null, true);
    }
    else
    {
        cb(new Error('Wrong file type - post data'), false);
    }
};

const upload = multer(
    {
        storage: storageStrategy,
        limits: {
            fileSize: 1024 * 1024 * 10
        },
        fileFilters
    }
);

const uploadVideos = multer(
    {
        storage: storageStrategy,
        limits: {
            fileSize: 1024 * 1024 * 10
        }
    }
);

const uploadImagesAndVideosToPosts = multer(
    {
        storage: storageStrategyForPosts,
        limits: {
            fileSize: 1024 * 1024 * 10
        },
        fileFiltersForPosts
    }
);

// Require the controllers WHICH WE DID NOT CREATE YET!!
var userTable_controller = require('../controllers/usertable.controller');


// a simple test url to check that all of our files are communicating correctly.
router.get('/test', userTable_controller.test);

router.post('/newUserCreation', upload.single('personPic'),userTable_controller.user_create);
router.post('/newUserCreationVideo', uploadVideos.single('personVideo'),userTable_controller.user_create_video);

router.get('/userInfo/:id', userTable_controller.user_details);

router.delete('/deleteUser/:id/delete', userTable_controller.user_delete);

router.put('/:id/update', userTable_controller.user_update);

router.get('/specificUserInfo/:email', userTable_controller.specific_user_details);

//login API

//get email and password from front end
router.get('/loginCheck/:email/:password', userTable_controller.specific_user_Login_check);


//Search for users
router.get('/searchName/:name', userTable_controller.search_user_details);


//search posts using title
router.get('/searchPostsUsingTitle/:friendId/:textEntered', userTable_controller.search_user_posts_with_this_title);

//queryStrings
router.get('/find', (req, res) => {
    if(req.query.name)
    {loginCheck
        res.status(200).send(`person method -- queryStr ${req.query.name} `);
    }
    else
    {
        res.send("person method");
    }
});

//paramProperties
router.get('/sampleGet2/:name', (req, res) => {
    res.send(`person method -- param property ${req.params.name}`);
});



//privacyTableCalls
router.get('/privacySettings/:email', userTable_controller.user_privacy_get);

router.post('/privacySettingsCreate', userTable_controller.user_privacy_post);

router.put('/privacySettingsChange/:email', userTable_controller.user_privacy_update);

router.get('/areTheseTwoConnected/:myId/:friendId', userTable_controller.areTheseTwoConnected);


//PostsMadeByUser
router.post('/emailDuplicationCheck', userTable_controller.emailDuplicationCheck)

router.post('/postedByThisUser',uploadImagesAndVideosToPosts.single('postImageOrVideo') , userTable_controller.user_posting_post);

router.get('/postedByThisUser/:email' , userTable_controller.user_posting_get);

router.get('/getThisPost/:id' , userTable_controller.user_posting_get_byId);

router.get('/deleteThisPost/:id' , userTable_controller.user_post_delete_byId);



//posts comments
router.post('/commentsOnThisPost',uploadImagesAndVideosToPosts.single('commentImageOrVideo') , userTable_controller.user_comments_post);

router.get('/commentsOnThisPostGet/:postId' , userTable_controller.user_comments_on_post_get);

router.get('/getThisComment/:commentId' , userTable_controller.user_comment_get_byId);


//Add Friend
router.get('/addFriendFirstTime/:email', userTable_controller.create_friend_list);

router.get('/acceptingFriendRequest/:fromEmail/:toEmail', userTable_controller.acceptingFriendRequest);

router.get('/removeFriend/:fromEmail/:toEmail', userTable_controller.removeFriend);


//Notifications for friends
router.get('/createNotificationForFriends/:fromEmail/:toEmail', userTable_controller.createNotificationForFriends);

router.put('/updateNotificationForFriends/:fromEmail/:toEmail', userTable_controller.updateNotificationForFriends);

router.get('/getTheFriendRequestInfo/:fromEmail/:toEmail', userTable_controller.getTheFriendRequestInfo);

router.get('/cancelNotificationOrRequest/:fromEmail/:toEmail', userTable_controller.cancelNotificationOrRequest);


router.get('/getFriendRequestNotifications/:email', userTable_controller.getFriendRequestNotifications)

//Notifications for comments
router.get('/isCommentableInfo/:friendId/:myId/:postId' , userTable_controller.isCommentableStatus);

router.get('/isCommentableStausChange/:commentId/:status' , userTable_controller.isCommentableStatusChange);

router.get('/isCommentableCreateNew/:friendId/:myId/:postId' , userTable_controller.isCommentableCreateNew);

router.get('/isCommentableRemoveNotification/:friendId/:myId/:postId' , userTable_controller.isCommentableRemoveNotification);

router.get('/commentsNotifications/:myId' , userTable_controller.commentsNotificationsByThisUser);

router.get('/thisCommentDetails/:commentId' , userTable_controller.thisCommentDetails);


//Messenging
router.get('/getTheChatRoom/:fromEmail/:toEmail', userTable_controller.getTheChatRoom);

router.get('/getTheChatRoomFriends/:fromEmail', userTable_controller.getTheChatRoomFriends);


//deletion part
router.get('/deleteThisUserFromUserTable/:friendId', userTable_controller.deleteThisUserFromUserTable);

router.get('/deleteThisUserFromPrivacyTable/:friendId', userTable_controller.deleteThisUserFromPrivacyTable);

router.get('/deleteThisUserFromChatTable/:friendId', userTable_controller.deleteThisUserFromChatTable);

router.get('/deleteThisUserFromCommentsTable/:friendId', userTable_controller.deleteThisUserFromCommentsTable);

router.get('/deleteThisUserFromFriendsTable/:friendId', userTable_controller.deleteThisUserFromFriendsTable);

router.get('/deleteThisUserFromNotifyCommentsTable/:friendId', userTable_controller.deleteThisUserFromNotifyCommentsTable);

router.get('/deleteThisUserFromNotifyFriendsTable/:friendId', userTable_controller.deleteThisUserFromNotifyFriendsTable);

router.get('/deleteThisUserFromPostsTable/:friendId', userTable_controller.deleteThisUserFromPostsTable);


//random generator
router.get('/generateRandomMails/:myId', userTable_controller.generateRandomMails);

module.exports = router;
