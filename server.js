var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000;

users = [];
connections = [];

server.listen(port, () => {
    console.log('Server running at port %d', port);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// user connect
io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log("User connected: %s", connections.length);

    // user disconnect
    socket.on('disconnect', (data) => {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log("User disconnected: %s", connections.length);
    });
    // user send message
    socket.on('send message', (data) => {
        //console.log(data); 
        io.sockets.emit('new message', {msg: data, users: socket.username});
    });

    // new user
    socket.on('new user',(data) => {
        socket.username = data;
        users.push(socket.username);  
        updateUsernames();
        console.log("New users: " + socket.username);
    })

    updateUsernames = () => {
        io.sockets.emit('get users', users)
    }
});  



