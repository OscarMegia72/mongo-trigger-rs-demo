const MongoClient = require( "mongodb");
//const MongoHistorico =require( "./MongoHistorico")
//-


module.exports = {
  conectado:undefined,
  pos:1,
  mongo_con: function(url){
    return new Promise((resolve,reject)=>{
     
      if(this.conectado){
        console.log("RESOLVE YA CONECTAD")
        resolve(this.conectado) 
      }else{
        MongoClient.connect('mongodb://localhost:27017',
          )
          .catch(err => {
              process.exit(1)
            })
          .then(async client => {
              //await MongoHistorico.injectDB(client)
              this.conectado=client
              console.log("MongoDb-Cliente $ Conectado")
              console.log("$",this.conectado.s.url)
              console.log("===========================")
              //console.log("$$ my_this", this)
              console.log("===========================")
             resolve(client) 
            })
        }
    })
   
    },
  createCollection: function(database,col, options){
      return new Promise((resolve,reject)=>{
        try{
          this.conectado.db('raspi-caldera').createCollection(col,options,function(err,res){
              console.log("Collection created!");
              this.pos++
              resolve('ok')
          })
  
        }catch (e) {
          reject(e)
        }
      })
      
    },
    async insertDoc(db,coleccion,data){
        try {
          //return await mycapped.insertOne(data)
          return await this.conectado.db(db).collection(coleccion).insertOne(data)
        } catch (e) {
          console.error(`Unable to post Document: ${e}`)
          return { error: e }
        }
    }
    
  
}