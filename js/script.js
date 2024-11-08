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