var express = require('express');
var router = express.Router();
const moment = require('moment')
var expressVue = require("express-vue");
router.get('/', (req, res, next) => {

    req.vueOptions= {
        head: {
            title: 'Page Title',
            metas: [
                { property:'og:title', content: 'Page Title'},
                { name:'twitter:title', content: 'Page Title'},
            ]
        }
    }
    res.render('vista-vue', { title:'vista-vue'});
    //res.renderVue('index.vue', null, req.vueOptions);
  })
  module.exports = router;