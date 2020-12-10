let scrolledRight = 0
let plx, ply, plvelx, plvely, goalx, goaly, paused, oldVelX, oldVelY
let moveRight = 68
let moveLeft = 65
let Jump = 32
let plgr = false;
let currlvl = 0;
let colliders = [];
let enemies = []
let mainMenuObj = document.querySelector('.main-menu')
let button1 = document.querySelector('#button1')
let button2 = document.querySelector('#button2')
let button3 = document.querySelector('#button3')
//create button 
let level1Button = document.createElement('button')
level1Button.textContent = 'Level 1'
//this gives the button a 'onclick' event listener. then sets the currlvl value and restarts the level
level1Button.setAttribute('onclick', "currlvl=0, restart(currlvl), closeMenu()")

//create level 2 button
let level2Button = document.createElement('button')
level2Button.textContent = 'Level 2'
level2Button.setAttribute('onclick', "currlvl=1, restart(currlvl), closeMenu()")

//create the button for rebinding the settings
let rebindControlsButton = document.createElement('button')
rebindControlsButton.textContent = 'Rebind Movement keys (currently Broken)'
rebindControlsButton.setAttribute('onclick', 'rebindControls(), restart(currlvl), closeMenu()')

var keys = {};
let pausecd = 0;

function setup() {
	createCanvas(1000, 600);
	background("black");
	loadLevel(currlvl);
}

function draw() {
    if (currlvl != -1) { renderlvl(levels[currlvl]); }
	player();
}

function settings() {
    //hide menu buttons
    button1.style.display = 'none';
    button2.style.display = 'none';
    button3.style.display = 'none';

    
    rebindControlsButton.style.display = 'block'
    mainMenuObj.appendChild(rebindControlsButton)

    //if esc is pressed close menu
    if (keyIsDown(27) && pausecd >= 20) {
        closeMenu()
    }

}

function rebindControls() {
    moveRight = prompt('Which key would you like for moving right?').charCodeAt(0)
    moveLeft = prompt('Which key would you like for moving left?').charCodeAt(0)
    Jump = prompt('Which key for jumping?').charCodeAt(0)

    //if esc is pressed close menu
    if (keyIsDown(27) && pausecd >= 20) {
        closeMenu()
    }
}

function mainMenu() {
    mainMenuObj.style.visibility = 'visible'
    pausecd++
    plvelx = 0;
    plvely = 0;
    //if esc is pressed close menu
    if (keyIsDown(27) && pausecd >= 20) {
        closeMenu()
    }
    
}

function closeMenu() {
    // set velocity to what it was before being paused
    plvelx = oldVelX;
    plvely = oldVelY;
    //make buttons display on screen, but the main-menu class is still hidden so they cant be seen
    button1.style.display = 'block'
    button2.style.display = 'block'
    button3.style.display = 'block'
    mainMenuObj.style.visibility = 'hidden'
    // hide buttons from other menus
    level1Button.style.display = 'none'
    level2Button.style.display = 'none'
    rebindControlsButton.style.display = 'none'
    paused = false
    pausecd = 0
}

function restart(currlvl) {
    // this restarts the game
    loadLevel(currlvl)
    renderlvl(currlvl)
    paused = false 
    mainMenuObj.style.visibility = 'hidden'
}

function levelSelect() {
    //hide the main menu buttons
    button1.style.display = 'none'
    button2.style.display = 'none'
    button3.style.display = 'none'

    //display individual level buttons
    level1Button.style.display = 'block'
    level2Button.style.display = 'block'


    //add the individual level buttons
    mainMenuObj.appendChild(level1Button);
    mainMenuObj.appendChild(level2Button);

    //if esc is pressed close menu
    if (keyIsDown(27) && pausecd >= 20) {
        closeMenu()
    }
}

const player = function() {
    // Draw the player
	fill("pink");
	stroke("black");
	rect(plx, ply, 50, 50);

    // Apply gravity
	if (!plgr) { plvely += 0.2; }

    //Move player based on keyboard inputs and if game is not paused
    if (!paused) {
        pausecd++
        if (plgr && (keyIsDown(87))) {
            plvely -=7;
            plgr = false;
        }
        if (keyIsDown(65)) {
            plvelx -= 1.5;
        }
        if (keyIsDown(68)) {
            plvelx += 1.5;
        }
        if (keyIsDown(27) && pausecd >= 50) {
            oldVelX = plvelx
            oldVelY = plvely
            paused = true;
            pausecd = 0
        }
        if (plvelx > 0 || plvelx < 0) {
            plvelx = plvelx / 1.25;
        }
    }
    else {
        mainMenu()
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
            if (levels[currlvl + 1] != undefined) {
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

const loadLevel = function(currlvl) {
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
                    stroke("black");
                    rect(x*50, y*50, 50, 50);
                    noStroke()
                    goalx = x*50;
                    goaly = y*50;
                    break;
                case "Z":
                    fill("lightblue");
                    rect(x*50, y*50, 50, 50);
                    colliders.push([x*50, y*50]);
                    break;
                case "T":
                    fill("lightblue");
                    rect(x*50, y*50, 50, 50);
                    fill("#473320");
                    rect((x*50)+7, (y*50)-150, 35, 300);
                    fill("#4B7043");
                    rect((x*50)-50, (y*50)-200, 150, 75);
                    rect((x*50)-10, (y*50)-230, 75, 110);
                    colliders.push([x*50, (y-4.5)*50]);
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
                    colliders.push([x*50, y*50]);
                    break;
                case "1":
                    fill("#82736D");
                    rect(x*50, y*50, 50, 50);
                    colliders.push([x*50, y*50]);
                    break;
                case "2":
                    fill("#757575");
                    rect(x*50, y*50, 50, 50);
                    colliders.push([x*50, y*50]);
                    break;
                case "X":
                    fill("crimson");
                    rect(x*50, y*50, 50, 50);
                    enemies.push([x*50, y*50]);
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
        "-Z------------------------------Z-",
        "-Z-----------------------C------Z-",
        "-Z---------------------------C--Z-",
        "-Z------------------------------Z-",
        "-Z----C-------------------------Z-",
        "-Z------------------------------Z-",
        "-Z------------------------------Z-",
        "-Z------------------------------Z-",
        "-Z------------------------------Z-",
        "-ZS---------------------------G-Z-",
        "-Z-------------T----------------Z-",
        "0000000000000000000000000000000000",
    ],
];