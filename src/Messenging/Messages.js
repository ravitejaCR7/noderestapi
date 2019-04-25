var socket  = require('socket.io');
var temp = require("../index");

var io = socket.listen(temp.serverObj);

io.on("connection", (socket) => {
    console.log("connection to IO established");

    socket.on('join', function(data){
        //joining

        console.log("data from front end -- "+data);

        socket.join(data.userRoom);

        console.log(data.userName + ' joined the room : ' + data.userRoom);

        socket.broadcast.to(data.userRoom).emit('new user joined', {user:data.userName, message:'has joined this room.'});
    });

    socket.on('leave', function(data){

        console.log(data.userName + 'left the room : ' + data.userRoom);

        socket.broadcast.to(data.userRoom).emit('left room', {user:data.userName, message:'has left this room.'});

        socket.leave(data.userRoom);
    });

    socket.on('message',function(data){

        io.in(data.userRoom).emit('new message', {user:data.userName, message:data.message});
    });

});
