// DOM elements
const gameBoard = document.getElementById('gameBoard');
const gameStatus = document.getElementById('gameStatus');
const resetButton = document.getElementById('resetButton');
const messageBox = document.getElementById('messageBox');
const messageTitle = document.getElementById('messageTitle');
const messageText = document.getElementById('messageText');
const closeMessageButton = document.getElementById('closeMessageButton');

// Game variables
let board = ['', '', '', '', '', '', '', '', '']; // Represents the 3x3 board
let currentPlayer = 'X'; // 'X' starts the game
let gameActive = true; // True if the game is ongoing

// Winning conditions (indices of cells that form a win)
const winningConditions = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left
    [2, 4, 6]  // Diagonal from top-right
];

/**
 * Initializes the game board by creating 9 cell elements.
 * Attaches click event listeners to each cell.
 */
function initializeGame() {
    gameBoard.innerHTML = ''; // Clear any existing cells
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index; // Store index for easy access
        cellElement.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cellElement);
    });
    updateGameStatus();
}

/**
 * Updates the text display for the current game status.
 * Shows whose turn it is.
 */
function updateGameStatus() {
    gameStatus.textContent = `It's ${currentPlayer}'s turn`;
}

/**
 * Handles a click event on a game cell.
 * @param {Event} event - The click event object.
 */
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.dataset.index);

    // If the cell is already occupied or the game is not active, do nothing
    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // Place the current player's mark on the board and in the cell
    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer); // Add class for styling (X or O)
    clickedCell.classList.add('occupied'); // Mark as occupied

    checkGameResult(); // Check if there's a winner or a draw
}

/**
 * Checks the game board for a win or a draw condition.
 * If a win or draw is detected, updates game status and shows message box.
 */
function checkGameResult() {
    let roundWon = false;

    // Check all winning conditions
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];

        // If any cell in the condition is empty, continue to next condition
        if (a === '' || b === '' || c === '') {
            continue;
        }
        // If all cells in the condition match, a player has won
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameActive = false; // End the game
        showMessageBox(`Player ${currentPlayer} Wins!`, 'Congratulations!');
        return;
    }

    // Check for a draw (if no winner and all cells are filled)
    let roundDraw = !board.includes(''); // True if no empty cells
    if (roundDraw) {
        gameActive = false; // End the game
        showMessageBox('Game Draw!', 'It\'s a tie!');
        return;
    }

    // If no win or draw, switch to the next player
    switchPlayer();
}

/**
 * Switches the current player from 'X' to 'O' or 'O' to 'X'.
 * Updates the game status display.
 */
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateGameStatus();
}

/**
 * Resets the game to its initial state.
 * Clears the board, resets current player, and reactivates the game.
 */
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    initializeGame(); // Re-render the board
    hideMessageBox(); // Hide any active message box
}

/**
 * Displays a custom message box with a title and message.
 * @param {string} title - The title for the message box.
 * @param {string} message - The main message content.
 */
function showMessageBox(title, message) {
    messageTitle.textContent = title;
    messageText.textContent = message;
    messageBox.classList.add('show');
}

/**
 * Hides the custom message box.
 */
function hideMessageBox() {
    messageBox.classList.remove('show');
}

// Event Listeners
resetButton.addEventListener('click', resetGame);
closeMessageButton.addEventListener('click', resetGame); // Close message box and reset game

// Initialize the game when the page loads
window.onload = initializeGame;
