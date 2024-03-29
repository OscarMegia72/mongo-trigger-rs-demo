let Parser = require('rss-parser')
let parser = new Parser();
const moment = require('moment')
const arraySort = require('array-sort')
const hash = require("md5")
const prettyMilliseconds = require('pretty-ms');
const mongo = require('mongo-triggers-rs')
class GetNoticia{
    getByValue(map, searchValue) {
        for (let [key, value] of map.entries()) {
          if (value === searchValue)
            return key;
        }
      }
    async getNoticia(mapa_feeds, tipo){
        console.log("=============================")
        console.log("=============================")
        console.log(mapa_feeds, tipo)
        console.log("=============================")
        console.log("=============================")
        try{         
            let resumen = []
            let maxchar=512
            let pos=1
            let listaFeed=[]
            for (const feed_url of mapa_feeds.values()) {
                console.info("get feed:  "+feed_url    )
                    var feed = await parser.parseURL(feed_url)
                    let maxNoticias_by_feed=40
                    if(tipo==="feed-radios")maxNoticias_by_feed=20
                    if(feed){
                        listaFeed.push(`${this.getByValue(mapa_feeds,feed_url)}`)
                        for(var i in feed.items){
                           
                            if(feed.items[i].content){
                                //console.info("content length: "+feed.items[i].content.length)
                                feed.items[i].resumen=feed.items[i].content.substring(0,maxchar)
                                feed.items[i].resumen_ssr=feed.items[i].contentSnippet.substring(0,maxchar)
                                feed.items[i].resSize=feed.items[i].resumen.length
                                if(feed.items[i].content.length>maxchar){
                                    feed.items[i].resumen+= " {...}"
                                }
                                feed.items[i].resumen=feed.items[i].resumen.replace('&nbsp;','')
                            }
                            if(tipo==='feed-radios' && feed.image){
                                feed.items[i].imagen=feed.image.url
                            }
                            //add hash _id & feed source for mongodb
                            let idtemp=hash(JSON.stringify(feed.items[i].title))
                            feed.items[i]._id=idtemp
                            feed.items[i].idfeed=`${this.getByValue(mapa_feeds,feed_url)}`
                            feed.items[i].ordinal=pos.toString().padStart(3,'0')
                            pos++
                            //console.info(typeof feed.items[i].categories)
                            if(feed.items[i].categories && !Array.isArray(feed.items[i].categories) ){
                                feed.items[i].categories=null
                            }
                            if(feed.items[i].categories && typeof feed.items[i].categories[0]==='object'){
                                feed.items[i].categories=null
                            }
                            feed.items[i].horaEmision=moment(feed.items[i].isoDate).format('YYYY-MM-DD | HH:mm:ss')
                            feed.items[i].horas=prettyMilliseconds(Date.now()-Date.parse(feed.items[i].isoDate))
                            //
                            if(tipo!='feed-radios'){
                                feed.items[i].enclosure=null
                            }
                            if(maxNoticias_by_feed>0){
                                resumen.push(feed.items[i])
                                maxNoticias_by_feed--

                            }else{
                                console.info(`fin carga feed forzada: ${feed_url}`)
                                break
                            }
                           
                           
                        } 
                    }
                }
                // ordenado por fecha
                arraySort(resumen, 'isoDate',{reverse: true})
                let pos_filtro=1
                resumen.forEach(data=>{
                    data.pos_filtro=pos_filtro.toString().padStart(3,'0')
                    pos_filtro++;
                })
                console.info("feed count:  "+resumen.length)
                return {resumen:resumen , listaFeed:listaFeed}
        }catch(e){
            let error = e.name + ": " + e.message
            let mensaje  = e.message.includes('404') ? 'url incorrecta' : e.message
            console.log("$ "+mensaje)
            throw Error(mensaje)
        }    
        
    }
    
}

module.exports = {
    listaNoticias : [],
    noticias  :new GetNoticia(),
    getNoticias: function(){
        return new Promise((resolve,reject)=>{
            console.log('x-noticia')
            const feeds = require('./feed-noticias')
            this.noticias.getNoticia(feeds).then(data=>{
                return resolve(data.resumen)
            })
        })
       
    },
    mongoConexion: function(){
        
        mongo.setVerbose(true)
        mongo.sincro.on('change',(data)=>{
            console.log("=======================")
            console.log(data)
            console.log("=======================")
        })
        mongo.mongoConnection('mongodb://localhost:27017?w=0&readPreference=primary').then(result=>{
                mongo.createCollection('oscar-rt','pruebas',{}).then(x=>{
                    console.log('creo colección')
                    let pos=0
                   this.getNoticias().then(titles=>{
                        setInterval(()=>{
                            if(pos > titles.length-1)pos=0
                            console.log('save:', titles[pos].title)
                            mongo.saveElement('oscar-rt','pruebas',titles[pos])
                            pos++

                        },3000)
                   }).catch(e=>{
                       console.log(e)
                   })
                })
                

        })
    }
}
let a=module.exports.mongoConexion()
