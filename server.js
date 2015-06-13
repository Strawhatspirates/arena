var express=require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var shortid=require("shortid");
var uuid = require("node-uuid");
var cookieParser = require('cookie-parser')
var RTC = require('./socket.js')
var constants = require('./constants.js');


app.use(cookieParser());
app.use("/static",express.static(__dirname+"/static"));

app.get('/', function (req, res) {
  res.redirect('/'+shortid.generate());
});

app.get('/:id', function(req, res){
   var client_id = req.cookies.client_id;
   if (!client_id){
      res.cookie('client_id',  uuid.v4())
  }
  res.sendfile(__dirname+'/index.html');
});

RTC(io);

server.listen(constants.port, function(){
  console.log("the server started at port " + constants.port);
})
