#!/usr/bin/env node
var app = require('./app');
var debug = require('debug')('myapp:server');
var http = require('http');
const port = normalizePort(process.env.PORT || '4001');
const path = require('path')
const config = require('../../config')
const moment = require('moment')
const getDataState = require('../server/control/getDataState')
const getCalendarZone = require('../server/control/getCalendarZone')
const getNews = require('../server/control/getNews')
const mongo_server = require ('../server/mongo/mongo_data')

app.set('port', port);
var server = http.createServer(app);
global.io = require('socket.io')(server)
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
global.io.on('connection',ioConnection)
function cargaRss(){
  global.news={}
  getNews.getRssByApi().then(news=>{
    if(news.data && news.data.length>0){
      console.log("======= DATA NEWS ============")
      console.log(news.data[0].title)
      console.log("==============================")
      global.news.data= news.data
      global.news.pos=0
       // se lanza intervalos de noticias al front
      setInterval(x=>{
        if(global.news.pos===global.news.data.length-1)global.news.pos=0
        global.io.sockets.emit('noticia',global.news.data[global.news.pos])
        global.news.pos++
      },process.env.REFRESH_NEWS)
     

    }
  }).catch(error=>{
    console.error(error)
  })
}

//--
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
  // servicios
  let uri=process.env.URI_MONGODB
  console.log(uri)
  // mongo_server.mongo_con(uri).then(result=>{
  //   console.log("mongo_conectado, ",uri)
  //   mongo_server.createCollection("raspi-caldera",'news-caldera',{}).then(data=>{
  //     console.log("created_coll",data)
  //   }).catch(e=>{
  //     console.log("error",e)
  //   })

  // })
 
  globalSincro()
  redisConexion()
  cargaRss()
  getCalendarZone.conectoEvento()
}
function  globalSincro(){
  const events = require('events')
  global.sincro= new events.EventEmitter()
  global.sincro_interval=setInterval(x=>{
    let message=moment().format(config.formato_fecha)
    console.info('emit refresh '+message)
    global.sincro.emit("refresh",message)
  },process.env.SINCRO)
  // Conecta el evento de control general
  getDataState.conectoEvento()
  // inicializo primer mensaje
  let mockdata={
    temperature: parseFloat(21).toFixed(2),
    humedad: parseFloat(35).toFixed(2),
    fecha: moment().format(config.formato_fecha) 
  } 
  global.sincro.last_message=mockdata
  console.log('iniciliazo sincro.last_message', global.sincro.last_message)
  
}
function ioConnection(client){
  //console.log(client)
  client.on('event',data=>{
    console.log(`ioConnection ${data}`)
  })
}
// Carga de Redis Client y Calendario
function redisConexion(){
  console.info('ini redis')
  const redis= require('./redis/RedisClient')
  redis.conexion().then(result=>{
    console.log(result)
    if(result){
        redis.cargaCalendario().then(result=>{
            global.calendar=JSON.parse(result)
            console.log('=== trace calendar ====')
            console.log(global.calendar.dias[0].horarios[0])
            console.log('=======================')
            redis.setBroadCastMessage('info','arranque conexion redis-broadcast')
            //
            // Recepecion y suscripción a mock-dht22
            //
            global.redis_client.on('message', function (channel,message) {
              // console.log( `Recibe > ${channel} > ${message}`)
              if(channel==='dht22'){
                global.sincro.emit('dht22',message)
              }
            })
            global.redis_client.subscribe('dht22')
        })
    }
})
}


