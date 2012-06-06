$(document).ready(function(){
	var draw = false;

	var canvas = document.getElementById("can");
	var ctx = canvas.getContext("2d");
	ctx.strokeStyle = 'black';
	ctx.lineCap ="round";
	ctx.lineJoin= "round";
	ctx.lineWidth = 10;

	//chnage to true when mousedown event occurs
	$("#can").mousedown(function(e){
			draw=true;
			ctx.beginPath();
			ctx.moveTo(e.offsetX,e.offsetY);
	});

	// reset on mouseup
	$("#can").mouseup(function(){draw=false;});

	$("#can").mousemove(function(e) {
		if(draw){
			ctx.lineTo(e.offsetX,e.offsetY);
			ctx.stroke();
		}
	});
});