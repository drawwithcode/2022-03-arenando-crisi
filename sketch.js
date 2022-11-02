// the library that i used to track the eyes can be found here: https://github.com/auduno/clmtrackr

// i've followed this tutorial to use it: https://www.youtube.com/watch?v=kCHpFe4T7_A

// i've recycled the movement pattern of the asteroids from the previous assignment

// typewriter effect: https://editor.p5js.org/pippinbarr/sketches/bjxEfpiwS

let webcam = null;
let ctracker = null;
let p1x, p1y, p2x, p2y;
let numast = 5;
let asteroid = [];
let distbord = 10;
let spaceShip = null;
let angle = 0;
let shoot;
let shot = [];
let launched = false;
let haiperso = false;
let haivinto = false;
let mic;
let miclevel;
let voiceshot = false;
let cont = 0;
let font;
let explosion;
let gameover;
let win;
let theme;
let themestart = true;
let startup = true;
let string =
  "Hello, the earth is in danger, you have to save it! You have to drive our very advanced spacecraft, it moves with your head, tilt and move it to have a more accurate aim. It also mounts a very sophisticated cannon that can destroy asteroids that threaten the earth, shout 'pem' to fire.Press any key to start";
let currentCharacter = 0;
let pageMargintop = 0;
let pageMarginright = 0;

