//board set up
const board = document.getElementById("mazeBoard");
const context = board.getContext('2d');
let cellSize, maze, player, goal, moves;

//start function
function start() {
    const size = parseInt(document.getElementById('difficulty').value); //grid size based on diffculty
    cellSize = Math.floor(board.width / size); //calculate cell size
    createMaze(size);
    moves = 0; //reset # of moves
    drawMaze();
}

//initialize maze
function createMaze(size) {
    maze = [];
    for (let i = 0; i < size; i++) {
        maze[i] = new Array(size).fill(1); //2D array and fill with walls
    }
    generateMaze(0,0);
    setPlayerAndGoal(size);
}

//generate the maze
function generateMaze(x, y) {
    // Array of directions
    const directions = shuffle(["up", "down", "left", "right"]);
    maze[x][y] = 0;
    
    // Direction calculation
    directions.forEach(dir => {
        let nx = x;
        let ny = y;
        // Move by two cells to create pathways and ensure walls remain
        if (dir === "left") {
            nx = x - 2;
        } 
        else if (dir === "right") {
            nx = x + 2;
        } 
        else if (dir === "up") {
            ny = y - 2;
        } 
        else if (dir === "down") {
            ny = y + 2;
        }
    
        // Check if the new position is within bounds and is a wall
        if (nx >= 0 && nx < maze.length && ny >= 0 && ny < maze[0].length && maze[nx][ny] === 1) {
            // Remove wall between current cell and new cell to create a path
            maze[(x + nx) / 2][(y + ny) / 2] = 0;
            maze[nx][ny] = 0;
            generateMaze(nx, ny); // Recursively create paths
        }
    });
}



//shuffles the direction the path is carved to create a unique maze
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

  //draw maze
function drawMaze() {
    context.clearRect(0,0, board.width, board.height); //clears maze
    //draw each cell in the grid
    for (let x = 0; x < maze.length; x++) {
        for (let y = 0; y < maze[x].length; y++) {

            //check what the cell is
            if (maze[x][y] === 1) {
                context.fillStyle = "black";
              } else {
                context.fillStyle = "white";
              }

            context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }

      context.fillStyle = "blue"; // Player color
      context.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
      context.fillStyle = "green"; // Goal color
      context.fillRect(goal.x * cellSize, goal.y * cellSize, cellSize, cellSize);    
  }
 
//set initial position of player and goal
function setPlayerAndGoal(size) {
    player = {x: 0, y: 0};
    goal = {x: size - 1, y: size - 1};
 }

 //moves the player around
 function movePlayer(direction) {
    //get current position of player
    let {x, y}  = player;

    //update position based on direciton
    if (direction === 'up' && y > 0 && maze[x][y - 1] === 0) y--;
    if (direction === 'down' && y < maze.length - 1 && maze[x][y + 1] === 0) y++;
    if (direction === 'left' && x > 0 && maze[x - 1][y] === 0) x--;
    if (direction === 'right' && x < maze[0].length - 1 && maze[x + 1][y] === 0) x++;
    
    //update location and increment moves
    player = {x, y};
    moves++;
    drawMaze(); //redraw maze based on new posoiton
  
    //check if the player has reached the goal
    if (x === goal.x && y === goal.y) {
      displayVictory();
    }
  }

  function displayVictory() {
    document.getElementById("endMessage").style.display = "block";
    document.getElementById("numCount").innerText = moves; // Update the move count
  }

  function restartGame() {
    document.getElementById("endMessage").style.display = "none";
    start();
  }

  $(document).ready(function() {
    $('#mazeBoard').swipe({
      swipe: function(event, direction) {
        if (direction === 'up') movePlayer('up');
        if (direction === 'down') movePlayer('down');
        if (direction === 'left') movePlayer('left');
        if (direction === 'right') movePlayer('right');
      },
      threshold: 20 // Minimum distance (in pixels) to be considered a swipe
    });
  });
  
  // Start the game on button click
  $('#startGame').on('click', start);

  document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer('up');
            break;
        case 'ArrowDown':
            movePlayer('down');
            break;
        case 'ArrowLeft':
            movePlayer('left');
            break;
        case 'ArrowRight':
            movePlayer('right');
            break;
    }
});
