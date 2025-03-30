const cells = document.querySelectorAll('.cell'); const restartButton = document.getElementById('restart'); const message = document.getElementById('message');

let gameState = ['', '', '', '', '', '', '', '', '']; let currentPlayer = 'X';

let difficulty = 'hard'; // Default: difícil const easyButton = document.getElementById('easy'); const mediumButton = document.getElementById('medium'); const advancedMediumButton = document.getElementById('advanced-medium'); const hardButton = document.getElementById('hard');

easyButton.addEventListener('click', () => difficulty = 'easy'); mediumButton.addEventListener('click', () => difficulty = 'medium'); advancedMediumButton.addEventListener('click', () => difficulty = 'advanced-medium'); hardButton.addEventListener('click', () => difficulty = 'hard');

cells.forEach((cell, index) => { cell.addEventListener('click', () => { if (gameState[index] === '' && currentPlayer === 'X') { gameState[index] = 'X'; cell.textContent = 'X'; checkResult(); if (!gameState.includes('') || checkWinner('X')) return; currentPlayer = 'O'; makeAIMove(); currentPlayer = 'X'; } }); });

restartButton.addEventListener('click', restartGame);

function restartGame() { gameState = ['', '', '', '', '', '', '', '', '']; cells.forEach(cell => cell.textContent = ''); currentPlayer = 'X'; message.textContent = ''; }

function checkWinner(player) { const winningCombinations = [ [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ];

return winningCombinations.some(combination =>
    combination.every(index => gameState[index] === player)
);

}

function checkResult() { if (checkWinner('X')) { message.textContent = '¡Ganaste!'; } else if (checkWinner('O')) { message.textContent = 'Perdiste.'; } else if (!gameState.includes('')) { message.textContent = 'Es un empate.'; } }

function makeAIMove() { const emptyCells = gameState.reduce((acc, cell, index) => { if (cell === '') acc.push(index); return acc; }, []);

if (difficulty === 'easy') {
    const randomMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameState[randomMove] = currentPlayer;
    cells[randomMove].textContent = currentPlayer;

} else if (difficulty === 'medium') {
    let bestMove = null;
    let bestScore = -Infinity;

    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === '') {
            gameState[i] = 'O';
            const score = minimax(gameState, 0, false, 3);
            gameState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    if (bestMove !== null) {
        gameState[bestMove] = currentPlayer;
        cells[bestMove].textContent = currentPlayer;
    }

} else if (difficulty === 'advanced-medium') {
    let bestMove = null;
    let bestScore = -Infinity;

    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === '') {
            gameState[i] = 'O';
            const score = minimax(gameState, 0, false, 5);
            gameState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    if (bestMove !== null) {
        if (Math.random() < 0.2) {
            const randomMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            gameState[randomMove] = currentPlayer;
            cells[randomMove].textContent = currentPlayer;
        } else {
            gameState[bestMove] = currentPlayer;
            cells[bestMove].textContent = currentPlayer;
        }
    }

} else if (difficulty === 'hard') {
    let bestMove = null;
    let bestScore = -Infinity;

    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === '') {
            gameState[i] = 'O';
            const score = minimax(gameState, 0, false);
            gameState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    if (bestMove !== null) {
        gameState[bestMove] = currentPlayer;
        cells[bestMove].textContent = currentPlayer;
    }
}

checkResult();

}

function minimax(state, depth, isMaximizing, maxDepth = Infinity) { if (checkWinner('O')) return 10 - depth; if (checkWinner('X')) return depth - 10; if (!state.includes('')) return 0; if (depth >= maxDepth) return 0;

if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < state.length; i++) {
        if (state[i] === '') {
            state[i] = 'O';
            const score = minimax(state, depth + 1, false, maxDepth);
            state[i] = '';
            bestScore = Math.max(score, bestScore);
        }
    }
    return bestScore;

} else {
    let bestScore = Infinity;

    for (let i = 0; i < state.length; i++) {
        if (state[i] === '') {
            state[i] = 'X';
            const score = minimax(state, depth + 1, true, maxDepth);
            state[i] = '';
            bestScore = Math.min(score, bestScore);
        }
    }
    return bestScore;
}

}

