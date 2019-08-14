const fsStore = require('cache-manager-fs');
const cacheManager = require('cache-manager');
const ttl=3600*8
var config = {
    memoryCache :cache(ttl),
    keycaching :"__NEWS_CACHING__",
    develop: {
        
    },
    pro:{
        
    },
    formato_fecha: 'YYYY.MM.DD HH:mm:ss'
}
function cache(_ttl){
    return cacheManager.caching({store: fsStore, options:{max: 100, ttl: _ttl, path:__dirname+"/cache"}})
}
module.exports = config