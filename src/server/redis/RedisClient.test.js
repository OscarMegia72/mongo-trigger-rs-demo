const dotenv = require('dotenv') 
dotenv.config()
const path = require('path')
console.log(process.env.IP_REDIS)
const redis= require('./RedisClient')
global.pathBase=path.join(__dirname,'../../../')
redis.conexion().then(result=>{
    console.log(result)
    if(result){
        redis.cargaCalendario().then(result=>{
            global.calendar=result
            console.log(global.calendar)
        })
    }
})