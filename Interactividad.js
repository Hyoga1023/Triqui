document.addEventListener('DOMContentLoaded', function () { const board = document.getElementById('board'); const cells = document.querySelectorAll('.cell'); const status = document.getElementById('status'); const reset = document.getElementById('reset'); const vsHuman = document.getElementById('vs-human'); const vsMachine = document.getElementById('vs-machine'); const winnerMessage = document.getElementById('winner-message');

let gameState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let vsAI = false;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
    [0, 4, 8], [2, 4, 6]            // diagonales
];

function highlightWinningCells(combination) {
    combination.forEach(index => {
        cells[index].classList.add('winner');
    });
    winnerMessage.style.display = 'block';
}

vsHuman.addEventListener('click', function () {
    vsAI = false;
    vsHuman.classList.add('active');
    vsMachine.classList.remove('active');
    resetGame();
});

vsMachine.addEventListener('click', function () {
    vsAI = true;
    vsMachine.classList.add('active');
    vsHuman.classList.remove('active');
    resetGame();
    if (currentPlayer === 'O') {
        makeAIMove();
    }
});

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    checkResult();

    if (vsAI && gameActive && currentPlayer === 'O') {
        setTimeout(makeAIMove, 500);
    }
}

function makeAIMove() {
    const emptyCells = gameState.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);

    if (emptyCells.length > 0) {
        let aiMove;

        let bestScore = -Infinity;
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === '') {
                gameState[i] = 'O';
                let score = minimax(gameState, 0, false, 4); // Profundidad 4 para dificultad intermedia-avanzada
                gameState[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    aiMove = i;
                }
            }
        }

        if (aiMove !== undefined) {
            gameState[aiMove] = currentPlayer;
            cells[aiMove].textContent = currentPlayer;
            checkResult();
        }
    }
}

function minimax(state, depth, isMaximizing, maxDepth) {
    const winner = checkWinner();

    if (winner === 'X') return -10 + depth;
    if (winner === 'O') return 10 - depth;
    if (!state.includes('') || depth >= maxDepth) return 0;

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < state.length; i++) {
            if (state[i] === '') {
                state[i] = 'O';
                let eval = minimax(state, depth + 1, false, maxDepth);
                state[i] = '';
                maxEval = Math.max(maxEval, eval);
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < state.length; i++) {
            if (state[i] === '') {
                state[i] = 'X';
                let eval = minimax(state, depth + 1, true, maxDepth);
                state[i] = '';
                minEval = Math.min(minEval, eval);
            }
        }
        return minEval;
    }
}

function checkWinner() {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] !== '' && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return gameState[a];
        }
    }
    return null;
}

function checkResult() {
    let roundWon = false;
    let winningCombination = null;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];

        if (gameState[a] !== '' &&
            gameState[a] === gameState[b] &&
            gameState[a] === gameState[c]) {
            roundWon = true;
            winningCombination = winningConditions[i];
            break;
        }
    }

    if (roundWon) {
        status.textContent = `¡Jugador ${currentPlayer} ha ganado!`;
        gameActive = false;
        highlightWinningCells(winningCombination);
        return;
    }

    const roundDraw = !gameState.includes('');
    if (roundDraw) {
        status.textContent = '¡Empate!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `Turno de ${currentPlayer}`;
}

function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    status.textContent = `Turno de ${currentPlayer}`;
    winnerMessage.style.display = 'none';

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner');
    });

    if (vsAI && currentPlayer === 'O') {
        setTimeout(makeAIMove, 500);
    }
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

reset.addEventListener('click', resetGame);

});

