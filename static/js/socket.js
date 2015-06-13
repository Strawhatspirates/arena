

getUserMedia({video: true, audio: true}, function(stream){
  peers.stream = stream;
  var element = document.createElement("video-panel");
  element.src = URL.createObjectURL(stream);
  document.body.appendChild(element);
  window.socket = io.connect();
  console.log("socket initialized");
  socket.emit('register',{user_id: peers.id, room_id:peers.room_id})
  socket.emit('getregistered', {room_id: peers.room_id});
  var webrtc = new Webrtc();
  socket.on('registered', function(data){
    console.log(data);
    data.forEach(function(id){
       if(peers.id != id)
       {
         peers.addPeer(id);
       }
    });
    webrtc.createOffer();
  })
  socket.on('msg', function(data){
    console.log("got a message");
      if(data.type == "offer"){
        webrtc.forOffer(data.user_id, data);}
      if(data.type == "answer"){
        webrtc.forAnswer(data.user_id, data);}
      if(data.type == "icecandidate"){
        webrtc.forIce(data.user_id, data);}
  });
}, function(error){console.log(error);})
