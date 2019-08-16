<template >
<div class='main'>
             <div class='mongo-data' v-on:click='textToSpeech()'> 
                 {{io_mongo.fullDocument._id}} | {{io_mongo.fullDocument.fecha}}
                 
            </div>
  </div>
</template>
<script>
    var available_voices;
    var textoActual=''
    var english_voice = '';
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
                this.textoActual = this.io_mongo.fullDocument.fecha
            }

        },
        data(){
            return {
                io_mongo:{
                    fullDocument:{
                        _id:'',
                        fecha:''
                    }
                },
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