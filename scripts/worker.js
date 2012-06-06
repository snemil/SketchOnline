/**
* @fileOverview
* @author <a href="sketch@sketch.nu">SketchO!</a>
* @version 0.1.
* 
* This is the web worker script. It calculates how much every user has drawn since connected. And sends out how much every user has drawn with the total amount of pixels.
*/
 
/**
* Web worker script. 
* @class Worker
*/ 

/**
* Total distance drawn since client connected.
* @type integer
*/
total = 0;

/**
* clients stores clients socketIDs 
* @type array
*/
clients = [];

/**
* @param 'event'
* @param callback-function {@link e}
* @name addEventListener
* @function
* @returns void
*/
self.addEventListener('message', function(e) {
	var dist = 0;

	dist = Math.sqrt((Math.abs(e.data.oldX - e.data.x) *
	Math.abs(e.data.oldX - e.data.x)) + (Math.abs(e.data.oldY - e.data.y) *
	Math.abs(e.data.oldY - e.data.y)));
	total += dist;
	var existing_client = false;
		for(var i = 0; i < clients.length; i++){
			if(clients[i].id === e.data.id){
				clients[i].dist += dist;
				dist = clients[i].dist
				existing_client = true;
				break;
			}
		}
	if (existing_client == false){
		// add new client
		var newClient = {
			id: e.data.id,
			dist: dist
		};
		clients.push(newClient);
	}
	self.postMessage({sum: Math.round(total), distance: Math.round(dist), id: e.data.id});
}, false);