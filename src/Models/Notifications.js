const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//creating userInfo Schema

const NotifiFrndReqSchema = new Schema(
    {
        emailFrom: String,
        emailTo: String,
        accepted: Boolean
    }
);


module.exports = mongoose.model('NotifiFrndReqSchemaTable', NotifiFrndReqSchema);
