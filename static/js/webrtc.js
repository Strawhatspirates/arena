function SocketController(){
  var _me = this;
  _me.socket = window.socket;

  _me.send_message = function(data){
    console.log(data.type);
    _me.socket.emit('msg', data);
  }
}

function Webrtc() {

  var _me =this;
  _me.peers = peers;
  _me.stream = null;



  _me.socket = new SocketController();

  function init(user_id) {

    _me.peers.addPeer(user_id);
    peer = _me.peers.get(user_id);

    peer.connection.onicecandidate = function(e){
      if(!e || !e.candidate)
                       return;
       event = JSON.parse(JSON.stringify(e.candidate));
       event.user_id = _me.peers.id;
       event.to_id = user_id;
       event.type = "icecandidate";
      _me.socket.send_message(event);
    }

    peer.connection.onsignalingstatechange = function(event) {
      console.log("Signalling  event state changed for " + user_id.toString());
      console.log(event);
    }
    peer.connection.oniceconnectionstatechange = function(event) {
      console.log("Ice event state changed for " + user_id.toString());
      console.log(event);
    }

    peer.connection.onaddstream = function(event){
      console.log("a stream added from "+user_id.toString());
      // View.addVideo(event.stream);
      var element = document.createElement("video-panel");
      element.src= URL.createObjectURL(event.stream);
      document.body.appendChild(element);
    }

    peer.connection.onremovestream = function(event){
      console.log("removing element");
      View.removeVideo(user_id);
    }
    peer.connection.addStream(_me.peers.stream);
  }

  _me.createOffer = function() {
    console.log("tryiing to createOFfer");
    delete _me.peers.peers[_me.peers.id];
    for(var user_id in _me.peers.peers){
      init(user_id);
      peer = _me.peers.get(user_id);
      peer.connection.createOffer(function(offer){
        peer.connection.setLocalDescription(offer, onSetSessionDescriptionSuccess, onSetSessionDescriptionError);
        console.log("sending offer");
         var sdp = JSON.parse(JSON.stringify(offer));
         sdp.user_id = _me.peers.id;
         sdp.to_id = user_id;
        _me.socket.send_message(sdp);
      }, function(err){
         console.error(err);
      },window.mediaConstraints);
    }
  }

  _me.forOffer = function(send_user_id, offer){
     console.log("======This is the got offer======");
     console.log(offer);
     console.log("==================================");
     init(send_user_id);
     peer = _me.peers.get(send_user_id);
     peer.connection.setRemoteDescription(new RTCSessionDescription(offer) ,onSetSessionDescriptionSuccess, onSetSessionDescriptionError);
     peer.connection.createAnswer(function(answer){
        peer.connection.setLocalDescription(answer, onSetSessionDescriptionSuccess, onSetSessionDescriptionError);
        console.log("sending answer");
        var sdp = JSON.parse(JSON.stringify(answer));
        sdp.user_id = _me.peers.id;
        sdp.to_id = send_user_id;
        _me.socket.send_message(sdp);
     },function(err){console.error(err)}, window.mediaConstraints);
  }

  _me.forAnswer = function(send_user_id, answer){
    console.log("==========This is the got answer=========");
    console.log(answer);
    console.log("=========================================");
    peer = _me.peers.get(send_user_id);
    peer.connection.setRemoteDescription(new RTCSessionDescription(answer) ,onSetSessionDescriptionSuccess, onSetSessionDescriptionError);
    console.log("setting remote description");
  }

  _me.forIce = function(send_user_id, ice){
    console.log("=============GOT THE ICE==============");
    console.log(ice);
    console.log("======================================");
    peer = _me.peers.get(send_user_id);
    console.log("reciving ice candidate");
    peer.connection.addIceCandidate(new RTCIceCandidate(ice));
    console.log("setting ice candidate");
  }

  function onSetSessionDescriptionSuccess() {
    console.log('Set session description success.');
  }

  function onSetSessionDescriptionError(error) {
    console.error('Failed to set session description: ' + error.toString());
  }

}
