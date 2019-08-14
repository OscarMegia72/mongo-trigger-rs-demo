const moment = require('moment')
const config = require('../../../config')
const needle = require('needle')
var request = require("request");
let self=module.exports={
    getRssByApi:function(){
        // // needle('get','http://localhost:4000/rss?tipo=feed-noticias').then(function(response){
        // //     console.log('$$',response)
        // // }).catch(function(err) {
        // //     console.log('needle',err)
        // //   })
        //   needle.get('http://localhost:4000/rss?tipo=feed-noticias', function(error, response, body) {
        //     if (!error && response.statusCode == 200)
        //       console.log(body);
        //   });
        return new Promise((resolve, reject)=>{
            var options = { method: 'GET',
            url: 'http://localhost:4000/rss',
            qs: { tipo: 'feed-noticias' },
            headers: 
                { 'cache-control': 'no-cache',
                    Connection: 'keep-alive',
                    'accept-encoding': 'gzip, deflate',
                    cookie: 'Cookie_1=value',
                    Host: 'localhost:4000',
                    'Postman-Token': '5247109f-d804-4fb0-a933-33caa6df79e9,96841045-d257-458f-886e-54e80c9f2ee1',
                    'Cache-Control': 'no-cache',
                    Accept: '*/*',
                    'User-Agent': 'PostmanRuntime/7.15.0' 
                } 
            };  
            request(options, function (error, response, body) {
            if (error) reject(error);
                resolve(JSON.parse(body))
            })
        
        })

    },
   
}