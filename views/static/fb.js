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


function get_self_id(){
    var url = make_url('/me?fields=id');
    FB.api(url, function(response){
        current_user_id = response.id;
        //do other shit that other ppl needs
    });
}

//callback with the profile picture url
function get_friends_profile_picture(id, callback){
    var call = '/me?fields=id,friends.uid('+id+').fields(username)';
    call = make_url(call);
    FB.api(url, function(response){
        friend_user_name = response.username;

        profile_pic_url = 'https://graph.facebook.com/'+friend_user_name+'/picture';
        //got their usernme
        callback(profile_pic_url);
    });
}


function get_list_of_friends(callback){
    call = make_url('/me?fields=id,friends.fields(username,id)');

    FB.api(url, function(response){
        list_of_friends = response.friends.data;
        callback(list_of_friends);
        //each item in list has an username and an id
    });
}


