let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);
let path = require('path');

users = [];
connections = [];

server.listen(8090);
console.log('Server Running...');

app.get('/', function(req,res){
    res.sendFile(__dirname+ '/Study_Space_Index.html');
});
app.get('/untitled.css', function(req,res){
    res.sendFile(__dirname+ '/untitled.css');
});

app.get('/download.jpg', function(req,res){
    res.sendFile(__dirname+ '/download.jpg');
});



io.on('connection', function(socket)
{
    connections.push(socket);
    console.log("Connected: %s sockets connected", connections.length);

    socket.on('disconnect', function()
    {

        users.splice(users.indexOf(socket.userName), 1);
        updateUserNames();
        connections.splice(connections.indexOf(socket),1)
        console.log("Disconnected: %s sockets connected", connections.length);

    });

    socket.on('Send Message', function(data)
    {
        console.log(data);
        io.sockets.emit('new message', {msg:data, user:socket.userName});
    });

    socket.on('new user', function(data, callback)
    {
        console.log(data);
        callback(true);
        socket.userName = data;
        users.push(socket.userName);
    });





});

