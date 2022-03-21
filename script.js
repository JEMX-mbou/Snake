'use strict';

// Declaring snakeCoords array variable.
// First 3 coordinates are set. Starting snake is 3 "pixels" big.
var snakeCoords = [
  [15, 15],
  [16, 15],
  [17, 15]
];

var foodCoords = [];

// Declaring w and h integer variables
// Used for the screen width and height.
const w = 30;
const h = 30;

// Declaring interval integer variable.
// Interval used in milliseconds
const interval = 200;

// Declaring tick integer variable.
// To count how many times update has been fired.
var tick = 0;

// Declaring foodSpawnTime integer variable.
// Amount of time to expire before food spawns, in milliseconds.
const foodSpawnTime = 3000;

// Select div element with ID screen.
// And draw the pixels with the generate_pixels function.
const screen = document.querySelector('div#screen');
screen.innerHTML = generate_pixels(w, h);

// Snake is drawn on the screen.
draw_snake();

// Body element; KeyDown EventListener
// Used for snake controls. Arrow keys and WASD can be used.
document.body.addEventListener('keydown', (e) => {

  // Declare dir string variable.
  // Used for the direction of movement for the snake.
  let dir = '',
      oldDir = screen.getAttribute('direction');

  // The key property of the event object is used.
  switch(e.key) {
    case 'ArrowUp':
    case 'w':
      dir = 'u'; // Direction changed to up.
      break;
    case 'ArrowRight':
    case 'd':
      dir = 'r'; // Direction changed to right.
      break;
    case 'ArrowDown':
    case 's':
      dir = 'd'; // Direction changed to down.
      break;
    case 'ArrowLeft':
    case 'a':
      dir = 'l'; // Direction changed to left.
      break;
    default:
      dir = oldDir; // Old direction will be used.
      break;
  }

  // These if statements make it impossible to invert the snake.
  if (oldDir == 'u' && dir == 'd') dir = 'u';
  if (oldDir == 'd' && dir == 'u') dir = 'd';
  if (oldDir == 'r' && dir == 'l') dir = 'r';
  if (oldDir == 'l' && dir == 'r') dir = 'l';

  // Direction will be set as attribute. Used in update function.
  screen.setAttribute('direction', dir);
});

// setInterval function
// Direction attribute on screen element needs to be set for update function.
// Used to update the screen every 250 milliseconds.
setInterval(() => { update() }, interval);

// @function generate_pixels
// Used for generating a playing field. Consisting of div.row and div.col.
// @param int rows, int cols; Amount of rows and columns.
// @return string
function generate_pixels( rows = 20, cols = 20 ) {

  // Declare pxHTML string variable.
  let pxHTML = '';

  // For loop using rows variable.
  for(let r = 0; r <= rows; r++) {
    // Adding row HTML.
    pxHTML += '<div id="r'+r+'" class="row">';

    // For loop using cols variable.
    for(let c = 0; c <= cols; c++) {
      // Adding px HTML.
      pxHTML += '<div id="c'+c+'" class="px"></div>'; // These are the "pixel" elements.
    }
    // Closing row element.
    pxHTML += '</div>';
  }
  // Return pxHTML string variable.
  return pxHTML;
}

// @function update_coords
// Will update the coordinates of the snake pixels.
// @param string dir; Used for direction, can be (u, r, d, l);
// @return void
function update_coords( dir ) {

  // Declare lastCoords array variable.
  let lastCoords = [];

  // Declare grow boolean variable.
  let grow = false;

  // Declare trailingPx array variable;
  let trailingPx = snakeCoords[snakeCoords.length-1];

  // Loop through snake pixels.
  snakeCoords.forEach((pxCoord, i) => {

    // Declare yStep and xStep variable.
    let yStep = 0,
        xStep = 0;

    // dir parameter is used to move the snake in a direction.
    // u (up) and down (d) update the y coordinates.
    // r (right) and l (left) update the x coordinates.
    switch (dir) {
      case 'u':
        yStep = -1;
      break;
      case 'r':
        xStep = 1;
      break;
      case 'd':
        yStep = 1;
      break;
      case 'l':
        xStep = -1;
      break;
    }

    // Declare newCoords array variable.
    let newCoords = [];

    if ( i == 0 ) {
      // Coordinates are updated with the steps.
      let newY = pxCoord[0] + yStep,
          newX = pxCoord[1] + xStep;

      // Check if new "pixels" are on the y-axis "screen".
      // Otherwise the snake will wrap the screen vertically.
      if (newY < 0) newY = h;
      else if (newY > h) newY = 0;

      // Check if new "pixels" are on the x-axis "screen".
      // Otherwise the snake will wrap the screen horizontally.
      if (newX < 0) newX = w;
      else if (newX > w) newX = 0;

      // Set new coordinates for leading pixel.
      newCoords = [newY, newX];
      if (px_is_food(newCoords)) grow = true;
    } else {
      // Set coordinates using coordinates of last pixel.
      newCoords = lastCoords;
    }

    // Set lastCoords for next pixel.
    lastCoords = pxCoord;

    // New pixels are added to the snakeCoords array variable.
    snakeCoords[i] = newCoords;
  });

  // If grow is true trailingPx is added to snake.
  if (grow) {
    px_is_food(trailingPx, true);
    snakeCoords.push(trailingPx)
  }

  // Updated snake is drawn.
  draw_snake();

}

function select_pixel(pxCoords) {
  return document.querySelector('div#r'+pxCoords[0]+' div#c'+pxCoords[1]);
}

// @function draw_snake
// Will "draw" the snake "pixels".
// Using the coordinates and adding the active class to the necessary div elements.
// @return void
function draw_snake() {
  // All active "pixels" are selected.
  const activeCols = document.querySelectorAll('div.px.active');

  // If there are active pixels. The active class will be removed.
  if (activeCols.length) {
    activeCols.forEach((col) => { col.classList.remove('active'); });
  }

  // First or updated coordinates are used to add the active class to necessary "pixel" elements.
  snakeCoords.forEach((pxCoord, i) => {
    select_pixel(pxCoord).classList.add('active');
  });
}

// @function spawn_food
// Used to spawn food on random spots.
// @return void
function spawn_food() {
  // Declaring randY and randX integer variables
  // Random integers max based on screen size variables w and h.
  const randY = Math.floor(Math.random() * h);
  const randX = Math.floor(Math.random() * w);
  // Declaring newCoords array variable
  const newCoords = [randY, randX];

  // If pixel isn't food.
  if (!px_is_food(newCoords)) {
    // Selecting pixel with new coordinates and adding food class.
    select_pixel(newCoords).classList.add('food');
    // Adding newCoords to foodCoords array.
    foodCoords.push(newCoords);
  }
  else spawn_food(); // If pixel is food function needs to be called recursively.
}


function px_is_food( coords, despawn = false ) {

  if (foodCoords.length == 0) return false;

  let result = false;

  foodCoords.forEach((foodPx, i, obj) => {

    if (foodPx[0] == coords[0] && foodPx[1] == coords[1]) {
      if (despawn) {
        select_pixel(coords).classList.remove('food');
        object.splice(i, 1);
      }
      result = true;
    }
  });

//  console.log(foodCoords);

  return result;
}

// @function update
// Used for the interval function.
function update() {
  if ((tick * interval) % foodSpawnTime === 0) spawn_food();

  if (screen.getAttribute('direction')) {
    update_coords(screen.getAttribute('direction'))
  }
  tick++;
}
