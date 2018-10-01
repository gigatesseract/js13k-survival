# js13k-survival
The submission for the js13k games  

The source code with proper comments is given below:-  
```javascript
//  SURVIVAL - submission for the js13kgames.`     
//   The protagonst of the game is a spaceship, which youll control, the obective is to avoid obstacles. 
//    The game consists of two surfaces, the groundlevel and the ceiling.
//    Left-click switches gravity. So if youre at the bottom surface (groundlevel), youll go towards the ceiling (toplevel)





var canvas = document.createElement("canvas")
canvas.id= "my-canvas";
var c = canvas.getContext('2d')
c.fillStyle = "black";
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

//Declaration of global variables
//The unit of speed is pixels per frame, and the scale is always (1,1) throughout. 


var   offSet = 0.15*canvas.height; //offSet is the amount of margin above and below
var groundLevel = canvas.height - offSet; //groundLevel is the bottom level in the game
var ceiling = offSet; //ceiling is the top level in the game
var togglespeed = 10;  //this is the speed at which the toggle happens - the speed at which the spaceship transitions between the surfaces.
var toggle = false;  //if this is set true, the space goes up. else it comes down. This switches its value between 0 and 1 on left mouse-click.


//All the obstacles are generated procedurally. Principle:- An variable called 'length' is fixed that defines the maximum number of obstacles that can be displayed on a canvas screen.
//Hence, an array called obst (for lower surface) is maintained that stores the randomised-x-coordinates of the obstacles. The size of obst array is 'length'. 
//Similarly, an array called uobst is maintained for the upper surface. 

var generateflag = false  //this is a flag that is set to true once the obstacle array is generated.

var spacestate = 3;  //This is the 'state' of the spaceship. The 'state' determines which sprite of the spaceship must be drawn on the canvas.
//if spacestate is 1 := That sprite is drawn which shows the spaceship going upward.
// if spacestate is 2:= that sprite is drawn which shows the spaceship going downward. 
// if spacestate is 3:= that sprite is drawn that shows the spaceship going straight.
var length = 6; //This defines the maximum number of obstacles that can be shown on one surface in the entire canvas.
var obst = [] //the obstacle array for lower surface, as discussed above.
var uobst = []; //the obstacle array for upper surface, as discussed above.

//Declaration of images follows

var thorn = new Image();   //the sprite for the thorn obstacle
var fireball1 = new Image();  //fireball obstacle
var fireball4 = new Image();  //fireball obstacle:- there are two to display the  animation effect. It is named fireball4 because we discarded fireball2 and fireball3 to fit the file size.
var sleft = new Image(); //spacechip left sprite.
var sup = new Image();  //spaceship up sprite
var sdown = new Image(); //spaceship down sprite


//global variables declaration continues.

