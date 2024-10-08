const gameBoard = document.querySelectorAll('.cell');
const statusDisplay = document.querySelector('#status');
const restartButton = document.querySelector('#restartButton');
const canvas = document.getElementById("winningLine");
const ctx = canvas.getContext("2d");

let gameActive = true;
let currentPlayer = 'X';
let gameState = ["", "", "", "", "", "", "", "", ""];


const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];


function handleCellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.innerHTML = currentPlayer;
  clickedCell.classList.add(currentPlayer === 'X' ? 'x' : 'o');
}


function handlePlayerChange() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}


function handleResultValidation() {
  let roundWon = false;
  let winningCombo = [];

  for (let i = 0; i < winningConditions.length; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];
    
    if (a === '' || b === '' || c === '') {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      winningCombo = winCondition;
      break;
    }
  }

  if (roundWon) {
    statusDisplay.innerHTML = `Player ${currentPlayer} has won!`;
    gameActive = false;
    drawWinningLine(winningCombo);
    return;
  }

  let roundDraw = !gameState.includes("");
  if (roundDraw) {
    statusDisplay.innerHTML = 'Game ended in a draw!';
    gameActive = false;
    return;
  }

  handlePlayerChange();
}


function drawWinningLine(winningCombo) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  const cells = document.querySelectorAll('.cell');
  const startCell = cells[winningCombo[0]].getBoundingClientRect();
  const endCell = cells[winningCombo[2]].getBoundingClientRect();

  
  const startX = startCell.left + startCell.width / 2;
  const startY = startCell.top + startCell.height / 2;
  const endX = endCell.left + endCell.width / 2;
  const endY = endCell.top + endCell.height / 2;

  
  ctx.moveTo(startX - canvas.getBoundingClientRect().left, startY - canvas.getBoundingClientRect().top);
  ctx.lineTo(endX - canvas.getBoundingClientRect().left, endY - canvas.getBoundingClientRect().top);
  ctx.lineWidth = 5;
  ctx.strokeStyle = "yellow";
  ctx.stroke();

  canvas.style.display = "block";
}


function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
  }

  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
}


function handleRestartGame() {
  gameActive = true;
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusDisplay.innerHTML = '';
  gameBoard.forEach(cell => {
    cell.innerHTML = "";
    cell.classList.remove('x', 'o');
  });
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.style.display = "none";
}


gameBoard.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);
