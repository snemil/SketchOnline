var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://192.168.1.136:8080';

var options ={
  transports: ['websocket'],
  'force new connection': true
};
var user1 = {
		id: 0,
		color: 'black',
		size: '15'
	};
var user2 = {		
		id: 0,
		color: 'red',
		size: '15'
	};
var user3 = {		
		id: 0,
		color: 'blue',
		size: '15'
	};	


describe("Node server", function(){

  it('Should broadcast an array with all the users once they connect',function(done){
    var client1 = io.connect(socketURL, options);

    client1.on('connect',function(){
	    client1.emit('client_connected', user1);
	  
	    var client2 = io.connect(socketURL, options);
	        client2.on('connect',function(){
	      	client2.emit('client_connected', user2);
	    });

	    client2.on('new_client',function(clients){
	   		clients.length.should.equal(2);
	    	clients[0].color.should.equal('black');
	    	clients[1].color.should.equal('red');

	    	client2.disconnect();
	    });
  	});

    var k = 0;
    client1.on('new_client',function(clients){
    	k +=1;

    	if(k === 2){
    		clients.length.should.equal(2);
    		client1.disconnect();
    		clients[0].color.should.equal('black');
	    	clients[1].color.should.equal('red');
    		done();
   		 }
 	});
  });


  it('Should broadcast an which pixels to draw when a user making draw-events',function(done){
  	var client1, client2, client3;
  	var drawData = {
  			id: 123,
			color: 'black',
			size: '15',
			x: 202,
			y: 182,
			oldX: 200,
			oldY: 180
		};

  	client1 = io.connect(socketURL, options);

  	client1.on('connect',function(){
		client1.emit('client_connected', user1);
		client2 = io.connect(socketURL, options);

		client2.on('connect',function(){
			client2.emit('client_connected', user2);
			client3 = io.connect(socketURL, options);

			client3.on('connect',function(){
				client3.emit('client_connected', user3);
				});

				//Client 3 makes drawevent
				client3.emit('drawClick', drawData);
				client1.on('draw',function(data){
				    data.color.should.equal('black');
				    data.size.should.equal('15');
				    data.x.should.equal(202);
				    data.y.should.equal(182);
				    data.oldX.should.equal(200);
				    data.oldY.should.equal(180);
				    client1.disconnect();
				});

				client2.on('draw',function(data){
				    data.color.should.equal('black');
				    data.size.should.equal('15');
				    data.x.should.equal(202);
				    data.y.should.equal(182);
				    data.oldX.should.equal(200);
				    data.oldY.should.equal(180);
				    client2.disconnect();
				});

				client3.on('draw',function(data){
					data.color.should.equal('black');
				    data.size.should.equal('15');
				    data.x.should.equal(202);
				    data.y.should.equal(182);
				    data.oldX.should.equal(200);
				    data.oldY.should.equal(180);
				    client3.emit('resetWorkspace', {});
		  			client3.disconnect();
		  			done();
				});
  			});
 		});
	});

 it('Should give the old drawing coordinates to the new user',function(done){
 	var client1, client2, client3;
  	var drawData1 = {
  			id: 123,
			color: 'black',
			size: '15',
			x: 202,
			y: 182,
			oldX: 200,
			oldY: 180
		};

	var drawData2 = {
		id: 123,
		color: 'black',
		size: '15',
		x: 205,
		y: 184,
		oldX: 202,
		oldY: 182
	};

	var drawData3 = {
		id: 123,
		color: 'black',
		size: '15',
		x: 207,
		y: 183,
		oldX: 205,
		oldY: 184
	};

  	client1 = io.connect(socketURL, options);

  	client1.on('connect',function(){
		client1.emit('client_connected', user1);
		client1.emit('drawClick', drawData1);
		client1.emit('drawClick', drawData2);
		client1.emit('drawClick', drawData3);

		client2 = io.connect(socketURL, options);
		client2.on('connect',function(){
			client2.emit('client_connected', user1);
			client2.on('previous_drawn',function(lines){
				lines.length.should.equal(3);
				client2.disconnect();
			});
		});
		var i = 0;
		client1.on('new_client',function(){
			i += 1;
			if(i == 2){
				client1.disconnect();
				done();
			}
		});
	});
 });

 it('Should remove all drawn lines when a user presses reset button',function(done){
 	var client1, client2, client3;
  	var drawData1 = {
  			id: 123,
			color: 'black',
			size: '15',
			x: 202,
			y: 182,
			oldX: 200,
			oldY: 180
		};

	var drawData2 = {
		id: 123,
		color: 'black',
		size: '15',
		x: 205,
		y: 184,
		oldX: 202,
		oldY: 182
	};

	var drawData3 = {
		id: 123,
		color: 'black',
		size: '15',
		x: 207,
		y: 183,
		oldX: 205,
		oldY: 184
	};

  	client1 = io.connect(socketURL, options);

  	client1.on('connect',function(){
		client1.emit('client_connected', user1);
		client1.emit('drawClick', drawData1);
		client1.emit('drawClick', drawData1);
		client1.emit('drawClick', drawData1);
		client1.emit('resetWorkspace',{});

		client2 = io.connect(socketURL, options);
		client2.on('connect',function(){
			client2.emit('client_connected', user1);
			client2.on('previous_drawn',function(lines){
				lines.length.should.equal(0);
				client2.disconnect();
			});
		});
		var i = 0;
		client1.on('new_client',function(){
			i += 1;
			if(i == 2){
				client1.disconnect();
				done();
			}
		});
	});
 });
});