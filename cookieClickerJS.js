/*
Cookie clicker

Abhi Jain

Oct 9, 2018

In this program, a user clicks a cookie in order to gain points (cookies). They then use the cookies to purchase power-ups in order to gain a certain amount of cookies per second (which they gain without having to click the cookie). This program has been tested to the point where the number of cookies exceeds 32-bit and it works without signs of lag.
*/

let canvas = document.getElementById("myCanvas"); //creating the field on which to draw text
let disp = canvas.getContext("2d");
document.addEventListener("click", mouseClickHandler, false); //adding mouse click handler
document.addEventListener("mousedown", mouseDownHandler, false); //"" mouse button down
document.addEventListener("mouseup", mouseUpHandler, false); //"" mouse button up
let cookiesPerSecond = 0; //amount of cookies per second the user gets
let totalCookies = 0; //amount of cookies user has
const theButtons = []; //all buttons for powerups
let doDraw = true; //draw to screen or not
let ones = []; //number "ones" that fly upwards when cookie is pressed
let firstCookie = false; //has the cookie been drawn initially
var cookieCount = 0; //cookie needs to draw multiple times initially to be visible for some reason. This keeps track of how many times it has been draw to eventually stop this procedure.
let highScore = 0; 


//rather than a class, the cookie is an object (in JS object and class are different. Objects are single variables and not instances of any class.
var Cookie = { //defining an object
	x : 559, //cookie's x value
	y : 320, //cookie's y value
	radius : 120, //cookie radius for distance calculation
	img : document.getElementById("scream"), //image of cookie, hidden in HTML document
	dist(ex, ey){ //calculating the distance between the mouse and the center of the cookie. ex, ey is the mouse coordinates
		var a = ex - (this.x + this.radius/2);
		var b = ey - (this.y + this.radius);
		var c = Math.sqrt(a*a + b*b);
		return c;
	},
	clicked(ex, ey, totalCookies, ones){ //checking if cookie was clicked in mouse clicked event
		if (this.dist(ex, ey) < this.radius){
			totalCookies++; 
			if (ones.length < 10){ //adding another one to the list of ones
				ones.push(new one());
			}
		}
		return [totalCookies, ones]; //JS functions can only return a single value, so to return multiple, you package them into an array.
	},
	drawBig(){ 
		disp.fillStyle = "#D5DEED"; //color
		disp.fillRect(this.x - this.radius, this.y - this.radius, this.radius*2, this.radius*2); //covering previous drawing of cookie with rectangle
		disp.drawImage(this.img, this.x - this.radius, this.y - this.radius, 240, 240); //drawing cookie
	},
	drawSmall(){
		disp.fillStyle = "#D5DEED";
		disp.fillRect(this.x - this.radius, this.y - this.radius, this.radius*2, this.radius*2);
		disp.drawImage(this.img, this.x - this.radius + 10, this.y - this.radius + 10, 220, 220); //drawing cookie
	},
}

function addCookies(){
	totalCookies += cookiesPerSecond; //adding cookies
	doDraw = true; //telling draw function to draw new numbers
	window.setTimeout(addCookies, 1000); //adding recurring timer to add cookies each second
}

window.setTimeout(addCookies, 1000); //i did not use setInterval() here because JS can only take one setInterval() or setTimeout() in a program without lagging

class aButton { //buttons created as HTML elements to be stylized with CSS 
	constructor(type, textToWrite){ //values assigned upon initialisation of class instance
		this.type = type; //type: used to calculate the value and return value for clicking the button
		this.typeCount = 0; //amount of this button purchased by user
		this.value = Math.pow(10, this.type); //calculating the price
		this.payBack = Math.pow(8, this.type - 2); //calculating the return value
		this.textx = textToWrite; //the button name e.g "autoclicker"
		this.button = document.createElement("button"); //creating button as HTML element
		this.button.innerHTML = textToWrite + " <br> Price: " + this.value + " cookies <br> +" + this.payBack + " CPS"; //text to go into the button
		if (this.type > 6){ //choosing color of button by plugging as the last 2 digits of a hex code 
			this.button.style.backgroundColor = "#9f82" + (16-this.type).toString() + (16-this.type).toString();
		//special conditions for lower-type buttons because they need to be letters rather tha  numbers
		} else if (this.type == 1){
			this.button.style.backgroundColor = "#9f82FF"
		} else if (this.type == 2){
			this.button.style.backgroundColor = "#9f82EE"
		} else if (this.type == 3){
			this.button.style.backgroundColor = "#9f82DD"
		} else if (this.type == 4){
			this.button.style.backgroundColor = "#9f82CC"
		} else if (this.type == 5){
			this.button.style.backgroundColor = "#9f82BB"
		} else if (this.type == 6){
			this.button.style.backgroundColor = "#9f82AA"
		}
		this.body = document.getElementById("right"); //adding to HTML
		this.body.appendChild(this.button);
	}
}

