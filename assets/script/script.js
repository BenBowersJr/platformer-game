let scrolledRight = 0;
let plx, ply, plvelx, plvely, goalx, goaly, paused, oldVelX, oldVelY;
let moveRight = 68;
let moveLeft = 65;
let Jump = 32;
let plgr = false;
let currlvl = 0;
let colliders = [];
let enemies = [];
let lvlWonArray = [];
let mainMenuObj = document.querySelector('.main-menu');
let button1 = document.querySelector('#button1');
let button2 = document.querySelector('#button2');
let gameWonText = document.querySelector('p');
gameWonText.style.display = 'none';

//create button for each level and give it some text
let level1Button = document.createElement('button');
level1Button.textContent = 'Level 1';
//this gives the button a 'onclick' event listener. then sets the currlvl value and restarts the level
level1Button.setAttribute('onclick', "currlvl=0, closeMenu(), restart(currlvl)");
let level2Button = document.createElement('button');
level2Button.textContent = 'Level 2';
level2Button.setAttribute('onclick', "currlvl=1, closeMenu(), restart(currlvl)");
let level3Button = document.createElement('button');
level3Button.textContent = 'Level 3';
level3Button.setAttribute('onclick', "currlvl=2, closeMenu(), restart(currlvl)");
let level4Button = document.createElement('button');
level4Button.textContent = 'Level 4';
level4Button.setAttribute('onclick', "currlvl=3, closeMenu(), restart(currlvl)");
let level5Button = document.createElement('button');
level5Button.textContent = 'Level 5';
level5Button.setAttribute('onclick', "currlvl=4, closeMenu(), restart(currlvl)");

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

function mainMenu() {
    mainMenuObj.style.visibility = 'visible';
    pausecd++;
    plvelx = 0;
    plvely = 0;
    //if esc is pressed close menu
    if (keyIsDown(27) && pausecd >= 20) {
        closeMenu();
    }
    
}

function closeMenu() {
    // set velocity to what it was before being paused
    plvelx = oldVelX;
    plvely = oldVelY;
    //make buttons display on screen, but the main-menu class is still hidden so they cant be seen
    button1.style.display = 'block';
    button2.style.display = 'block';
    mainMenuObj.style.visibility = 'hidden';
    // hide buttons from other menus
    level1Button.style.display = 'none';
    level2Button.style.display = 'none';
    level3Button.style.display = 'none';
    level4Button.style.display = 'none';
    level5Button.style.display = 'none';
    gameWonText.style.display = 'none';
    paused = false;
    pausecd = 0;
}

function restart(currlvl) {
    // this restarts the game
    loadLevel(currlvl);
    paused = false;
    mainMenuObj.style.visibility = 'hidden';
}

