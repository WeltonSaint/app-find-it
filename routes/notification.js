const USER_CONNECT = 3400;
const USER_MESSAGE = 3401;
const USER_VISUALIZATION = 3402;
const USER_TYPING = 3403;
const MATCH_NOTIFICATION = 3404;
const MESSAGE_NOTIFICATION = 3405;
const MESSAGE_POLLING = 5000;

var users = [];
var user = false;

wss.on('connection', function connection(ws) {
    ws.on('message', function (message){
    if (userName === false) { // first message sent by user is their name
        // remember user name
        userName = message;
        users[connectionID] = {'name': userName, 'color' : userColor };            
        ws.send(JSON.stringify({ type:'color', data: userColor, listUsers: getListUser()}));
        // we want to keep history of all sent messages
        var obj = {
            time: (new Date()).getTime(),
            id : connectionID,
            text: " connected.",
            author: userName,
            color: userColor
        };
        wss.clients.forEach(function each(client) {
            if (client !== ws ) {
                client.send(JSON.stringify({ type:'message', data: obj }));
            }
        });
        console.log((new Date()) + ' User is known as: ' + userName
                    + ' with ' + userColor + ' color.');

    } else if(message.localeCompare("polling") != 0){
         // log and broadcast the message
        console.log((new Date())+ userName + ': ' + message);
        
        // we want to keep history of all sent messages
        var obj = {
            time: (new Date()).getTime(),
            id : connectionID,
            text: message,                
            author: userName,
            color: userColor
        };
        // broadcast message to all connected clients
        var json = JSON.stringify({ type:'message', data: obj });
        wss.clients.forEach(function each(client) {
            client.send(json);
        });
    }
    
});

ws.on('close', function(connection) {
    if (userName !== false && userColor !== false) {
        console.log((new Date()) + " Peer "
            + userName + " disconnected.");
        // remove user from the list of connected clients
        // we want to keep history of all sent messages
        var obj = {
            time: (new Date()).getTime(),
            id : connectionID,
            text: " disconnected.",
            author: userName,
            color: userColor
        };
        // broadcast message to all connected clients
        var json = JSON.stringify({ type:'message', data: obj });
        wss.clients.forEach(function each(client) {
            client.send(json);
        });
        delete users[connectionID];
        // push back user's color to be reused by another user
        colors.push(userColor);
    }
});   
