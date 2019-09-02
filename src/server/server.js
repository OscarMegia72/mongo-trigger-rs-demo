#!/usr/bin/env node
const dotenv = require('dotenv') 
dotenv.config()
var app = require('./app');
var debug = require('debug')('myapp:server');
var http = require('http');
const port = normalizePort(process.env.PORT || '4000');
const path = require('path')


app.set('port', port);
var server = http.createServer(app);
global.io = require('socket.io')(server)
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
global.io.on('connection',ioConnection)
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
function onListening() {
  console.log("SERVER LISTENING: ", port)
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  global.bind=bind
  global.pathBase=path.join(__dirname,'../../')
}
function ioConnection(client){
  client.on('event',data=>{
    console.log(`ioConnection ${data}`)
  })
}
const mongo = require('mongo-triggers-rs')
mongo.setVerbose(true)
mongo.sincro.on('change',(data)=>{
    console.log("== mongo-sincro ==========")
    console.log(data.fullDocument)
    global.io.sockets.emit('mongo',data)
    console.log("==========================")
})
mongo.mongoConnection(process.env.URI_MONGODB)
.then(result=>{
  if(result){
    mongo.createEventRealTime('oscar-rt', 'pruebas')  
  }
})



