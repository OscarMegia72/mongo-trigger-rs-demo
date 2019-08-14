const moment = require('moment')
const config = require('../../../config')
let self=module.exports={
    conectoEvento:function(){
        global.sincro.on('refresh',function(message){
            console.log('recibo << getDataState refresh: ',message)
            validoTimeSpan()
        })
        global.sincro.on('dht22',function(message){
            console.log('recibo << getDataSttae dht22: ', message)
            global.sincro.last_message=JSON.parse(message)
            validoTimeSpan()
        })
    },
    validoEstados:function(dif){
        let estado={}
        if(dif>=process.env.DHT22_FUERA_RANGO){
            estado={
            
                seconds:dif,
                fecha:moment().format(config.formato_fecha),
                fuera_rango:true
            }
        }else{
            estado={
                seconds:dif,
                fecha:moment().format(config.formato_fecha),
                fuera_rango:false
            }
        }
        estado.temperatura= global.sincro.last_message.temperature
        estado.humedad=global.sincro.last_message.humedad
        estado.difseconds=dif
        estado.hora_reloj=moment().format('HH:mm')
        global.estado = estado
        global.io.sockets.emit('estado',estado)

    }
}
const validoTimeSpan=function(){
    if(global.sincro.last_message.fecha){
        let recibido = moment(global.sincro.last_message.fecha,config.formato_fecha)
        let ahora = moment()
        let dif=ahora.diff(recibido,'seconds')
        console.log(recibido.format(config.formato_fecha), ahora.format(config.formato_fecha))
        console.log(`timespan dht22 ${dif}`)
        self.validoEstados(dif)
    }
}