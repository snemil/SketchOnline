/**
* @fileOverview
* @author <a href="sketch@sketch.nu">SketchO!</a>
* @version 0.1.
* This is the server-side application. It listens to events created by the connected users and listens to the server.
*/
 
/**
* Server side
* @namespace SERVER
* @class SERVER
*/ 

/**
* io socket.io variable for input/output 
* @type socket.io
*/

var io = require('socket.io').listen(8080);

/**
* clients Array for storing socketID's for connected clients
* @type Array
*/
var clients = [];

/**
* lines Contains coordinates for everything previously drawn.
* @type array
*/
var lines = [];

/**
* @param 'event'
* 'connection' event: when client connects to server and recieves unique socket object.
* 'client_connected' event: when client connects and sends its own data.
* 'reset_workspace' event: server recieves this event and send it to all clients.
* 'drawClick' event: recieves data from client and sends data to other clients.
* 'disconnect' event: sends witch ID has disconnected from the server.
* @param callback-function {@link socket. } 
* Current socket object.
* @param callback-function {@link data. } 
* Current data.
* @param callback-function {@link player. }
* Current player.
* @name on
* @function
* @returns void
*/
io.sockets.on('connection', function(socket){
	
	console.log('New client connected ' + socket);
	socket.on('client_connected', function(data){
		data.id = socket.id;
		clients.push(data);


/**
* This methods sends data through sockets to all clients.
* @param 'event'
* 'new_client' event: sends array with clients to all users.
* 'previous_drawn' event: sends lines array to all users.
* 'draw' event: sends the current drawn line.
* 'client_dc' event: sends that a client has disconnected to all users.
* @param clients
* @name emit
* @function
* @returns void
*/
		io.sockets.emit("new_client", clients);	
		
		socket.emit('previous_drawn', lines);
	});



	socket.on('resetWorkspace', function(){
		io.sockets.emit("resetWorkspace", {});
		lines = [];
	});



	socket.on('drawClick', function(player){

		var line = {
			id: socket.id,
			color: player.color,
			size: player.size,
			x: player.x,
			y: player.y,
			oldX: player.oldX,
			oldY: player.oldY
		};
		lines.push(line);


		io.sockets.emit("draw", {
			id: socket.id,
			color: player.color,
			size: player.size,
			x: player.x,
			y: player.y,
			oldX: player.oldX,
			oldY: player.oldY
		});
	});

	socket.on('disconnect', function(){
		for(i = 0; i < clients.length; i++){
			if(clients[i].id === socket.id){
				clients.splice(i,1);
				break;
			}
		}
		console.log("Client: " + socket.id + " disconnected");
		socket.broadcast.emit("client_dc", {id: socket.id});	
	});
});
