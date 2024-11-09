//board set up
const board = document.getElementById("mazeBoard");
const context = board.getContext('2d');
let cellSize, maze, player, goal, moves;

//start function
function start() {
    const size = parseInt(document.getElementById('difficulty').value); //grid size based on diffculty
    cellSize = Math.floor(1000 / size); //calculate cell size
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
function generateMaze() {
    //array of directions
    const directions = shuffle(["up", "down", "left", "right"]);
    maze[x][y] = 0;

    //direction calculation
    directions.forEach(dir => {
        //determines what the current direction is
        const nx = x + (dir === "left" ? -1 : dir === "right" ? 1 : 0);
        const ny = y + (dir === "up" ? -1 : dir === "down" ? 1 : 0);

        //bound checks current direction to make sure direction is within maze
        if (nx >= 0 && nx < maze.length && ny >= 0 && ny < maze.length && maze[nx][ny] === 1) {
            maze[x + (nx - x) / 2][y + (ny - y) / 2] = 0; //ensure adject path is connected
            generateMaze(nx, ny); //recursively calls to create a path
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
      displayVictoryMessage();
    }
  }

  