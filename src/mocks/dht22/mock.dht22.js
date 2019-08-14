const dotenv = require('dotenv') 
dotenv.config()
global.config = require('../../../config')
const redis= require('../../server/redis/RedisClient')
const moment = require('moment')
const config = require('../../../config')
let temperature=19.0
let humedad=35.0
function broadCastRedis(){
    redis.conexion().then(result=>{
        console.info('ini mock-redis')
      console.log(result)
      if(result){
            redis.setBroadCastMessage('info','arranque mocks-dht22')
            setInterval(x=>{
                dataSend()
            },process.env.REFRESH_MOCK_DHT22)

      }
      })
 }
function dataSend(){
    temperature+=0.2
    humedad+=1.0
   
    let mockdata={
        temperature: parseFloat(temperature).toFixed(2),
        humedad: parseFloat(humedad).toFixed(2),
        fecha: moment().format(config.formato_fecha)
        
    }
    redis.setBroadCastMessage('dht22',JSON.stringify(mockdata))
    // reset values
    if(temperature>21.5){
        temperature=19.0
    }
    if(humedad>50){
        humedad=35.0
    }
}
broadCastRedis()