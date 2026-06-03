const blocks = document.querySelectorAll('.block');
const cells = document.querySelectorAll('.cell');
const gameinfo = document.getElementById('gameinfo');
const resetbtn = document.getElementById('reset');
const gamearea = document.getElementById('gamearea');

let bigBoard;   
let mainBoard; 
let scoreX = 0; 
let scoreO = 0;
let startingPlayer = 'x';
let current = startingPlayer;
let gameActive = true;
let activeBoard = null; 

const winPattern = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];


function initGame() {
  bigBoard = Array(9).fill().map(() => Array(9).fill(''));
  mainBoard = Array(9).fill('');
  gameActive = true;

  if (current === 'x') {
  gamearea.style.background = '#ff8080';
  } else {
  gamearea.style.background = '#b3ffb3';
  }

  activeBoard = null;
  gameinfo.textContent = `Player ${current.toUpperCase()}'s Turn`;

  cells.forEach(cell => cell.className = 'cell');
  blocks.forEach(block => block.classList.remove('active', 'won-x', 'won-o'));
}
initGame();


function checkWin(board) {
  for (let pattern of winPattern) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {winner : board[a] , pattern};
    }
  }
  return null;
}

function checkDraw(board) {
  return board.every(cell => cell !== '');
}

function updateScoreboard() {
  document.querySelector('.player.x .score').textContent = scoreX;
  document.querySelector('.player.o .score').textContent = scoreO;
}

function cellClick(e) {
  if (!gameActive) return;

  const cell = e.currentTarget;
  const cellIndex = parseInt(cell.dataset.index);
  const block = cell.closest('.block');
  const blockIndex = parseInt(block.dataset.index);


  if (activeBoard !== null && activeBoard !== blockIndex) return;

  if (bigBoard[blockIndex][cellIndex] !== '') return;

  bigBoard[blockIndex][cellIndex] = current;
  cell.classList.add(current === 'x' ? 'flipped-x' : 'flipped-o');


  const smallWinner = checkWin(bigBoard[blockIndex]);
  if (smallWinner && mainBoard[blockIndex] === '') {
    mainBoard[blockIndex] = smallWinner.winner;
    block.classList.add(`won-${smallWinner.winner}`);
  } else if (checkDraw(bigBoard[blockIndex])) {
    mainBoard[blockIndex] = 'draw';
  }


  const bigWinner = checkWin(mainBoard);
  if (bigWinner) {
    gameinfo.textContent = `Player ${bigWinner.winner.toUpperCase()} Wins the Game!`;
    gameActive = false;

    blocks.forEach((block, i) => {
      if(!bigWinner.pattern.includes(i)){
        block.classList.remove('won-x', 'won-o');
      }
    });
    blocks.forEach((block, i) => {
      block.classList.remove('active');
    });

    cells.forEach(cell => {
      cell.classList.remove('flipped-x', 'flipped-o');
    });

    if(bigWinner.winner === 'x') scoreX++;
    else scoreO++;

    updateScoreboard();

    return;
  }

  if (checkDraw(mainBoard)) {
    gameActive = false;
    gameinfo.textContent = "It's a Draw!";
    return;
  }


  activeBoard = cellIndex;
  if (mainBoard[activeBoard] !== '' || checkDraw(bigBoard[activeBoard])) {
    activeBoard = null;
  }

  highlightActiveBoard();
  current = current === 'x' ? 'o' : 'x';
  gameinfo.textContent = `Player ${current.toUpperCase()}'s Turn`;
  
  if (current === 'x') {
  gamearea.style.background = '#ff8080';
  } else {
  gamearea.style.background = '#b3ffb3';
  }

  updateScoreboard();

}


function highlightActiveBoard() {
  blocks.forEach((block, i) => {
    block.classList.remove('active');
    if ((activeBoard === null && mainBoard[i] === '') || activeBoard === i) {
      block.classList.add('active');
    }
  });
}


function reset() {
  startingPlayer = startingPlayer === 'x' ? 'o' : 'x';
  current = startingPlayer;

  initGame();
  highlightActiveBoard();
}


cells.forEach(cell => cell.addEventListener('click', cellClick));
resetbtn.addEventListener('click', reset);

highlightActiveBoard();