'use strict'
const redis = require('redis')
const moment = require('moment')
const replace = require('replace-string')
let self = module.exports = {

  conexion: function () {
    return new Promise((resolve, reject) => {
      let mensaje = null
      console.log(`lanzo conexion redis ip: ${process.env.IP_REDIS}`)
      if(global.redis_client){
        console.log("cliente redis ya creado")
        return
      }
      global.redis_client = redis.createClient(6379, process.env.IP_REDIS,
        {
          retry_strategy: function (options) {
            // 180 MINUTOS DE TIEMPO PARA SACAR LA CONEXION
            if (options.total_retry_time > 1000 * 60 * 180) {
              return new Error('Retry time exhausted')
            }
            return 1000 * 5
          }
        }
      )
      global.redis_client.on('connect', function () {
        // impide que se guarde un buffer de envío sobre una conexión
        // no disponible
        this.client.should_buffer = false
        mensaje = { 'estado': 'conectado', 'hora': moment().format('YYYY-MM-DD HH:mm:ss') }
        resolve(mensaje)
      })

      global.redis_client.on('error', function (error) {
        mensaje = { 'estado': 'error', 'hora': moment().format('YYYY-MM-DD HH:mm:ss') }
        reject(new Error('redis:error > $ ' + error))
      })
      global.redis_client.on('reconnecting', function (mensaje) {
        mensaje = { 'estado': 'reconexion', 'hora': moment().format('YYYY-MM-DD HH:mm:ss') }
        reject(new Error('redis:reconexion > $ ' + moment().format('YYYY-MM-DD HH:mm:ss')))
      })
      global.redis_client.on('end', function () {
        mensaje = { 'estado': 'finalizado', 'hora': moment().format('YYYY-MM-DD HH:mm:ss') }
        reject(new Error('redis:fin_conexion > $ ' + moment().format('YYYY-MM-DD HH:mm:ss')))
      })
      global.redis_client.on('info', function (message) {
        console.log( `recibe > message: ${message}`)
      })
      // global.redis_client.on('dht22', function (message) {
      //   console.log( `dht22 > message: ${message}`)
      // })
    })
  },
  cargaCalendario: function(){
      return new Promise((resolve, reject) => {
        global.redis_client.get('calendario',function(error,result){
            if(!result && !error){
              console.info("redis: calendario no encontrado")
                self.setCalendario().then(result=>{
                  if(result){
                    resolve(result)
                    
                  }
              }) 
            }
            if(result){
              resolve(result)
            }
        })
        
      })
    
  },
  setNumVarsCalendar: function(calendario){
      calendario.dias.forEach(data=>{
        data.horarios.forEach(horas=>{
          horas.inicio_num= parseInt(horas.inicio.replace(':',''))
          horas.fin_num= parseInt(horas.fin.replace(':',''))

        })
      })

  },
  setCalendario:function() {
    return new Promise((resolve, reject) => {
      const calendario = require(global.pathBase+'/calendarios/horario.json')
      self.setNumVarsCalendar(calendario)
      global.redis_client.set('calendario',JSON.stringify(calendario),function(error,result){
              if(error){
                reject(error)
              }
              if(result){
                if(result)
                console.info("redis: calendario default cargado")
                resolve(calendario)
              }
            })
    })
    
  },
  setBroadCastMessage:function(channel,message){
    // function ok() { return arguments.callee.name } 
    console.log( `public > channel: ${channel}, message: ${message}`)
    global.redis_client.publish(channel,message)
  }
}