<template >
<div class='main'>
             <div class='mongo-data' v-on:click='textToSpeech()'> 
                 <!-- {{io_mongo.fullDocument._id}} | {{io_mongo.fullDocument.fecha}} -->
                 <p>{{io_mongo.fullDocument.title}}</p>
                 
                 
            </div>
  </div>
</template>
<script>
    var available_voices;
    var textoActual=''
    var english_voice = '';
    var texto_leido = true;
    Array.prototype.clear = function() {
    this.splice(0, this.length);
    };
    export default {
        sockets: {
            connect: function () {
                console.log('client vue > socket connected')
            },
            mongo: function(data){
                this.io_mongo=data
                this.textoActual = this.io_mongo.fullDocument.title
                this.textToSpeech()
            }

        },
        data(){
            return {
                io_mongo:{
                    fullDocument:{
                        _id:'',
                        fecha:'',
                        title:''
                    }
                },
                utter:{}
            }
        },
        methods:{
                textToSpeech: function( ){
                    console.log('$$$',texto_leido)
                    // if(texto_leido){
                        
                                        console.log("click")
                                        this.utter = new SpeechSynthesisUtterance();
                                        this.utter.rate = 1;
                                        this.utter.pitch = 0.5;
                                        
                                        this.utter.voice = english_voice;
                                        this.utter.text = this.textoActual;
                                        window.speechSynthesis.speak(this.utter);
                                        texto_leido=false;
                    // }
                    
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
                    texto_leido=true;
                }
        },
        
        
}
</script>