var owidth = 50;  //the width of the obstacle
var oheight = 50;  //the height of the obstacle
var uobstspeed = 5;  // speed of obstacles of the upper surface.
var obstspeed = 6;  //speed of the obstacles of the lower surface.
var fireballspeed = 10;   // speed of the fireball.
var fwidth = 100;   //width of the fireball sprite drawn in the canvas.
var fheight = 50;   //height of the fireball
var fX = -3*fwidth;   //this is the x coordinate of the fireball. this value will be randomised later to a  positive value. This is initialised to a negative value to introduce a delay. (A function calles the fireball every 5 seconds.)
var fY = 250;   //the y coordinate of the fireball.
var state = 0;   //the state of the fireball.
var score = 0;   //score 
var spaceX = 100; //x-coordinate of the space ship. Yes. Its called spaceX.
var spacewidth = 50;  //width of the spaceship
var spaceheight = 50;  //height of the space ship
var spaceY = groundLevel - spacewidth;  //y-coordinate of the spaceship. this is initialised this way because images are always drawn using top-left coordinate as reference and width, height using the drawImage function.
var body = document.getElementById("main");
var firsthalf = c.createLinearGradient(0, ceiling, 0, (ceiling+groundLevel)/2);  //a linear gradient created to colour the 'firsthalf' - from ceiling to the center of the canvas
firsthalf.addColorStop(0, "#696969");
firsthalf.addColorStop(1, "#A9A9A9");
var secondhalf = c.createLinearGradient(0,vargroundLevel, 0, (ceiling+groundLevel)/2); // a linear gradient created to colour the 'secondhalf' - from middle of canvas to groundlevel
secondhalf.addColorStop(0, "#696969");
secondhalf.addColorStop(1, "#A9A9A9");
function drawBack(){   //drawBack() draws the background at every animation frame.
 
	c.fillStyle = "black";
	c.fillRect(0,0,canvas.width,ceiling);   //fill until ceiling with black.
	c.fillRect(0,groundLevel, canvas.width,offSet); //fill from groundlevel to height with black
	c.fillStyle = firsthalf;
	c.fillRect(0, ceiling, canvas.width,(ceiling+groundLevel)/2);	 //fill firsthalf
	c.fillStyle = secondhalf;
	c.fillRect(0, (groundLevel+ceiling)/2,canvas.width, (groundLevel+ceiling)/2-ceiling);  //fill second half
}
function gameOver(){  //gameOver() gets the gameover screen :- removing the canvas and appending a game over sign and restart button
	while(body.firstChild){   //removing canvas. (actually removing all children of body. Here, its only canvas)
		body.removeChild(body.firstChild)
	}
	var over = document.createElement("h4");   //for the GAMEOVER heading
	over.id = "over";
	over.innerHTML = "GAME OVER";
	over.style.color = "white";
	body.appendChild(over);
	var restart = document.createElement("button");   //the restart button
	restart.id = "restart";
	restart.innerHTML ="Restart";
	restart.addEventListener("click",function(){
		window.location.reload(true)
	});
	if(score>=localStorage.getItem('best'))
	localStorage.setItem('best', score);    //setting the current score as the best. 
	body.appendChild(restart)
	
}
function drawSpaceship(){ //drawing the spaceship
	checkToggle();   //checktoggle determines the x, y coordinates of the spaceship to be drawn in canvas
	determineState(); //determinestate determines the state of the spaceship - choosing which sprite to draw
	if(spacestate==1)
		c.drawImage(sup, spaceX, spaceY, spacewidth, spaceheight); //drawing the sprite accordingly 
	else if(spacestate==2)
	c.drawImage(sdown, spaceX, spaceY, spacewidth, spaceheight);
else if(spacestate==3)
	c.drawImage(sleft, spaceX, spaceY, spacewidth, spaceheight);




}




