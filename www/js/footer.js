if (user_id == 'not_login') {
    $('#login').show();    
} else {
    initialize();        
}


/* Refresh Message
setInterval(function(){
    
}, 3000);
 */
ons.ready(function() {
  var pullHook = document.getElementById('pull-hook');

  pullHook.addEventListener('changestate', function(event) {
    var message = '';

    switch (event.state) {
      case 'initial':
        message = 'Pull to refresh';
        break;
      case 'preaction':
        message = 'Release';
        break;
      case 'action':
        message = 'Loading...';
        break;
    }

    pullHook.innerHTML = message;
  });

  pullHook.onAction = function(done) {
        loadChatList();
        setTimeout(done, 1000);
  };
});

