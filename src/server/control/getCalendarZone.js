const moment = require('moment')
const config = require('../../../config')
const ld = require('lodash')
const mongo_server = require ('../mongo/mongo_data')
let self=module.exports={
    conectoEvento:function(){
        global.sincro.on('refresh',function(message){
           self.revisoTramo()
        //    mongo_server.mongo_con().then(x=>{
        //     let data={
        //       fecha: moment().format('HH:mm:ss')
        //     }
        //     //this.conectado.db('raspi-caldera').collection('news_caldera').insertOne(data)
        //     mongo_server.insertDoc('raspi-caldera','news-caldera',data)
        //   })
        })
        
    },
    revisoTramo:function(){
        let time_actual= parseInt(moment().format('HHss'))
        let diaNumSemana = moment().format('d')
        let result = ld.find(global.calendar.dias[diaNumSemana].horarios,function(hora){
            return hora.inicio_num <= time_actual && hora.fin_num > time_actual
        })
        let caldera = true
        if(global.estado.fuera_rango){
                    console.log('==****====================')
                    console.log('VALORES FUERA DE RANGO ===')
                    console.log('==****====================')
        }else{
                    console.log('==========================')
                    
                    if(global.sincro.last_message.temperature< result.temperatura){
                        console.log('=====ENCIENDO CALDERA=======')
                        caldera = true
                    }else{
                        console.log('=====APAGO CALDERA=======')
                        caldera = false
                    }
                    console.log("$$ rango >>", JSON.stringify(result,4), JSON.stringify(global.sincro.last_message,4))
                    console.log('==========================')
                   
        }
        let estadoCaldera={
            estado: caldera,
            last_message: global.sincro.last_message,
            tramo: result

        }
        global.io.sockets.emit('caldera',estadoCaldera)
       
       
        
    }
}