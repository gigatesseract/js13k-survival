var canvas = document.createElement("canvas")
canvas.id= "my-canvas"
, c = canvas.getContext('2d')
c.fillStyle = "black"
, ballX = 100
, radius = 20
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

var   offSet = 0.15*canvas.height,groundLevel = canvas.height - offSet, ceiling = offSet, ballY = groundLevel-radius, togglespeed = 10, toggle = false
, obstacleHeight = 20
, generateflag = false
, ugenerateflag = false
, spacestate = 3
, length = 6
, obst = []
, uobst = [], ballReached = false
var thorn = new Image();
var fireball1 = new Image();
var fireball4 = new Image();
var sleft = new Image();
var sup = new Image();
var sdown = new Image();
var owidth = 50
, oheight = 50
, uobstspeed = 5
, obstspeed = 6
, fireballspeed = 10
, fwidth = 100
, fheight = 50
, fX = -3*fwidth, fY = 250
, state = 0
, score = 0
,spaceX = 100, spacewidth = 50, spaceheight = 50, spaceY = groundLevel - spacewidth
,body = document.getElementById("main")
, firsthalf = c.createLinearGradient(0, ceiling, 0, (ceiling+groundLevel)/2);
firsthalf.addColorStop(0, "#696969");
firsthalf.addColorStop(1, "#A9A9A9");
var secondhalf = c.createLinearGradient(0,groundLevel, 0, (ceiling+groundLevel)/2);
secondhalf.addColorStop(0, "#696969");
secondhalf.addColorStop(1, "#A9A9A9");
function drawBack(){

	c.fillStyle = "black";
	c.fillRect(0,0,canvas.width,ceiling);
	c.fillRect(0,groundLevel, canvas.width, offSet);
	c.fillStyle = firsthalf;
	c.fillRect(0, ceiling, canvas.width, (ceiling+groundLevel)/2);	
	c.fillStyle = secondhalf;
	c.fillRect(0, (groundLevel+ceiling)/2, canvas.width, (groundLevel+ceiling)/2-ceiling);
}
function gameOver(){
	while(body.firstChild){
		body.removeChild(body.firstChild)
	}
	var over = document.createElement("h4");
	over.id = "over";
	over.innerHTML = "GAME OVER";
	over.style.color = "white";
	body.appendChild(over);
	var restart = document.createElement("button");
	restart.id = "restart";
	restart.innerHTML ="Restart";
	restart.addEventListener("click",function(){
		window.location.reload(true)
	});
	localStorage.setItem('best', score);
	body.appendChild(restart)
	
}
function drawSpaceship(){
	checkToggle();
	determineState();
	if(spacestate==1)
		c.drawImage(sup, spaceX, spaceY, spacewidth, spaceheight);
	else if(spacestate==2)
	c.drawImage(sdown, spaceX, spaceY, spacewidth, spaceheight);
else if(spacestate==3)
	c.drawImage(sleft, spaceX, spaceY, spacewidth, spaceheight);




}
function checkObstCoords(i){
 for(j=0;j<length;j++)
 {
 	if(i!=j)
 	{
 		if(obst[i]<obst[j]<obst[i]+owidth) {obst[i]-=owidth;}
 		else if(obst[j]<obst[i]<obst[j]+owidth) {obst[i] +=owidth;}
 		if(uobst[i]<uobst[j]<uobst[i]+owidth) {uobst[i]-=owidth;}
 		else if(uobst[j]<uobst[i]<uobst[j]+owidth) {uobst[i] +=owidth;}
 	}
 }


}

function drawScore(){
	var score = localStorage.getItem("score");
}

