var io = require('socket.io-client');
var socket = io.connect('http://localhost:4000', {reconnect: true});

// Add a connect listener
socket.on('connect', function (socket) {
    console.log('mock.client.io > connected!');
    
})
socket.on('disconnect', function (socket) {
    console.log('mock.client.io > disconnect!');
    
})
socket.on('estado',function(data){
    console.log("recido io ",data)
})