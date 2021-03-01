/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Game {

  constructor(height=6, width=7, player1, player2){
    this.WIDTH = width;
    this.HEIGHT = height;

    this.player1 = player1;
    this.player2 = player2;
    this.currPlayer = player1; // active player: 1 or 2
    this.board = []; // array of rows, each row is array of cells  (board[y][x])
    this.clearHtmlBoard();
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }
  
  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */

  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const dispBoard = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    dispBoard.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      dispBoard.append(row);
    }
  }

  clearHtmlBoard() {
    const dispBoard = document.getElementById('board');
    dispBoard.innerHTML = '';
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.setAttribute('style', `background-color:${this.currPlayer.color}`)
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    alert(msg);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.name;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      this.gameOver = true;
      this.disablePlay();
      return this.endGame(`Player ${this.currPlayer.name} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      this.gameOver = true;
      this.disablePlay();
      return this.endGame('Tie!');
    }
  
    // switch players
    this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
  }

  /** disablePlay: removes eventListener from top column so no more plays can be made */

  disablePlay() {
    const top = document.getElementById('column-top');
    top.removeEventListener('click', this.handleClick);
  }



  /** isWin: used to check possible winning combinations */
    isWin(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer.name
        );
    }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */
    checkForWin() {
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (this.isWin(horiz) 
        || this.isWin(vert) 
        || this.isWin(diagDR) 
        || this.isWin(diagDL)) {
          return true;
        }
      }
    }
  }

}


class Player {
  constructor(name, color){
    this.name = name;
    this.color = color;
  }
}
const playerForm = document.createElement('div');
playerForm.setAttribute('id', 'playerForm');

const player1LabelHolder = document.createElement('label');
player1LabelHolder.className = 'holder';
player1LabelHolder.innerText = "Please enter Player 1's:  ";
const player1NameLabel = document.createElement('label');
player1NameLabel.setAttribute('for', 'player1Name');
player1NameLabel.innerText = 'Name:';
const player1NameField = document.createElement('input');
player1NameField.setAttribute('type', "text");
player1NameField.setAttribute('id', 'p1Name');
const player1ColorLabel = document.createElement('label');
player1ColorLabel.setAttribute('for', 'player1Color');
player1ColorLabel.innerText = 'Color:';
const player1ColorField = document.createElement('input');
player1ColorField.setAttribute('type', "text");
player1ColorField.setAttribute('id', 'p1Color');
const player2LabelHolder = document.createElement('label');
player2LabelHolder.className = 'holder';
player2LabelHolder.innerText = "Please enter Player 2's:  ";
const player2NameLabel = document.createElement('label');
player2NameLabel.setAttribute('for', 'player2Name');
player2NameLabel.innerText = 'Name:';
const player2NameField = document.createElement('input');
player2NameField.setAttribute('type', "text");
player2NameField.setAttribute('id', 'p2Name');
const player2ColorLabel = document.createElement('label');
player2ColorLabel.setAttribute('for', 'player2Color');
player2ColorLabel.innerText = 'Color:';
const player2ColorField = document.createElement('input');
player2ColorField.setAttribute('type', "text");
player2ColorField.setAttribute('id', 'p2Color');


// figure out the layout
player1LabelHolder.append(player1NameLabel, player1NameField, player1ColorLabel, player1ColorField);
player2LabelHolder.append(player2NameLabel, player2NameField, player2ColorLabel, player2ColorField);
playerForm.append(player1LabelHolder, player2LabelHolder);

const newGameBtn = document.createElement('input');
newGameBtn.setAttribute('type', 'button')
newGameBtn.setAttribute('value', 'New Game');
newGameBtn.setAttribute('id', 'newGameBtn');
newGameBtn.addEventListener('click', () => {
  try{
    if(gameBeingPlayed){
      delete gameBeingPlayed;
    }
  } catch {
  } finally {
    const players = [...getPlayers()]
    const gameBeingPlayed = new Game(6,7,...players); 
  }
});
document.querySelector('body').append(playerForm);
document.querySelector('body').append(newGameBtn);

function getPlayers() {
  const p1Name = document.querySelector('#p1Name').value;
  const p1Color = document.querySelector('#p1Color').value;
  const p2Name = document.querySelector('#p2Name').value;
  const p2Color = document.querySelector('#p2Color').value;
  return [new Player(p1Name, p1Color), new Player(p2Name, p2Color)];
}