function levelSelect() {
    //hide the main menu buttons
    button1.style.display = 'none';
    button2.style.display = 'none';

    // hide all other buttons
    level2Button.style.display = 'none';
    level3Button.style.display = 'none';
    level4Button.style.display = 'none';
    level5Button.style.display = 'none';

    //display individual level buttons if they completed the level
    for (let lev of lvlWonArray) {
        if (lev === 0) {
            level1Button.style.display = 'block';
        } else if (lev === 1) {
            level2Button.style.display = 'block';
        } else if (lev === 2) {
            level3Button.style.display = 'block';
        } else if (lev === 3) {
            level4Button.style.display = 'block';
        } else if (lev === 4) {
            level5Button.style.display = 'block';
        }
    }

    //add the individual level buttons
    mainMenuObj.appendChild(level1Button);
    mainMenuObj.appendChild(level2Button);
    mainMenuObj.appendChild(level3Button);
    mainMenuObj.appendChild(level4Button);
    mainMenuObj.appendChild(level5Button);

    //if esc is pressed close menu
    if (keyIsDown(27) && pausecd >= 20) {
        closeMenu();
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
        // jump if space, w, or upArrow is pressed
        if (plgr && (keyIsDown(87) || keyIsDown(38) || keyIsDown(32))) {
            plvely -=7;
            plgr = false;
        }
        // move left if a key, or leftArrow is pressed
        if (keyIsDown(65) || keyIsDown(37)) {
            plvelx -= 1.5;
        }
        //move right if d key or rightArrow is pressed
        if (keyIsDown(68) || keyIsDown(39)) {
            plvelx += 1.5;
        }
        if (keyIsDown(27) && pausecd >= 50) {
            oldVelX = plvelx;
            oldVelY = plvely;
            paused = true;
            pausecd = 0;
        }
        //this adds drag/friction
        if (plvelx > 0 || plvelx < 0) {
            plvelx = plvelx / 1.25;
        }
    }
    else {
        mainMenu();
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
                lvlWonArray.push(currlvl);
                loadLevel(++currlvl);
            } else if (currlvl === 4) {
                lvlWonArray.push(currlvl);
                gameWonText.style.display = 'block'
                mainMenu()
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
}

const renderlvl = function() {
    colliders = [];
    enemies = [];
    goalx = undefined;
    goaly = undefined;
    
    //this code scrolls the game to the right when the player goes over 16 blocks to the right
    if (Math.floor(plx/50) > 16) {
        scrolledRight++;
        plx = 250;
    } 
    //this scrolls the game to the left when the player goes 2 blocks from the left edge
    else if (Math.floor(plx/50) < 2) {
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
                    noStroke();
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
                case "L":
                    fill("crimson");
                    rect(x*50, y*50, 50, 50);
                    enemies.push([x*50, y*50]);
                    break;
                case "|":
                    fill('lightblue');
                    rect(x*50, y*50,50,50);
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
// X = Lava
// | = Page Scrolling Point, this renders as clear blue sky. mainly for ease of making levels
// 9 tiles = max length jump
// W = WIN


const levels = [
	[
		"-Z-----------------|----------Z-",
		"-Z------C----------|------C---Z-",
		"-Z--C--------------|----------Z-",
		"-Z---------------C-|----------Z-",
		"-Z-----------------|--------C-Z-",
		"-Z-----------------|----------Z-",
		"-Z-----------------|----------Z-",
		"-Z--------------2--|----------Z-",
		"TZ--------------22-|----------Z-",
		"00---S----2-----22-|--------G-Z-",
		"1000-----22-----222|-T-------TZ-",
        "11100000222LLLLL2222000000000000",
    ],
    [
		"-Z----------------------------Z-",
		"-Z-C---G-------C------------C-Z-",
		"-Z----------------------------Z-",
		"-Z----000---------------------Z-",
		"-Z----111----------22---------Z-",
		"-Z----------------------------Z-",
		"-Z---------------------22-----Z-",
		"-Z----------------------------Z-",
		"-Z--S---------------------22--Z-",
		"-Z-T------L---T----L----------Z-",
		"00000000--2---00---2--0000000000",
        "11111111--2---11---2--1111111111",
        "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL",
    ],
    [
        "-Z-----------------|-----------|-----------|--------C-Z-",
        "-Z-C---------------|-C---------|-----C-----|--C-------Z-",
        "-Z----------C------|--------C--|-----------|----------Z-",
        "-Z-----C-----------|-----------|-----------|----------Z-",
        "-Z-----------------|-----------|L---L----LL|----------Z-",
        "-Z-----------------|-----------|L---L----LL|----------Z-",
        "-Z-----------------|---------22222222222222222--------Z-",
        "-Z-----------------|-----------|-----------|----------Z-",
        "-Z-----------------|-----22----|-----------|-------G--Z-",
        "11--S--------------|----222----|-----------|----------Z-",
        "211----------------|--22222----|-----------|----------Z-",
        "2222222------22-----2222222LL2LLLLLL2LLLLL2LLL2222222222",
        "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL",
    ],
    [
        "--Z------------------------------------------------------------------------------------",
        "--Z--S---C---------C-------------------------------------C------------------------------",
        "--Z---T------------------------C-------C----------------------------C---------C-------",
        "--Z-000---------T------------------------------C----------------------------------------",
        "--Z-111-------000000--------------------------------------------------------------------",
        "--Z-----------111111------------------------------------------------------G---------------",
        "--Z--------------------------T-------00------------------------------------------------",
        "--Z-------------------------000------11---------------000--------00---------------------",
        "--Z-------------------------111--------C--------------111--------11--------------------",
        "--Z-------C-----------------------------------------------------------------------C----",
        "--Z------------------------------------------------------------------------------------",
        "--Z---------------------------------------T------T------------------------T------------",
        "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL",
    ],
    [
        "-Z--------------T-----T0000222222222222222222222222222222222222222222",
        "-Z-C--------T-0000000000111112212222222211122222-------22222222222222",
        "-Z---------00001111111111122222112222222112222----------2222222222222",
        "-Z------C--11111222222222222222112222222222222-----------222222222222",
        "-Z-----------222222222-----22222122222------------22L----L22222222222",
        "-Z-------------222222-------22----L22------------2222L----L2222222222",
        "-Z----------------222---L---2L----L22---LL-----2222222L----L222222222",
        "-Z----------------------L------L-------LLLL--2222222222L----L22222222",
        "-Z---------12222222222222------2222222222222222222222222L---------222",
        "-Z--S-----11222222222222222222222222222222222222222212222L------G-222",
        "-Z----T--1122222222222222222222222222112222222222222122222--------222",
        "000000000122222222222222222222222222222222222222222222222222222222222"
    ],
];