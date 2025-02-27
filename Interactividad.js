document.addEventListener('DOMContentLoaded', function() {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const reset = document.getElementById('reset');
    const vsHuman = document.getElementById('vs-human');
    const vsMachine = document.getElementById('vs-machine');
    const winnerMessage = document.getElementById('winner-message');
    
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let vsAI = false;
    
    // Combinaciones ganadoras (filas, columnas y diagonales)
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
        [0, 4, 8], [2, 4, 6]            // diagonales
    ];
    
    // Resaltar celdas ganadoras sin usar la línea roja
    function highlightWinningCells(combination) {
        combination.forEach(index => {
            cells[index].classList.add('winner');
        });
        
        // Mostrar mensaje de TRIQUI
        winnerMessage.style.display = 'block';
    }
    
    // Cambio de modo de juego
    vsHuman.addEventListener('click', function() {
        vsAI = false;
        vsHuman.classList.add('active');
        vsMachine.classList.remove('active');
        resetGame();
    });
    
    vsMachine.addEventListener('click', function() {
        vsAI = true;
        vsMachine.classList.add('active');
        vsHuman.classList.remove('active');
        resetGame();
        if (currentPlayer === 'O') {
            makeAIMove();
        }
    });
    
    // Función para manejar el clic en una celda
    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        // Verificar si la celda ya está ocupada o el juego está inactivo
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        // Actualizar el estado del juego y la UI
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        
        // Verificar si hay un ganador
        checkResult();
        
        // Si está en modo AI y el juego sigue activo, hacer el movimiento de la IA
        if (vsAI && gameActive && currentPlayer === 'O') {
            setTimeout(makeAIMove, 500);
        }
    }
    
    // Movimiento de la IA
    function makeAIMove() {
        // Implementación simple: la IA busca la primera celda vacía
        // Para una IA más inteligente, se podría implementar el algoritmo minimax
        const emptyCells = gameState.reduce((acc, cell, index) => {
            if (cell === '') acc.push(index);
            return acc;
        }, []);
        
        if (emptyCells.length > 0) {
            // Elige aleatoriamente entre las celdas vacías
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            const aiMove = emptyCells[randomIndex];
            
            gameState[aiMove] = currentPlayer;
            cells[aiMove].textContent = currentPlayer;
            
            checkResult();
        }
    }
    
    // Verificar el resultado del juego
    function checkResult() {
        let roundWon = false;
        let winningCombination = null;
        
        // Verificar todas las condiciones de victoria
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
        
        // Si hay un ganador
        if (roundWon) {
            status.textContent = `¡Jugador ${currentPlayer} ha ganado!`;
            gameActive = false;
            highlightWinningCells(winningCombination);
            return;
        }
        
        // Verificar si hay empate
        const roundDraw = !gameState.includes('');
        if (roundDraw) {
            status.textContent = '¡Empate!';
            gameActive = false;
            return;
        }
        
        // Cambiar de jugador
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Turno de ${currentPlayer}`;
    }
    
    // Reiniciar el juego
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
        
        // Si está en modo IA y le toca a la IA, hacer su movimiento
        if (vsAI && currentPlayer === 'O') {
            setTimeout(makeAIMove, 500);
        }
    }
    
    // Agregar event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    reset.addEventListener('click', resetGame);
});