function generateObst(){

 obst[0] = canvas.width + Math.random()*10;
 for(i=1;i<length;i++){
 	obst[i] = obst[i-1] + 100 + (2*canvas.width-obst[i-1] - 100)*Math.random();
}
 generateflag = true;
 uobst[0] = canvas.width + Math.random()*25;
 for(i=1;i<length;i++){
 	uobst[i] = uobst[i-1] + 100 + (2*canvas.width-uobst[i-1] - 30)*Math.random();
 }
 ugenerateflag = true;
 for(i=0;i<length;i++)
 	while(checkCoordslower(i)) obst[i]+=owidth;
 
 for(i=0;i<length;i++)
 	while(checkCoordsupper(i)) uobst[i]+=owidth;


}
function checkObst(){
	for(i=0;i<length;i++)
	{
		if(obst[i]>-owidth-10) {obst[i]-=obstspeed;}
		if(uobst[i]>-owidth-10) {uobst[i]-=uobstspeed;}
		if(obst[i]<=-owidth-10)
		{	
			score++;
			if(i==0) 
				{
				obst[i] = canvas.width + Math.random()*10 + owidth;
				
				}
			else if(i!=0){
			
				obst[i] = canvas.width + Math.random()*1.5*(canvas.width);
		

			}
			while(checkCoordslower(i)) {obst[i]+=owidth;}
			}

			if(uobst[i]<=-owidth-10)
				{
					score++;
					if(i==0) 
					{
					uobst[i] = canvas.width + Math.random()*10 + owidth;
		
					}
				
					else if(i!=0)
					{
					uobst[i] = canvas.width + Math.random()*1.5*(canvas.width);
					
			

					}	
					while(checkCoordsupper(i)) { uobst[i]+=owidth;}	
				
			

				}	
						
	
}
}
	
function checkCoordslower(i)
{
	for(j=0;j<length;j++)
 {
 	if(i!=j)
 	{
 		
 		 
 		if((obst[i]<obst[j] && obst[j]<obst[i]+owidth) || (obst[j]<obst[i] && obst[i]<obst[j]+owidth)) 
 			{
 				return true;
 			}
 	}
 	

}
return false;
}

function checkCoordsupper(i)
{
	 for(j=0;j<length;j++)
 {
 	if(i!=j)
 	{
 		
 		
 		if((uobst[i]<uobst[j] && uobst[j]<uobst[i]+owidth) || (uobst[j]<uobst[i] && uobst[i]<uobst[j]+owidth)) 
 			{
 				return true;
 			}
 	}
 }
 return false;

}

function drawObst(){
	if(generateflag)
	{checkObst();
	for(i=0;i<length;i++)
	{
		c.save();
		c.beginPath();
		
		c.drawImage(thorn, obst[i], groundLevel-oheight, owidth, oheight);
		c.fill();
		c.closePath();
		c.beginPath();
	
		c.drawImage(thorn,uobst[i], ceiling, owidth, oheight);
		c.closePath();

		
		c.restore();
	}
}
}

function collisionDetection(){
	var path = new Path2D()
	, path2 = new Path2D()
	, fpath = new Path2D();
	c.beginPath(fpath);
	fpath.moveTo(fX, fY);
	fpath.lineTo(fX + fwidth, fY);
	fpath.lineTo(fX + fwidth, fY + fheight);
	fpath.lineTo(fX, fY + fheight);
	fpath.lineTo(fX, fY);
	c.closePath(fpath);
	for(i=0;i<length;i++)
	{
		c.beginPath(path);
		path.moveTo(obst[i], groundLevel);
		path.lineTo(obst[i], groundLevel-oheight);
		path.lineTo(obst[i]+owidth, groundLevel-oheight);
		path.lineTo(obst[i]+owidth, groundLevel-oheight);
		path.lineTo(obst[i]+owidth, groundLevel-oheight);
		c.closePath(path);

		c.beginPath(path2);
		path2.moveTo(uobst[i], ceiling);
		path2.lineTo(uobst[i], ceiling+oheight);
		path2.lineTo(uobst[i]+owidth, ceiling+oheight);
		path2.lineTo(uobst[i]+owidth, ceiling);
		path2.lineTo(uobst[i], ceiling);
		c.closePath(path2);

	}
	if(c.isPointInPath(path, spaceX, spaceY)){
		gameOver();
		
	}
		
	if(c.isPointInPath(path, spaceX + spacewidth, spaceY)){
		gameOver();
		
	}
	if(c.isPointInPath(path, spaceX + spacewidth, spaceY+spaceheight)){
		gameOver();
		
	}
	if(c.isPointInPath(path, spaceX, spaceY + spaceheight)){
		gameOver();
		
	}

	if(c.isPointInPath(path2, spaceX, spaceY)){
		gameOver();
		
	}
		
	if(c.isPointInPath(path2, spaceX + spacewidth, spaceY)){
		gameOver();
		}
	if(c.isPointInPath(path2, spaceX + spacewidth, spaceY+spaceheight)){
		gameOver();
		
	}
	if(c.isPointInPath(path2, spaceX, spaceY + spaceheight)){
		gameOver();
		
	}
	if(c.isPointInPath(fpath, spaceX + spacewidth, spaceY)){
		gameOver();
		
	}
	if(c.isPointInPath(fpath, spaceX + spacewidth, spaceY + spaceheight)){
		gameOver();
		
	}
	if(c.isPointInPath(fpath, spaceX, spaceY+spaceheight)){
		gameOver();
	}
		
	if(c.isPointInPath(fpath, spaceX, spaceY)){
		gameOver();
	
	}

	delete path;
	delete path2;
	delete fpath;
	

}
function onClick(event){
	if(event.button==0){
		if(toggle){
	    	toggle = false;
		}
		else{ toggle = true;
		}
	}

}
	


