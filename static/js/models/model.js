function PeerCollection() {
  var _me = this;
  _me.peers = {};

  _me.room_id = window.location.pathname;
  _me.id = document.cookie.split('=')[1]


  window.mediaConstraints = {
              optional: [],
              mandatory: {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: true
              }
            };

  window.iceServers = {
    iceServers: [{
      url: 'stun:23.21.150.121'
    }, {
      url: "stun:stun.l.google.com:19302"
    }, {
      url: "stun:stun.sipgate.net"
    }, {
      url: "stun:217.10.68.152"
    }, {
      url: "stun:stun.sipgate.net:10000"
    }, {
      url: "stun:217.10.68.152:10000"
    }]
  };

  var video_constraints = {
    mandatory: {},
    optional: []
  };

  _me.stream = null;



  _me.addPeer = function(user_id) {
    var connection = new RTCPeerConnection(window.iceServers);
    if(_me.peers[user_id])
        return;
    _me.peers[user_id] = {
      connection: connection,
      status: 'active',
      offer: null,
      answer: null
    };
  }
  _me.get= function(user_id){
    return _me.peers[user_id];
  }

}
window.peers = new PeerCollection();
