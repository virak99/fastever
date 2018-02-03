/* Will be delete soon */
localStorage.setItem('user_id', 'aaa');
localStorage.setItem('profile_name', 'Vong Virak');

setDefault('user_id', 'not_login');
setDefault('lang', 'en');


var URL = 'http://nekoten.sangskrit.com/fastever/';
var LANG = localStorage.getItem('lang');
var user_id = localStorage.getItem('user_id');


function initialize(){
    loadFriendList();
    loadChatList();
    loadUser();    
}


function setDefault(name, value){
    var a = localStorage.getItem(name);
    if (a == null){
        localStorage.setItem(name, value);                 
    }
}     

function changeLang(lang){
    LANG = lang;
    localStorage.setItem('lang', LANG);
}
function newMessage(){
    $('#new_message').show(); 
}

function register(){
    var name = $('#register #name').val();
    var email = $('#register #email').val();
    var password = $('#register #password').val();
    
    $.post(URL+'register.php', {name:name,email:email,password:password},function(data){
        if (data.includes('success')){
            ons.notification.alert('Register Success');
            $('#register').hide(); 
            localStorage.setItem('user_id', a[1]);
            localStorage.setItem('profile_name', name);
            user_id = a[1];
            initialize();
        }
    });
}

function logout(){
    localStorage.setItem('user_id', 'not_login');
    $user_id = 'not_login';
    window.location.href = 'index.html';    
}
function loadUser(){    
    setTimeout(function(){
        $('.dg #profile_pic').attr('src', profileUrl(user_id));
        $('.dg #profile_name').text(localStorage.getItem('profile_name'));
    }, 1000);
}

function pushPage(nav_id, page){
    var chat_nav = document.getElementById(nav_id);
    chat_nav.pushPage(page);
}

function loadChat(room_id, friend_id){
    if (friend_id == null) {
        pushPage('chat_nav', 'chat.html'); 
    } else {
        pushPage('friend_nav', 'chat.html'); 
    }
       
    $('.tabbar__content').css('bottom', '0');
    setTimeout(function(){
        $('#tabbar .tabbar:not(.tabbar--top)').hide();  
    }, 200);
    
    $.post(URL+'chat.php', {user_id:user_id, room_id:room_id, friend_id:friend_id}, function(data){

        var a = JSON.parse(data);
        var str = '';
        $('#room_id').val(a['room_id']);
        $('#friend_id').val(friend_id);
        $('#chat_title').text('Message');
        
        var c = a['messages'];
        for (var i = 0; i < c.length; i++){                    
            var b = c[i];
            if (b['sender_id'] != user_id) {
                str += '<div class="cv">';
                    str += '<div class="a">';
                        str += '<img src="'+profileUrl(b['sender_id'])+'" alt="" />';
                    str += '</div>';
                    str += '<div class="b">';
                        str += '<div class="c">';
                            str += b['sender_name'];
                        str += '</div>';
                        str += '<div class="d">';
                            str += b['message'];
                        str += '</div>';
                    str += '</div>';
                str += '</div>';
            } else {
                str += '<div class="dv">';
                    str += '<div class="a">';
                           str += b['message'];
                    str += '</div>';
                str += '</div>';                              
            }
        }
        $('#chat_body').html(str);  
        $('#chat_content').scrollTop($('#chat_content')[0].scrollHeight);
    });  
}



function send(){
    
    $("#msg_body").focus();
    var message = $('#msg_body').val();
    var room_id = $('#room_id').val();
    if (message == '') return false;
    var str = '<div class="dv">';
        str += '<div class="a">';
               str += message;
        str += '</div>';
    str += '</div>'; 
    $('#chat_body').append(str);
    $('#msg_body').val('');
    
    $('#chat_content').scrollTop($('#chat_content')[0].scrollHeight);
    
    $.post(URL+'send.php', {message:message, user_id:user_id, room_id:room_id}, function(data){
        if (data.includes('success')){
            
        } else {
            alert(data);
        }     
    });
    
    
}

function login(){    
    var email = $('#login #email').val();
    var password = $('#login #password').val();
    
    $.post(URL+'login.php', {name:name,email:email,password:password},function(data){
        var a = JSON.parse(data);
        if (a[0] == 'success'){
            ons.notification.alert('Login success');
            localStorage.setItem('user_id', a[1]);
            localStorage.setItem('profile_name', a[2]);
            user_id = a[1];
            initialize();
            $('#login').hide();    
        } else if (a[0] == 'fail'){
            ons.notification.alert('Login failed');
        }
    });
}

function profileUrl(id){
    return URL+'users/'+id+'/profile.jpg';
}

function loadFriendList(){
    $.post(URL+'friend_list.php',{user_id:user_id},function(data){

        var a = JSON.parse(data);
        var str = '';
        
        for (var i = 0; i < a.length; i++){
            var b = a[i];
            str += '<ons-list-item tappable onclick="loadChat(\'\' ,\''+b['user_id']+'\')">';
                str += '<div class="left">';
                    str += '<img class="list-item-thumbnail" src="'+profileUrl(b['user_id'])+'">';
                str += '</div>';
                str += '<div class="center">';
                    str += '<span class="list-item-title">'+b['name']+'</span>';
                str += '</div>';
            str += '</ons-list-item>';
        }
        $('#friend_list').html(str);
        
    });
}

function loadChatList(){
    $.post(URL+'chat_list.php',{user_id:user_id},function(data){
        var a = JSON.parse(data);
        var str = '';        
        for (var i = 0; i < a.length; i++){
            var b = a[i];
            str += '<ons-list-item tappable onclick="loadChat('+b['room_id']+')">';
                str += '<div class="left">';
                    str += '<img class="list-item__thumbnail" src="'+profileUrl(b['member_id'])+'">';
                str += '</div>';
                str += '<div class="center">';
                    str += '<span class="list-item__title">'+b['member_name']+'</span><span class="list-item__subtitle">'+b['last_msg']+'</span>';
                str += '</div>';
                str += '<div class="right">';
                    str += '<span class="list-item__title a">'+b['last_sent']+'</span>';
                str += '</div>';
            str += '</ons-list-item>';
        }
        $('#chat_list').html(str);        
        
    });
}