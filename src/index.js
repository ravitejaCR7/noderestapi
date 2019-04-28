
const mongoose = require('mongoose');
const express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

console.log("Roonaldoooooo!");


let app = express();



app.use('/uploads',express.static('uploads'));
app.use('/PostsBinaryData',express.static('PostsBinaryData'));
app.use(bodyParser.json( {limit: '50mb', extended: true} ));
app.use(bodyParser.urlencoded({limit: '50mb' ,extended: true}));

mongoose.connect('mongodb://localhost/testaroo',{useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;

mongoose.connection.once('open', function () {
    console.log('connection has been made');
}).on('error', function () {
    console.log('failed to connect to mongoose');
});



let personsRoute = require('./routes/person');

app.use( (req, res, next) => {
    console.log(`${new Date().toString()} ====> ${req.originalUrl} `);
    next();
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method === "OPTIONS")
    {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use('/person', personsRoute);
app.use(express.static('public'));

// error handling
app.use((req, res, next) => {
    res.status(404).send("We think you are lost!");
});

var server = http.createServer(app);

var io = require('socket.io').listen(server);

const PORT = process.env.PORT || 3000;
var server =  app.listen(PORT, ()=> console.info(`server started listening on ${PORT}`));

module.exports.serverObj = server;

//Messenging
let messengingObject = require('./Messenging/Messages');


