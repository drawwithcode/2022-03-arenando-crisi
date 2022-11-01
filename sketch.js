// the library that i used to track the eyes can be found here: https://github.com/auduno/clmtrackr

// i've followed this tutorial to use it: https://www.youtube.com/watch?v=kCHpFe4T7_A

// i've recycled the movement pattern of the asteroids from the previous assignment

let webcam = null;
let ctracker = null;
let p1x, p1y, p2x, p2y;
let numast = 10;
let asteroid = [];
let distbord = 10;
let spaceShip = null;
let angle = 0;
let shoot;
let shot = [];
let launched = false;

function preload() {
  spaceShip = loadImage("./assets/myspace.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  rectMode(CENTER);

  webcam = createCapture(VIDEO);
  webcam.size(400, 300);
  webcam.hide();

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
  background(0);

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

  for (let i = 0; i < asteroid.length; i++) {
    asteroid[i].move();

    for (let z = 0; z < shot.length; z++) {
      if (
        asteroid[i].x + 30 > shot[z].x &&
        asteroid[i].y + 30 > shot[z].y &&
        asteroid[i].x - 30 < shot[z].x &&
        asteroid[i].y - 30 < shot[z].y
      ) {
        asteroid.splice(i, 1);
        shot.splice(z, 1);
      }
    }
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

class asteroids {
  constructor(xiniz, yiniz, amp, velocity) {
    this.x = xiniz;
    this.y = yiniz;
    this.a = amp;
    this.case = 1;
    this.time = 0;
    this.count = 0;
    this.v = velocity;
    this.color = "white";
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

    if (this.y > height - distbord) {
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
