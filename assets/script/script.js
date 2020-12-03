plx = undefined;
ply = undefined;
plvelx = 0;
plvely = 0;
currlvl = undefined;

// Check for key's being pressed
window.document.addEventListener("keydown", (event) => {
	console.log(event.key);
})

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

	plvely += 0.2;

	ply += plvely;
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
		"--S------------------------------------",
		"---------------------------------------",
		"---------------------------------------",
		"---------------------------------------",
		"--------W------------------------------",
		"--------W------------------------------",
		"--------W------------------------------",
		"GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG",
	],
};