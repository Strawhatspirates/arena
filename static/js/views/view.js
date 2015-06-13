var View = {

   addVideo: function(user_id,stream){
     var element = document.createElement('video');
     element.setAttribute("id", user_id.toString());
     element.src = URL.createObjectURL(stream);
     element.play();
     document.body.appendChild(element);
   },

   removeVideo: function(user_id){
     var element = document.getElementById(user_id.toString());
   }
}
