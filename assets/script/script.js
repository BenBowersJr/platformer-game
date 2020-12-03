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



	plgr = false;
	for (let hitbox of colliders) {

		//CHECK MATH

		if (plx + 50 > hitbox[0] && plx + 50 < hitbox[0] + 25 && ply < hitbox[1] + 50 && ply + 50 > hitbox[1]) {
			plvelx = -1.5;
		}
		if (plx < hitbox[0] + 50 && plx > hitbox[0] + 25 && ply < hitbox[1] + 50 && ply + 50 > hitbox[1]) {
			plvelx = 1.5;
		}
		if (ply + 50 > hitbox[1] && ply + 50 < hitbox[1] + 25 && plx < hitbox[0] + 50 && plx + 50 > hitbox[0]) {
			//ply = hitbox[1] - 50;
			plvely = 0;
			plgr = true;
		}
		if (ply < hitbox[1] + 50 && ply > hitbox[1] + 25 && plx < hitbox[0] + 50 && plx + 50 > hitbox[0]) {
			//ply = hitbox[1] + 50;
			plvely = 2;
			plgr = false;
		}


		// if (ply + 50 > hitbox[1] && ply < hitbox[1] + 50) {
		// 	if (plx + 50 > hitbox[0] && plx < hitbox[0] + 50) {

		// 		if (plx + 25 < hitbox[0] + 25) {
		// 			plx = plx - hitbox[0]/50;
		// 		}
		// 		else if (plx + 25 > hitbox[0] + 25) {

		// 		}
		// 		else if (ply + 25 < hitbox[1] + 25) {
		// 		}
		// 		else {
		// 		}
					
		// 	}
		// }
	}

		//Move player based on keyboard inputs
		if (plgr && (keys["32"] || keys["87"])) {
			plvely -=7;
			plgr = false;
		}
		if (keys["65"] && !keys["68"]) {
			plvelx -= 1.5;
		}
		if (keys["68"] && !keys["65"]) {
			plvelx += 1.5;
		}
	
		if (plvelx > 0 || plvelx < 0) {
			plvelx = plvelx / 1.25;
		}
	
	ply += plvely;
	plx += plvelx;
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