function generateObst(){  //generateObst randomises x-coordinates of the obstacles and generates the obstales once. this funciton is called only once.

 obst[0] = canvas.width + Math.random()*10; //the first obstacle is initialised to a point little greater than canvas.width.
 for(i=1;i<length;i++){
 	obst[i] = obst[i-1] + 100 + (2*canvas.width-obst[i-1] - 100)*Math.random(); //the x-coordinate of obst[i] will be a value between obst[i-1] and 2*canvas.width
}
 generateflag = true;  //this is set to true. Only when this flag is true are the obstacles ddrawn on the canvas.
 uobst[0] = canvas.width + Math.random()*25;
 for(i=1;i<length;i++){
 	uobst[i] = uobst[i-1] + 100 + (2*canvas.width-uobst[i-1] - 30)*Math.random(); //same for the upper surface. Minor changes to introduce asymmetry.
 }
 
 for(i=0;i<length;i++)
 	while(checkCoordslower(i)) obst[i]+=owidth; //checkCoordslower(i) returns true if obst[i] is in the way of any other obstacle in the obst array. If that is so, then obst[i] is pushed back till it isnt in the way of any other obstacle. THis is donw to make sure the obstacles dont intersect. Intersecting obstacles appear unsure to the gamer 
 
 for(i=0;i<length;i++)
 	while(checkCoordsupper(i)) uobst[i]+=owidth;  //checkCoordsupper(i) returns true if uobst[i] is in the way of any other element of uobst


}
function checkObst(){  //checkObst determines the x and y coordinate of each obstacle in both the obst and uobst arrays so that they can be drawn in the canvas
	for(i=0;i<length;i++)
	{
		if(obst[i]>-owidth-10) {obst[i]-=obstspeed;}  //while the obstacle is visible, decrease the x=coordinate by its speed 
		if(uobst[i]>-owidth-10) {uobst[i]-=uobstspeed;}
		if(obst[i]<=-owidth-10)   //when the obstacle goes out of screen, (its x cordinate becomes less than -owidth)
		{	
			score++;  //increment score by 1 
			if(i==0)  //case when i = 0, randomise its x -coordinate a little above canvas.width + owidth.
				{
				obst[i] = canvas.width + Math.random()*10 + owidth;
				
				}
			else if(i!=0){  //all cases when i!=0, randmomise the obstacle to a value between 1 and 2.5 times the canvas width. This is just to give sufficient space between obstacles.
			
				obst[i] = canvas.width + Math.random()*1.5*(canvas.width);
		

			}
			while(checkCoordslower(i)) {obst[i]+=owidth;}  //if the obstacles had intersected while randomising, push them till they dont intersect
			}

			if(uobst[i]<=-owidth-10)  //the same consitions apply for uobst
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
	
function checkCoordslower(i) //returns true if obst[i] is in the way of any other obstacle, returns false otherwise.
{
	for(j=0;j<length;j++)
 {
 	if(i!=j)
 	{
 		
 		 
 		if((obst[i]<obst[j] && obst[j]<obst[i]+owidth) || (obst[j]<obst[i] && obst[i]<obst[j]+owidth)) 
 			{
 				return true;
 			}
 			//the above if-condition is union of two cases. 
 			//Case-1:- when any other obstacle is in between endpoints obst[i] => obst[i]< obst[j]<obst[i]  + owidth
 			//Case 2:- When obst[i] is in between endpoints of any other obstacle => obst[j] <obst[i] < obst[j] + owidth
 	}
 	

}
return false;
}

function checkCoordsupper(i) //same for uobst
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

function drawObst(){  //drawObst simply draws the obstacles at their specified x and Y coordinate as in their respective arrays (uobst and obst)
	if(generateflag)  //draw only when obstacles are generated
	{checkObst();  //determines the x and y coordinates. 
	for(i=0;i<length;i++)
	{
		
		c.drawImage(thorn, obst[i], groundLevel-oheight, owidth, oheight);
		c.drawImage(thorn,uobst[i], ceiling, owidth, oheight);
	}
}
}

function collisionDetection(){   //the function that determines whether collision happens between spaceship and any obstacle. 

//basic principle:- For each frame, three paths are created.
//path 1:- path. This path contains the sprite border of the lower surface obstacles.
//path 2:- path2. This path contains the sprite border of the upper surface obstacles.
//path 3:- fpath. This path contains the sprite border of the fireball
	var path = new Path2D(); 
	var path2 = new Path2D();
	var fpath = new Path2D();
	c.beginPath(fpath);
	fpath.moveTo(fX, fY);  //beginning , adding coordinates and closing the path for the fireball.
	fpath.lineTo(fX + fwidth, fY);
	fpath.lineTo(fX + fwidth, fY + fheight);
	fpath.lineTo(fX, fY + fheight);
	fpath.lineTo(fX, fY);
	c.closePath(fpath);
	for(i=0;i<length;i++)   //for each i, beginning, adding obst[i] sprite border (4-points) to path, closing it, beginning path2, adding uobst[i] sprite border (4-points) to path2
	{  //since it is closed for ever iteration, the paths are discontinues between obstacles. This enables the space ship to be in between two obstacles and not trigger not game over, which is what we want. 
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

	//ispointinpath returns true if given x,y coordinate is in given path
	//there are 4 if cases for each path to take into account the 4 coordinates of the spaceship. If even a single point is inside any of the 3 paths, then game over. Hence, 4*3 = 12 cases.
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

	delete path; //deleting the paths in each frame so that there 
	delete path2;
	delete fpath;
	

}
function onClick(event){ //onClick event is fired when a click happens.
	if(event.button==0){ //if clicked button is a left mouse button
		if(toggle){ //switch toggle value. So if it was going up, it will come down and vice versa.
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
function generateFireball(){ //sets the x ad y coordinates
	//x-coordinate:- canvas,width + width of the fireball
	//y-coordinate:- any value between (ceiling + oheight +30) and (groundlevel - fireball's height - obstacle's height -60) => this is to make sure the fireball doesnt intersect with the thorn obstacle


	fX = canvas.width + fwidth;
	fY = ceiling + oheight + 30 +  Math.random()*(groundLevel-fheight-oheight-ceiling-oheight - 60);
//the drawFireball function uses this x and y to draw the direball. generateFireball is called every 5 seconds. 
}
function drawFireball(){ //decreases x-coordinate of fireball by 'fireballspeed' and draws it in the canvas.

	fX -=fireballspeed;
	 if(state==1){
	c.drawImage(fireball1, fX, fY, fwidth, fheight);  //draw a differnt sprite for different states (1 and 2) to give an 'animation' effect.
} //the state is incremented automatically every quarter of a second by a function called stateincre() below. (after load())
	else if(state==2){
	c.drawImage(fireball4, fX, fY, fwidth, fheight);
}
	




}

function load(){   //the load function makes sure all the sprites are loaded before the canvas is used for drawing.

//loading necesary sprites.

	thorn.src = "thornguy.png";
	fireball1.src = "fireball1.png";
	fireball4.src = "fireball4.png";
	sup.src = "spaceship-tilt-up.png";
	sdown.src = "spaceship-tilt-down.png";
	sleft.src = "spaceship-left.png";
	thorn.onload = function(){  //nested .onload function calls to make sure every sprite is loaded.
		console.log("hello");
		fireball1.onload = function(){
			sup.onload = function(){
				console.log("hihihi");
				sdown.onload = function(){
					sleft.onload = function(){

fireball4.onload = function(){

	draw();

	}

}
}
}
}
}

draw(); //calling draw function after thorn is loaded anyways. this might give sufficient time for everything else to load.
}
function stateincre() //increments state to choose which sprite to draw.
{   state++;
	if(state==3){
	 state = 1;
	}
}

function determineState() //determines state of the spaceship (1, 2, or 3)
{
	if(toggle && (spaceY>ceiling))  //1 when its going up i.e, toggle is true AND it hasnt reached the ceiling yet
		spacestate = 1;  
	else if(!toggle && (spaceY<(groundLevel - spacewidth))) //2 when its going down. i.e, toggle is false ANd it hasnt reached  groundlevel
		spacestate = 2; 
	else spacestate = 3;  //3 i.e normal in all other cases.


}

function drawScore()  //simple function to draw the score and personal best (by getting the item from localstorage)
{
	c.font = "2.5vw Arial"
	c.fillStyle="white"
	c.fillText('Score '+score,0.05*canvas.width,0.1*canvas.height);
	c.font = "2.5vw Arial";
	c.fillStyle = "white";
    best = localStorage.getItem("best");
	c.fillText('Personal best: '+best,0.75*canvas.width,0.1*canvas.height);

}

function draw(){    //draw()n  draws everything in the canvas. This is the function that is fed into the requestanimation frame function so that it calls itself again and again.
	c.clearRect(0,0, canvas.width, canvas.height);
	collisionDetection();
	drawBack();   //draw the background
	
	drawObst();  //draw the thorns
	drawFireball(); //draw the fireball
	drawSpaceship(); //draw the spaceship
	drawScore();  //draw the score
	window.requestAnimationFrame(draw); //call the draw function again.

}

window.addEventListener('click', onClick);
window.setInterval(generateFireball, 5000); //generateFireball() is called every 5 seconds.
window.setInterval(stateincre, 250); //stateincre() is called every quarter of a second so that a differnet sprite is drawn every quarter of a second.
button  = document.getElementById("start");
button.addEventListener("click",function(){
	generateObst();

	while(body.firstChild){
		body.removeChild(body.firstChild)
	}
	body.appendChild(canvas);
	
load();

	
});  
```
