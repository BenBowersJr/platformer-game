plx = undefined;
ply = undefined;
plvelx = 0;
plvely = 0;
plgr = false;
currlvl = undefined;

colliders = [];

var keys = {};
window.onkeyup = function(e) { keys[e.keyCode] = false; }
window.onkeydown = function(e) { keys[e.keyCode] = true; }

// // Check for key's being pressed
// window.document.addEventListener("keydown", (event) => {
// 	switch (event.key) {
// 		case "w":
// 			if (plgr) {
// 				plvely -=5;
// 				plgr = false;
// 			}
// 			break;
// 			case "a":
// 				plvelx -=2;
// 				break;
// 			case "d":
// 				plvelx +=2;
// 				break;
// 	}
// })

function setup() {
	createCanvas(1000, 600);
	background("black");
	loadLevel(levels.l1);
}

const loadLevel = function(map) {
	currlvl = map;
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			switch (map[y][x]) {
				case "S":
					fill("lightblue");
					noStroke();
					rect(x*50, y*50, 50, 50);
					plx = x*50;
					ply = y*50;
					break;
				case "W":
				case "G":
					colliders.push([x*50, y*50, map[y][x]]);
					break;
			}
		}
	}
}

function draw() {
	renderlvl(currlvl);
	player();
}

const player = function() {
	fill("pink");
	stroke("black");
	rect(plx, ply, 50, 50);

	if (!plgr) { plvely += 0.2; }

	//Move player based on keyboard inputs
	if (plgr && (keys["32"] || keys["87"])) {
		plvely -=6;
		plgr = false;
	}
	if (keys["65"] && !keys["68"]) {
		plvelx -= 0.4;
	}
	if (keys["68"] && !keys["65"]) {
		plvelx += 0.4;
	}
	
	ply += plvely;
	plx += plvelx;

	checkcollide(plx, ply);
}

const checkcollide = function(x, y) {
	for (let hitbox of colliders) {
		console.log(plgr);
		if (x + 50 > hitbox[0] && x < hitbox[0] + 50) {
			if (y + 50 >= hitbox[1] && y < hitbox[1] + 50) {
				plgr = true;
			}
			else plgr = false;
		}


		if (y + 50 > hitbox[1] && y < hitbox[1] + 50) {
			if (x + 50 > hitbox[0] && x < hitbox[0] + 50) {
				if (x < hitbox[0] + 25) {

				}
				else {

				}

				if (y < hitbox[1] + 25) {
					ply = hitbox[1] - 50;
					plvely = 0;
				}
				else {

				}
			}
		}
	}
}

const renderlvl = function(map) {
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			switch (map[y][x]) {
				case "-":
					fill("lightblue");
					noStroke();
					rect(x*50, y*50, 50, 50);
					break;
				case "S":
					fill("lightblue");
					noStroke();
					rect(x*50, y*50, 50, 50);
					break;
				case "G":
					fill("lightgreen");
					noStroke();
					rect(x*50, y*50, 50, 50);
					break;
				case "W":
					fill("#FCE303");
					noStroke();
					rect(x*50, y*50, 50, 50);
					break;
			}
		}
	}
}

let levels = {
	l1: [
		"---------------------------------------",
		"---------------------------------------",
		"---------------------------------------",
		"---------------------------------------",
		"-------S-------------------------------",
		"-----------------G----------------------",
		"--------------------------------------",
		"---------------------------------------",
		"-W------W----------------W-------------",
		"--------W------W-----------------------",
		"---G----W--W---W------------------------",
		"GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
	],
};