//adding buttons to the button list and simultaneously instantiating them
theButtons.push(new aButton(1, "Old slave"));
theButtons.push(new aButton(2, "Autoclicker"));
theButtons.push(new aButton(3, "AutoGranny"));
theButtons.push(new aButton(4, "Bakery"));
theButtons.push(new aButton(5, "Small factory"));
theButtons.push(new aButton(6, "Big factory"));
theButtons.push(new aButton(7, "CookieCoder"));
theButtons.push(new aButton(8, "CookieBot"));
theButtons.push(new aButton(9, "AutoFactory"));
theButtons.push(new aButton(10, "Time warp"));
theButtons.push(new aButton(11, "AntiCookies"));
theButtons.push(new aButton(12, "Portal"));
theButtons.push(new aButton(13, "Bigger factory"));
theButtons.push(new aButton(14, "Rebranding"));
theButtons.push(new aButton(15, "Crowdfunding"));
theButtons.push(new aButton(16, "Outsourcing"));

//adding a function to each button denoting what to do when they are clicked. Cannot be a class method since values cannot be returned from onclick method
for (let i = 0; i < theButtons.length; i++){ //looping through array
	theButtons[i].button.onclick = function(){
		if (totalCookies > theButtons[i].value){ //if cookies is greater than price
			totalCookies = totalCookies - theButtons[i].value; //subtracting from total cookies
			theButtons[i].typeCount++; //adding one to amount of button
			cookiesPerSecond += theButtons[i].payBack; //adding to cookies per second
		}
	};
}

function mouseClickHandler(e){ //mouse click event handler
	var returnValue = Cookie.clicked(e.pageX, e.pageY, totalCookies, ones); //running the clicked function from cookie
	totalCookies = returnValue[0]; //unpacking array
	ones = returnValue[1];
	doDraw = true
}

function mouseDownHandler(e){ //drawing small cookie
	Cookie.drawSmall();
}

function mouseUpHandler(e){ //drawing big cookie
	Cookie.drawBig();
}

class one{ //number one that flies up when the cookie is hit
	constructor(){
		this.x = 1;
		while (this.x % 24 != 0){ //making sure x of "one" is a multiple of 24 to not allow overlapping
			this.x = Math.floor(Math.random() * 240) + 435;
		}
		this.y = 200;
	}
	drawOne(ones){ //drawing the one
		disp.fillStyle = "#D5DEED";
		disp.fillRect(this.x, 100, 24, 100);
		if (this.y >= 130){
			this.y -= 4; //making the "one" rise
			disp.fillStyle = "#9F8200"; //changing color
			disp.font = "24px sans-serif";
			disp.fillText("+1", this.x, this.y);
		} else {
			ones.splice(ones.indexOf(this), 1); //if reached a certain threshold (y < 20) remove from array to not run function constantly and to stop array from growing uncontrollably
		}
		return ones;
	}
}

function drawTheOnes(){ //drawing ones at their positions
	for (let i = 0; i < ones.length; i++){
		ones = ones[i].drawOne(ones);
	}
}
window.setInterval(drawTheOnes, 50); //drawing the "ones" at their positions every 50ms

function draw() {
	if (totalCookies > highScore){ //checking if new high score reached
		highScore = totalCookies;
	}
	if (doDraw){
		disp.fillStyle = "#D5DEED";
		disp.fillRect(20, 0, 370, 700); //clearing text
		disp.fillRect(20, 0, 715, 100); //clearing text
		doDraw = false;
		disp.font = "24px sans-serif";
		disp.fillStyle = "#9f8200";
		//drawing text
		disp.fillText("Cookies: " + totalCookies, 20, 24);
		disp.fillText("Cookies per second: " + cookiesPerSecond, 20, 54);
		disp.fillText("Most cookies: " + highScore, 20, 84);
		disp.font = "16px sans-serif";
		disp.rect(15, 91, 360, 409);
		disp.stroke();
		disp.fillText("Here's what you've bought: ", 20, 110);
		for (let i = 0; i < theButtons.length; i++){
			disp.fillText(theButtons[i].textx + ": " + theButtons[i].typeCount + " generating " + (theButtons[i].payBack * theButtons[i].typeCount) + "CPS", 20, 24*i + 132);
		}
	}
	//making sure cookie first instance is drawn (takes multiple attempts for some reason as mentioned above
	if (!(firstCookie)){
		Cookie.drawBig();
		cookieCount++
		if (cookieCount > 4){
			firstCookie = true;
		}
	}
	//constantly running draw function
	requestAnimationFrame(draw);
}

draw(); //starting game loop