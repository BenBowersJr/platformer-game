plx = undefined;
ply = undefined;
plvelx = 0;
plvely = 0;
plgr = false;
currlvl = undefined;
colliders = [];
let howFarRight = 0
let scrolledRight = 0
let plx = undefined;
let ply = undefined;
let plvelx = undefined;
let plvely = undefined;
let plgr = false;
let goalx = undefined;
let goaly = undefined;
let currlvl = 0;
let colliders = [];
let enemies = [];
let scrolledRight = undefined;

var keys = {};
let paused, oldVelX, oldVelY;
let time = 0;
window.onkeyup = function(e) { keys[e.keyCode] = false; }
window.onkeydown = function(e) { keys[e.keyCode] = true; }

function setup() {
	createCanvas(1000, 600);
	background("black");
	loadLevel(currlvl);
}

function draw() {
    if (currlvl != -1) { renderlvl(levels[currlvl]); }
	player();
}

const player = function() {
    // Draw the player
	fill("pink");
	stroke("black");
	rect(plx, ply, 50, 50);

    // Apply gravity
	if (!plgr) { plvely += 0.2; }

    //Move player based on keyboard inputs and not paused
    if (!paused) {
        time++
        if (plgr && (keyIsDown(32) || keyIsDown(87))) {
            plvely -=7;
            plgr = false;
        }
        if (keyIsDown(65) && !keyIsDown(68)) {
            plvelx -= 1.5;
        }
        if (keyIsDown(68) && !keyIsDown(65)) {
            plvelx += 1.5;
        }
        if (keyIsDown(27) && time >= 50) {
            oldVelX = plvelx
            oldVelY = plvely
            paused = true;
            time = 0
        }
        if (plvelx > 0 || plvelx < 0) {
            plvelx = plvelx / 1.25;
        }
    } else {
        time++
        plvelx = 0;
        plvely = 0;
        if (keyIsDown(27) && time >= 50) {
            plvelx = oldVelX;
            plvely = oldVelY;
            paused = false
            time = 0
        }
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
    
    
    // Check and handle map colliders
	plgr = false;
	for (let hitbox of colliders) {
		if (plx + plvelx + 50 > hitbox[0] && plx + plvelx < hitbox[0] + 25) {
			if (ply + plvely + 45 > hitbox[1] && ply + plvely < hitbox[1] + 45) {
				plvelx = -0.5;
			}
		}
		if (plx + plvelx < hitbox[0] + 50 && plx + plvelx > hitbox[0] + 25) {
			if (ply + plvely + 45 > hitbox[1] && ply + plvely < hitbox[1] + 45) {
				plvelx = 0.5;
			}
		}
		if (ply + plvely + 50 > hitbox[1] && ply + plvely < hitbox[1] + 25) {
			if (plx + plvelx + 45 > hitbox[0] && plx + plvelx < hitbox[0] + 45) {
				plvely = 0;
				plgr = true;
			}
		}
		if (ply + plvely < hitbox[1] + 50 && ply + plvely > hitbox[1] + 25) {
			if (plx + plvelx + 45 > hitbox[0] && plx + plvelx < hitbox[0] + 45) {
				plvely = 1;
				plgr = false;
			}
		}
    }

    if (plx + 45 > goalx && plx < goalx + 45) {
        if (ply + 45 > goaly && ply < goaly + 45) {
            if (levels[currlvl + 1] != "") {
                loadLevel(++currlvl);
            }
            else {
                // GAME WON!!!
            }
        }
    }

    for (enemy of enemies) {
        if (plx + 45 > enemy[0] && plx < enemy[0] + 45) {
            if (ply + 45 > enemy[1] && ply < enemy[1] + 45) {
                loadLevel(currlvl);
            }
        }
    }
        
	ply += plvely;
	plx += plvelx;
}

const loadLevel = function() {
    plvelx = 0;
    plvely = 0;
    scrolledRight = 0;

    if (currlvl != -1) {
        for (let y = 0; y < levels[currlvl].length; y++) {
            for (let x = 0; x < levels[currlvl][y].length; x++) {
                switch (levels[currlvl][y][x]) {
                    case "S":
                        plx = x*50;
                        ply = y*50;
                        break;
                }
            }
        }
    }
    else {
        // LOAD LEVEL SELECT
    }
}

const renderlvl = function() {
    colliders = [];
    enemies = [];
    
    if (Math.floor(plx/50) > 16 /* replace with expression */) {
        scrolledRight++;
        plx = 250;
    } 
    else if (Math.floor(plx/50) < 2 /* replace with expression */) {
        plx = 700;
        scrolledRight--;
    }

    noStroke();
    for (let y = 0; y < levels[currlvl].length; y++) {
        for (let x = 0; x < levels[currlvl][y].length; x++) {
            switch (levels[currlvl][y][x+(scrolledRight*12)]) {
                case "-":
                    fill("lightblue");
                    rect(x*50, y*50, 50, 50);
                    break;
                case "S":
                    fill("lightblue");
                    rect(x*50, y*50, 50, 50);
                    break;
                case "G":
                    fill("lime");
                    rect(x*50, y*50, 50, 50);
                    goalx = x*50;
                    goaly = y*50;
                    break;
                case "Z":
                    fill("lightblue");
                    rect(x*50, y*50, 50, 50);
                    colliders.push([x*50, y*50, levels[currlvl][y][x]]);
                    break;
                case "T":
                    fill("lightblue");
                    rect(x*50, y*50, 50, 50);
                    fill("#473320");
                    rect((x*50)+7, (y*50)-150, 35, 300);
                    fill("#4B7043");
                    rect((x*50)-50, (y*50)-200, 150, 75);
                    rect((x*50)-10, (y*50)-230, 75, 110);
                    colliders.push([x*50, (y-4.5)*50, levels[currlvl][y][x]]);
                    break;
                case "C":
                    fill("#CCE3DD");
                    rect((x*50)-100, (y*50), 3120, 30);
                    rect((x*50)+60, (y*50)-15, -150, 100);
                    rect((x*50)-20, (y*50)+30, -70, 30);
                    break;
                case "0":
                    fill("lightgreen");
                    rect(x*50, y*50, 50, 50);
                    colliders.push([x*50, y*50, levels[currlvl][y][x]]);
                    break;
                case "1":
                    fill("#82736D");
                    rect(x*50, y*50, 50, 50);
                    colliders.push([x*50, y*50, levels[currlvl][y][x]]);
                    break;
                case "2":
                    fill("#757575");
                    rect(x*50, y*50, 50, 50);
                    colliders.push([x*50, y*50, levels[currlvl][y][x]]);
                    break;
                case "X":
                    fill("crimson");
                    rect(x*50, y*50, 50, 50);
                    enemies.push([x*50, y*50, levels[currlvl][y][x]]);
                    break;

            }
        }
    }
}


// KEY
// - = Background
// S = Player Spawnpoint
// G = Level Goal
// Z = Invisible Barrier
// T = Tree
// C = Cloud
// 0 = Grass
// 1 = Dirt
// 2 = Stone
// X = BAD


const levels = [
	[
		"-Z----------------------------Z-",
		"-Z------C---------------C-----Z-",
		"-Z--C-------------------------Z-",
		"-Z-------------C--------------Z-",
		"-Z------------------------C---Z-",
		"-Z----------------------------Z-",
		"-Z----------------------------Z-",
		"-Z------------2---------------Z-",
		"TZ------------22--------------Z-",
		"00--------2---22---------G----Z-",
		"1000-S---22---222--T--------T-Z-",
        "11100000222XXX222200000000000000",
    ],
    [
        "-Z----------------Z-",
        "-Z----------------Z-",
        "-Z----------------Z-",
        "-Z----------------Z-",
        "-Z----------------Z-",
        "-Z----------------Z-",
        "-Z----------------Z-",
        "-Z----------------Z-",
        "-Z----------------Z-",
        "-ZS-------------G-Z-",
        "-Z----------------Z-",
        "00000000000000000000",
    ],
    [

    ],
];