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

//queryStrings
router.get('/find', (req, res) => {
    if(req.query.name)
    {
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


//PostsMadeByUser
router.post('/postedByThisUser',uploadImagesAndVideosToPosts.single('postImageOrVideo') , userTable_controller.user_posting_post);

router.get('/postedByThisUser/:email' , userTable_controller.user_posting_get);

router.get('/getThisPost/:id' , userTable_controller.user_posting_get_byId);

//posts comments
router.post('/commentsOnThisPost',uploadImagesAndVideosToPosts.single('commentImageOrVideo') , userTable_controller.user_comments_post);

router.get('/commentsOnThisPostGet/:postId' , userTable_controller.user_comments_on_post_get);

router.get('/getThisComment/:commentId' , userTable_controller.user_comment_get_byId);


module.exports = router;