var express = require('express');
var router = express.Router();
var GetNoticia = require('../services/rss-get')
var moment = require('moment')
// let ttl = process.env.MODO==="develop" ? global.config.develop.ttl : global.config.pro.ttl
// console.log("ttl base: ",ttl)
router.get('/', async (req, res, next)=> {
  try{
            let {resumen,listaFeed }=await resultados(req.caching,req.query.tipo)
            let myrest={
              data: resumen,
              listaFeed: listaFeed
            }
            res.json( myrest);
  }catch(e){
    console.error('route get ',req.query, e)
    res.json({error:true, data:JSON.stringify(e)})
  }  
})
async function resultados(cache, tipo){
  if(!cache){
    let gnoticia = new GetNoticia() 
    let contenido = require('../services/'+tipo)
    var {resumen, listaFeed } = await gnoticia.getNoticia(contenido,tipo)
    
    let ahora= moment()
    let fecha_caducidad=ahora.add(global.config.ttl,'seconds').format('YYYY-MM-DD | HH:mm:ss')
    global.config.memoryCache.set(global.config.keycaching+tipo, {error:false,data:resumen,listaFeed:listaFeed, validez: fecha_caducidad}, {ttl: global.config.ttl}, function(err) {
      if (err) { throw err; }
      console.log("fecha caducidad caching ",fecha_caducidad)
    })
  }else{
    var resumen = cache.data
    var listaFeed = cache.listaFeed
  }
  return {resumen, listaFeed}
}
module.exports = router;
