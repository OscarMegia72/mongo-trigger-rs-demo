
module.exports ={
    caching_file: function(req, res, next){
            if(!req.query.tipo){

                return next()
            }
            global.config.memoryCache.get(global.config.keycaching+req.query.tipo, function(err, result) {
            console.log(`key-render-caching: ${global.config.keycaching}`)
            if(err){
              console.log('err', err)
              return next()
            }
            if(result){
                req.caching=result
                console.log("=== CACHING RESULT ===========")
                console.log('key render expire: ',result.validez)
                console.log('modo: '+req.query.modo)
                if(result.data) console.log(result.data.length)
                console.log("==============================")
                return next()
            }else{
              console.log("=======CACHING PASS ==============")
              console.log(`caching middleware next`)
              console.log("==================================")
              return next()
            }
  
          });
    },
    logger: function(req, res, next){
      console.info("> ", req.method,req.url, req.query)
      next()
    }
}