function checkToggle(){

	if(toggle)
	{

		if(spaceY>ceiling){
			spaceY-=togglespeed;
		}


	}
	else if(!toggle)
	{
		if(spaceY<(groundLevel-spacewidth))
			spaceY+=togglespeed;

	}

	
}
function generateFireball(){


	fX = canvas.width + fwidth;
	fY = ceiling + oheight + 30 +  Math.random()*(groundLevel-fheight-oheight-ceiling-oheight - 60);

}
function drawFireball(){

	fX -=fireballspeed;
	 if(state==1){
	c.drawImage(fireball1, fX, fY, fwidth, fheight);
}
	else if(state==2){
	c.drawImage(fireball4, fX, fY, fwidth, fheight);
}
	




}

function load(){

	thorn.src = "thornguy.png";
	fireball1.src = "fireball1.png";
	fireball4.src = "fireball4.png";
	sup.src = "spaceship-tilt-up.png";
	sdown.src = "spaceship-tilt-down.png";
	sleft.src = "spaceship-left.png";
	thorn.onload = function(){
		console.log("hello");
		fireball1.onload = function(){
			sup.onload = function(){
				console.log("hihihi");
				sdown.onload = function(){
					sleft.onload = function(){

fireball4.onload = function(){

    console.log("hi");
	draw();

	}

}
}
}
}
}

draw();
}
function stateincre()
{   state++;
	if(state==3){
	 state = 1;
	}
}

function determineState()
{
	if(toggle && (spaceY>ceiling))
		spacestate = 1;  
	else if(!toggle && (spaceY<groundLevel - spacewidth))
		spacestate = 2; 
	else spacestate = 3;  


}

function drawScore()
{
	c.font = "2.5vw Arial"
	c.fillStyle="white"
	c.fillText('Score '+score,0.05*canvas.width,0.1*canvas.height);
	c.font = "2.5vw Arial";
	c.fillStyle = "white";
    best = localStorage.getItem("best");
	c.fillText('Personal best: '+best,0.75*canvas.width,0.1*canvas.height);

}

function draw(){
	c.clearRect(0,0, canvas.width, canvas.height);
	collisionDetection();
	drawBack();
	
	drawObst();
	drawFireball();
	console.log(spaceY);
	drawSpaceship();
	drawScore();
	window.requestAnimationFrame(draw);

}

window.addEventListener('click', onClick);
window.setInterval(generateFireball, 5000);
window.setInterval(stateincre, 250);
button  = document.getElementById("start");
button.addEventListener("click",function(){
	generateObst();

	while(body.firstChild){
		body.removeChild(body.firstChild)
	}
	body.appendChild(canvas);
	
load();

	
})