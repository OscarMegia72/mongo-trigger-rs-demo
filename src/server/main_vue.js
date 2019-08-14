require('./public/stylesheets/less/echoshow/echo.less')
import Vue from 'vue';
import indexVue from './components/index.vue'
import VueSocketIO from 'vue-socket.io'
Vue.use(new VueSocketIO({
    debug: true,
    connection: `//${window.location.host}`,
}))
new Vue({ el:'#app',render: h => h(indexVue) })


