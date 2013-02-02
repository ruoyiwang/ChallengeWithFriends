var graph_api_prefix = 'https://graph.facebook.com/';
var roys_token = 'AAACEdEose0cBAOjm3xNXVGN7L5OxRkZBdQsGXyO2Ai0sNh2RCXsyKA82qYEhMemZCi5bNQ0Mv6RIjSzh3tET7OvGhuiw1riZCo1cjJmYwZDZD';
var current_user_id;


//need the following information
//id
//friends
//albums / photos
//videos

function make_url(call){
    return call + '&access_token='+roys_token;
}

function get_https(url){
    $.get(url,function(data,status){
        alert("Data: " + data + "\nStatus: " + status);
        d = data;
    });
}

function get_self_id(){
    var url = make_url('/me?fields=id');
    FB.api(url, function(response){
        current_user_id = response.id;
        //do other shit that other ppl needs
    });
}

//fuck repeated code
function populate_top_three_images(id1, id2, id3){
    call = '/me?fields=id,friends.uid('+id1+').fields(username)';
    call = make_url(call);
    FB.api(url, function(response){
        friend_user_name = response.username;

        profile_pic_url = 'https://graph.facebook.com/'+friend_user_name+'/picture';
        //got their usernme
        document.getElementById('somerandomtshit').innerHTML ="<img src="+profile_pic_url+" width='100' height='100'>";
        //do other shit that other ppl needs
    });


    call = '/me?fields=id,friends.uid('+id2+').fields(username)';
    call = make_url(call);
    FB.api(url, function(response){
        friend_user_name = response.username;

        profile_pic_url = 'https://graph.facebook.com/'+friend_user_name+'/picture';
        //got their usernme
        document.getElementById('someotherrandomshit').innerHTML ="<img src="+profile_pic_url+" width='100' height='100'>";
        //do other shit that other ppl needs
    });


    call = '/me?fields=id,friends.uid('+id3+').fields(username)';
    call = make_url(call);
    FB.api(url, function(response){
        friend_user_name = response.username;

        profile_pic_url = 'https://graph.facebook.com/'+friend_user_name+'/picture';
        //got their usernme
        document.getElementById('somerandomshitotherthatthoseshits').innerHTML ="<img src="+profile_pic_url+" width='100' height='100'>";
        //do other shit that other ppl needs
    });
}

function get_list_of_friends(callback){
    call = make_url('/me?fields=id,friends.fields(username,id)');

    FB.api(url, function(response){
        list_of_friends = response.friends.data;
        callback(list_of_friends);
    });
}


