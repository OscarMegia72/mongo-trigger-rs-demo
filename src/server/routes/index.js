var express = require('express');
var router = express.Router();
const moment = require('moment')
const mongo_server = require ('../mongo/mongo_data')
/* GET home page. */
router.get('/', function(req, res, next) {
  
  //res.render('index', { title: 'Express-Electron' });
  //res.render('noticias-vue', { title:'noticias-vue', tipo: req.query.tipo, listaFeed: listaFeed, data:mydata , validez:'no-caching'});
  res.render('vista-vue', { title:'vista-vue'});

});
router.get('/calendario', function(req, res, next) {
  res.json(global.calendar );
});

module.exports = router;
