<template >
<div class='main'>
        <div class='aside-caldera'>
            
            <div class='caldera-info'>
                <div class='reloj'>{{io_message.hora_reloj}}</div>
                <div class='centigrados'>{{io_message.temperatura}}<sup>o</sup></div>
                <div class='humedad'>{{io_message.humedad}} % de humedad</div>
                <p >encendida: {{io_caldera.estado}}</p>
                 <p >   deseada: {{io_caldera.tramo.temperatura}}</p>
                 <p >   dhtt22: {{io_caldera.last_message.temperature}}</p>

                
                <div  v-if='!io_message.fuera_rango' class='dht22-ok'>OK</div>
                <div  v-if='io_message.fuera_rango' class='dht22-error'>401 - {{io_message.difseconds}} sec</div>
            </div>
            
        </div>

       <div class='aside'>
            <div class='noticias'>
                        <div class='aemet'>
                        Alpedrete 10/5 - Viento 10 km/h - Muy Nuboso
                        </div>
                        <span class='idfeed' v-on:click='textToSpeech()'>{{io_news.idfeed}}</span>
                        <span class='titulo' >{{io_news.title}}</span>
                    <span class='html-texto' v-html="io_news.content"></span>
                </div>
        
            

       </div>
      
   
  </div>
</template>
<script>
    var available_voices;
    var textoActual=''
    var english_voice = '';
    // var utter ;

    Array.prototype.clear = function() {
    this.splice(0, this.length);
    };
    export default {
        sockets: {
            connect: function () {
                console.log('client vue > socket connected')
            },
            estado: function(data) {
                this.io_message=data
            },
            noticia: function(data) {
                this.io_news=data
                this.textoActual= data.title
                this.textToSpeech()

            },
            caldera: function(data){
                console.log('estado caldera',data)
                this.io_caldera=data
            }

        },
        data(){
            return {
                io_message:'estado-sensores',
                io_news:{
                    idfeed:"feed-noticias",
                    title:"titulo noticia",
                    content:"contenido html noticia"
                },
                io_caldera: {},
                utter:{}

         
            }
        },
        methods:{
                textToSpeech: function( ){
                    console.log("click")
                    this.utter = new SpeechSynthesisUtterance();
                    this.utter.rate = 1;
                    this.utter.pitch = 0.5;
                    
                    this.utter.voice = english_voice;
                    this.utter.text = this.textoActual;
                    window.speechSynthesis.speak(this.utter);
                }
        },
        created(){
            
        },
        mounted() {
                available_voices = window.speechSynthesis.getVoices();
                for(var i=0; i<available_voices.length; i++) {
                    if(available_voices[i].lang === 'es-ES') {
                        english_voice = available_voices[i];
                        break;
                    }
                }
                if(english_voice === '')
                    english_voice = available_voices[0];
                this.utter = new SpeechSynthesisUtterance();
                this.utter.rate = 1;
                this.utter.pitch = 0.5;
                
                this.utter.voice = english_voice;
                // event after text has been spoken
                this.utter.onend = function() {
                    //alert('Speech has finished');
                }
        },
        
        
}
</script>