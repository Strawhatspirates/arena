function socketio(io){
  var mongo = require('./backend.js');
  var $ = require('jquery-deferred');
  io.on('connection', function(socket){

      socket.on('register', function(data){
          var room_id = data.room_id,
              user_id = data.user_id,
              socket_id = socket.id;
           mongo.addorUpdateEntity(user_id, room_id, socket_id);
      });

      socket.on('getregistered', function(data){
        var def = mongo.getUserIdsforRoom(data.room_id);

        def.done(function(data){
           var user_ids = [];
           data.forEach(function(user){
             user_ids.push(user.user_id);
           })
           socket.emit('registered', user_ids);
        });
      });

      socket.on('msg', function(data){
        console.log(data.type + "sent by "+ data.user_id)
        mongo.getUser(data.to_id,function(doc){
          io.to(doc.socket_id).emit('msg', data);
        });
      })

      socket.on('disconnect', function(){
        console.log("got a disconnect event");
         mongo.removeSocket(socket.id);
      });

  });

}


module.exports = socketio;
