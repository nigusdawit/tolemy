let crowd;

function setup() {
  let canvas = createCanvas(400, 300);  // Make canvas square
  canvas.parent('p5-container-1');  // Attach canvas to the container div

  crowd = new Crowd();

  for (let i = 0; i < 50; i++) {
    let p = new Person(random(width), random(height));
    crowd.addPerson(p);
  }

  // Ensure correct mouse coordinates for adding people
  canvas.mousePressed(() => {
    let canvasPos = canvas.elt.getBoundingClientRect();  // Get canvas position relative to the page
    let correctX = mouseX - canvasPos.left;  // Adjust mouseX relative to the canvas
    let correctY = mouseY - canvasPos.top;   // Adjust mouseY relative to the canvas
    console.log("Corrected Mouse Position: ", correctX, correctY);  // Debug the corrected position
    crowd.addPerson(new Person(correctX, correctY));  // Add person at the corrected position
  });
}

function draw() {
  background(20, 30, 50, 50);  // Dark background with slight transparency to create trails
  crowd.run();
}

// Rest of your code for the Crowd and Person classes remains the same


// Class to manage the entire crowd
class Crowd {
  constructor() {
    this.people = [];
  }

  run() {
    for (let person of this.people) {
      person.run(this.people);
    }
  }

  addPerson(p) {
    this.people.push(p);
  }
}

// Class representing an individual person
class Person {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 2;
    this.maxForce = 0.05;
    this.radius = 6;  // Larger size for visual impact
    this.color = color(random(100, 255), random(100, 255), random(100, 255), 150);  // Random color
  }

  run(people) {
    this.behaviors(people);
    this.update();
    this.edges();
    this.display();
  }

  behaviors(people) {
    let avoid = this.avoidOthers(people);
    let cohesion = this.cohesion(people);
    avoid.mult(1.5);  // Stronger tendency to avoid
    cohesion.mult(1.0);  // Moderate tendency to stay close
    this.applyForce(avoid);
    this.applyForce(cohesion);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);  // Reset acceleration
  }

  avoidOthers(people) {
    let desiredSeparation = 24;
    let steer = createVector(0, 0);
    let count = 0;

    for (let other of people) {
      let distance = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (distance > 0 && distance < desiredSeparation) {
        let diff = createVector(this.position.x - other.position.x, this.position.y - other.position.y);
        diff.normalize();
        diff.div(distance);
        steer.add(diff);
        count++;
      }
    }

    if (count > 0) {
      steer.div(count);
    }

    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(this.maxSpeed);
      steer.sub(this.velocity);
      steer.limit(this.maxForce);
    }
    return steer;
  }

  cohesion(people) {
    let neighborDistance = 50;
    let sum = createVector(0, 0);
    let count = 0;

    for (let other of people) {
      let distance = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (distance > 0 && distance < neighborDistance) {
        sum.add(other.position);  // Add positions of nearby people
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      return this.seek(sum);  // Steer toward the average position
    } else {
      return createVector(0, 0);
    }
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    return steer;
  }

  edges() {
    if (this.position.x > width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    if (this.position.y < 0) this.position.y = height;
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
  }
}