function preload() {
  spaceShip = loadImage("./assets/myspace.png");
  font = loadFont("./assets/Monocraft.otf");
  explosion = loadSound("./assets/boom.mp3");
  gameover = loadSound("./assets/gameover.mp3");
  win = loadSound("./assets/win.mp3");
  theme = loadSound("./assets/theme.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textFont(font);
  pageMargintop = width / 2;
  pageMarginright = height / 2;
  strokeWeight(3);

  webcam = createCapture(VIDEO);
  webcam.size(400, 300);
  webcam.hide();

  userStartAudio();
  mic = new p5.AudioIn();
  mic.start();

  ctracker = new clm.tracker();
  ctracker.init();
  ctracker.start(webcam.elt);

  for (let i = 0; i < numast; i++) {
    asteroid.push(
      new asteroids(
        random(0, width - distbord),
        random(0, height - distbord),
        round(random(30, 45)),
        random(1, 4)
      )
    );
  }
}

function draw() {
  if (startup == true) {
    background(0);
    fill("green");
    let currentString = string.substring(0, currentCharacter);

    push();
    textSize(30);
    text(
      currentString,
      pageMargintop + 10,
      pageMarginright + 10,
      width / 3,
      height / 3
    );
    pop();

    currentCharacter += 0.3;

    if (keyIsPressed == true) {
      startup = false;
    }
  } else {
    if (themestart == true) {
      themestart = false;
      theme.loop(0, 1, 0.4);
    }
    background(0);

    miclevel = mic.getLevel() * 100;

    if (miclevel > 6 && voiceshot == false) {
      voiceshot = true;
      shot.push(new missile());
    }
    if (miclevel < 6) {
      voiceshot = false;
    }
    translate(width, 0);
    scale(-1, 1);
    //image(webcam, width / 2 - webcam.width / 2, height - webcam.height);
    var features = ctracker.getCurrentPosition();

    if (features.length > 0) {
      let leftEye = features[27];
      let lEx = leftEye[0];
      let lEy = leftEye[1];

      let rightEye = features[32];
      let rEx = rightEye[0];
      let rEy = rightEye[1];

      p1x = map(lEx, 0, 400, 0, width);
      p1y = map(lEy, 0, 300, 0, height);
      p2x = map(rEx, 0, 400, 0, width);
      p2y = map(rEy, 0, 300, 0, height);

      /*ellipse(p1x, p1y, 20);
    ellipse(p2x, p2y, 20);*/

      angle = (Math.atan2(p2y - p1y, p2x - p1x) * 180) / Math.PI;
    }

    if (haiperso == true) {
      gameover.play();
      theme.stop();
      push();
      translate(width, 0);
      scale(-1, 1);
      fill(0);
      rect(width / 2, height / 2, 500, 300);
      fill(255);
      textSize(50);
      text("GAME OVER", width / 2, height / 2);
      noLoop();
      pop();
    }

    if (haivinto == true) {
      win.play();
      theme.stop();
      push();
      translate(width, 0);
      scale(-1, 1);
      fill(0);
      rect(width / 2, height / 2, 500, 300);
      fill(255);
      textSize(50);
      text("YOU WIN", width / 2, height / 2);
      noLoop();
      pop();
    }

    console.log(asteroid.length);

    if (cont > 150) {
      cont = 0;
      asteroid.push(
        new asteroids(
          random(0, width - distbord),
          random(0, height - distbord),
          round(random(30, 45)),
          random(1, 4)
        )
      );
    } else {
      cont++;
    }

    if (asteroid.length < 3) {
      haivinto = true;
    }
    let i = 0;
    while (i < asteroid.length) {
      asteroid[i].move();

      for (let z = 0; z < shot.length; z++) {
        if (
          asteroid[i].x + 15 > shot[z].x &&
          asteroid[i].y + 15 > shot[z].y &&
          asteroid[i].x - 15 < shot[z].x &&
          asteroid[i].y - 15 < shot[z].y
        ) {
          asteroid.splice(i, 1);
          shot.splice(z, 1);
          if (i > 1) {
            i--;
          }
          explosion.play(0, 1, 2);
        }
      }

      if (
        asteroid[i].x + 30 > (p1x + p2x) / 2 &&
        asteroid[i].y + 30 > (p1y + p2y) / 2 &&
        asteroid[i].x - 30 < (p1x + p2x) / 2 &&
        asteroid[i].y - 30 < (p1y + p2y) / 2
      ) {
        haiperso = true;
      }
      i++;
    }

    push();
    translate((p1x + p2x) / 2, (p1y + p2y) / 2);
    rotate(angle);
    imageMode(CENTER);
    image(spaceShip, 0, 0, 70, 82);
    pop();

    for (let i = 0; i < shot.length; i++) {
      shot[i].move();
    }
  }
}

class asteroids {
  constructor(xiniz, yiniz, amp, velocity) {
    this.x = xiniz;
    this.y = yiniz;
    this.a = amp;
    this.case = 1;
    this.time = 0;
    this.count = 0;
    this.v = velocity;
    this.color = "green";
  }

  move() {
    noFill();
    stroke(this.color);
    rect(this.x, this.y, this.a);

    if (this.count == this.time) {
      this.time = round(random(100, 200));
      this.count = 0;
      this.case = round(random(1, 4));
    }

    switch (this.case) {
      case 1:
        this.x += this.v;
        this.v = this.v + random(-0.05, 0.05);
        break;
      case 2:
        this.x -= this.v;
        this.v = this.v + random(-0.05, 0.05);
        break;
      case 3:
        this.y += this.v;
        this.v = this.v + random(-0.05, 0.05);
        break;
      case 4:
        this.y -= this.v;
        this.v = this.v + random(-0.05, 0.05);
        break;
    }

    if (this.x > width - distbord) {
      this.case = 2;
    }

    if (this.x < distbord) {
      this.case = 1;
    }

    if (this.y > height - distbord - height / 5) {
      this.case = 4;
    }

    if (this.y < distbord) {
      this.case = 3;
    }
    this.count++;
  }
}

class missile {
  constructor() {
    this.dir = angle + 90;
    this.vel = 10;
    this.x = (p1x + p2x) / 2;
    this.y = (p1y + p2y) / 2;
  }

  move() {
    push();
    translate(this.x, this.y);
    rotate(this.dir);
    rect(0, 0, 20, 10);
    pop();

    this.x = this.x - this.vel * cos(this.dir);
    this.y = this.y - this.vel * sin(this.dir);
  }
}

function keyPressed() {
  if (keyCode == 32) {
    shoot = true;
    shot.push(new missile());
  }
}

function keyReleased() {
  shoot = false;
}
