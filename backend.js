function backend() {
  var mongo = require('mongoose');
  var $ = require('jquery-deferred');
  var Schema = mongo.Schema;
  var constants = require('./constants.js');
  mongo.connect(constants.url);
  var VideoSchema = new Schema({
    _id: String,
    user_id: String,
    socket_id: String,
    room_id: String,
  });

  var RoomSchema = new Schema({
    _id: String,
    user_id: String,
    socket: String
  });


  var Video = mongo.model('video', VideoSchema);
  var Room = mongo.model('room', RoomSchema);

  return {
    addorUpdateEntity: function(user_id, room_id, socket_id) {
      var video = new Video({
        _id: user_id,
        user_id: user_id,
        room_id: room_id,
        socket_id: socket_id
      });
      video.save(function(err) {
        if (err) {
          console.error(err);
        } else {
          console.log("video entity saved");
        }
      })
    },

    _getRoom: function(room_id) {
      return Video.find({
        room_id: room_id
      }).exec();
    },

    getSocketFromRoom: function(room_id, user_id, callback) {
      promise = this._getRoom(room_id);
      promise.then(function(entity) {
        entity.forEach(function(doc) {
          if (doc.user_id != user_id)
            callback(doc.socket_id);
        });
      }).error(function(error) {
        console.log(error);
      });
    },

    getUser: function(user_id, callback) {
      var video = Video.find({
        user_id: user_id
      }).exec();
      video.then(function(docs) {
        docs.forEach(function(doc) {
          callback(doc);
        })
      });
    },

    getUserIdsforRoom: function(room_id) {
      var diff = $.Deferred();
      var video = Video.find({
        room_id: room_id
      }).exec();
      video.then(function(docs) {
        diff.resolve(docs);
      });
      return diff.promise();
    },

    deleteEntity: function(user_id) {
      Video.find({
        user_id: user_id
      }, function(err, docs) {
        docs.remove();
      })
    },

    removeSocket: function(id) {
      Video.find({
        socket_id: id
      }, function(err, results) {
        results.forEach(function(doc) {
          doc.remove();
        })
      });
    },

    getUserBySocket: function(id) {
      return Room.findOne({
        socket: id
      }).exec();
    },

    getUserById: function(id){
      return Room.findOne({
        user_id: id
      }).exec();
    },

    deleteUserById: function(id){
     Room.findOneAndRemove({
       user_id: id
     }, function(err, docs){
       if(err){
         console.log(err);
       }
     });
   },

   deleteUserBySocket: function(id){
     Room.findOneAndRemove({
       socket: id
     }, function(err, docs){
       if(err){
         console.log(err);
       }
     });
   },

   addNewUser: function(data){
     var room = new Room(data);
     return room.save();
   }

  }
}


module.exports = backend();
