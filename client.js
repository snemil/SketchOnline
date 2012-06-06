/**
* @fileOverview
* @author <a href="sketch@sketch.nu">SketchO!</a>
* @version 0.1.
* This is the client-side application. A users loads this page and gets connected to the server.
*/
 
/**
* Client side
* @namespace CLIENT
* @class CLIENT
*/ 


$(document).ready(function(){

/**
* clients variable for storing clients socketID 
* @type array
*/
	var clients = [];

/**
* canvas the canvas element 
* @type HTML5/canvas
*/
	var canvas = document.getElementById("can");

/**
* ctx HTML5/canvas variable 
* @type HTML5/canvas
*/
	var ctx = canvas.getContext("2d");
	ctx.strokeStyle = 'black';
	ctx.lineCap ="round";
	ctx.lineJoin= "round";
	ctx.lineWidth = 10;

/**
* worker JS-thread variable. {@link worker} 
* @type JS-thread
*/
	var worker = new Worker('scripts/worker.js');


/**
* player variable containing player characteristics 
* @type array
*/
	var player = {
		color: 'black',
		size: '15',
		x: 0,
		y: 0,
		oldX: 0,
		oldY: 0,
		flag: true
	};

/**
* socket websocket for connection to server 
* @type websocket
*/
	var socket = io.connect('http://192.168.1.136:8080');


/**
* @param 'event'
* @param callback-function
* 'connect' event: client is connected to server.
* 'new_client' event: adds the new client to html-page
* 'client_dc' event: removes the new client to html-page.
* 'previous_drawn' event: draws the previously drawn canvas.
* 'draw' event: calls draw-function
* 'resetWorkspace' event: calls the resetWorkspace function
* 'draw drawstart drawend' event: calls drawfunction and sends data.
* @name on
* @function
* @returns void
*/
    socket.on('connect', function() {
        socket.emit('client_connected', {id: 0, color: player.color, size: player.size});
      });

	socket.on('new_client', function(send_clients){
		if ($('.client_item').length != 0) {
			$('#clients').append('<li class="client_item">'+ 'Client id: ' + send_clients[send_clients.length -1].id +
			' is connected</li>');
		}else {
			for (var i = 0; i<send_clients.length; i++) {
				$('#clients').append('<li class="client_item">' + 'Client id: ' + send_clients[i].id +
				' is connected</li>');
			}
		}
		clients = send_clients;
	});

	socket.on('client_dc', function(client_dc){
		$('.client_item').each(function(){
			if ('Client id: ' + client_dc.id +' is connected' == $(this).text()){
				$(this).remove();
			}
		});
	});

	socket.on('previous_drawn', function(lines) {
		for (var i = 0; i<lines.length; i++) {
			draw(lines[i].x, lines[i].y, lines[i].oldX, lines[i].oldY, lines[i].color, lines[i].size);
		}
	});

	socket.on('draw', function(data){
		worker.postMessage({
			id: data.id,
			x: data.x,
			y: data.y,
			oldX: data.oldX,
			oldY: data.oldY
		});

		draw(data.x, data.y, data.oldX, data.oldY, data.color, data.size);
	});

	socket.on('resetWorkspace', function() {
		resetWorkspace();
	});

/**
* This method .. message event for worker.
* @param 'event' 
* 'message' event: waits for message from worker
* @name addEventListener
* @function
*/
	worker.addEventListener('message', function(e) {
		var found = false;
		$('#total').text(e.data.sum);
		$('.pixel_dist').each(function(){
			var pixID = $(this).find('.id');
			if (pixID.text() == e.data.id){
				$(this).find('.px').text(e.data.distance);
				found = true;
			}
		});
		if(!found){
			$('#pixels').append('<li class="pixel_dist">' + 'Client: <span class = "id">' + e.data.id + '</span>'+
			 ' has drawn ' + '<span class="px">' + e.data.distance + '</span> pixels' + '</li>');
		}
	});

/**
* This function clears the canvas
* @name resetWorkspace
* @function
* @returns void
*/
	function resetWorkspace() {
		ctx.rect(0, 0, 1000, 800);
		ctx.fillStyle = 'white';
		ctx.fill();
	}
/**
* This method draws on canvas
* @param x current x-value
* @param y current x-value
* @param oldX old x-value
* @param oldY old y-value
* @param color current color
* @size current size
* @name draw 
* @function
* @returns void
*/
	function draw(x, y, oldX, oldY, color, size) {
	      	ctx.strokeStyle = color;
	      	ctx.lineWidth = size;
	        ctx.beginPath();
	        ctx.moveTo(oldX, oldY);
	        ctx.lineTo(x, y);
	        ctx.stroke();
	        ctx.closePath();
	} 
	
	$('#can').on('drag dragstart dragend', function(e){
		var x, y;
		x = (e.clientX - this.offsetLeft);
		y = (e.clientY - this.offsetTop);
	
		draw(x, y, player.oldX, player.oldY, player.color, player.size);

/**
* This function sends data to other clients
* @name emit
* @param 'event'
* 'drawClick' event: sends drawn data.
* @function
* @returns void
*/
		socket.emit('drawClick', {
			x: x,
			y: y,
			oldX: player.oldX,
			oldY: player.oldY,
			color: player.color,
			size: player.size
		});
		player.oldX = x;
		player.oldY = y;
	});

	$('#can').on('mousedown', function(e){
		player.oldX = (e.clientX - this.offsetLeft);
		player.oldY = (e.clientY - this.offsetTop);


	});

	$('#button_black').on('click', function(e){
		player.color = 'black';
	});

	$('#button_blue').on('click', function(e){
		player.color = 'blue';
	});

	$('#button_red').on('click', function(e){
		player.color = 'red';
	});

	$('#button_yellow').on('click', function(e){
		player.color = 'yellow';
	});

	$('#button_green').on('click', function(e){
		player.color = '00FF00';
	});

	$('#button_white').on('click', function(e){
		player.color = 'white';
	});

	$('#button_size1').on('click', function(e){
		player.size = '3';
	});

	$('#button_size2').on('click', function(e){
		player.size = '8';
	});

	$('#button_size3').on('click', function(e){
		player.size = '15';
	});

	$('#button_size4').on('click', function(e){
		player.size = '25';
	});

	$('#button_reset').on('click', function(e){
		socket.emit('resetWorkspace', {});
		resetWorkspace();
	});
});