// game.js
document.addEventListener('DOMContentLoaded', function() {
    // Game variables
    let score = 0;
    let timeLeft = 60;
    let bugsDestroyed = 0;
    let level = 1;
    let gameInterval;
    let spawnInterval;
    let gameActive = false;
    let gamePaused = false;
    
    // DOM elements
    const gameBoard = document.getElementById('gameBoard');
    const scoreElement = document.getElementById('score');
    const timeElement = document.getElementById('time');
    const bugsElement = document.getElementById('bugs');
    const levelElement = document.getElementById('level');
    const gameMessage = document.getElementById('gameMessage');
    const messageTitle = document.getElementById('messageTitle');
    const messageText = document.getElementById('messageText');
    const finalScoreElement = document.getElementById('finalScore');
    
    // Buttons
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const restartBtn = document.getElementById('restartBtn');
    const instructionsBtn = document.getElementById('instructionsBtn');
    const instructionsPanel = document.getElementById('instructionsPanel');
    
    // Game objects arrays
    let bugs = [];
    let codes = [];
    
    // Initialize game
    function initGame() {
        // Clear the board
        clearGameBoard();
        
        // Reset variables
        score = 0;
        timeLeft = 60;
        bugsDestroyed = 0;
        level = 1;
        gameActive = false;
        gamePaused = false;
        
        // Update UI
        updateUI();
        
        // Hide game message
        gameMessage.classList.remove('active');
        
        // Reset button text
        startBtn.innerHTML = '<i class="fas fa-play"></i> Start Game';
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Game';
        pauseBtn.disabled = false;
    }
    
    // Start the game
    function startGame() {
        if (!gameActive) {
            gameActive = true;
            gamePaused = false;
            
            // Start game timer
            gameInterval = setInterval(updateGame, 1000);
            
            // Start spawning objects
            spawnObjects();
            
            // Update button
            startBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Restart Game';
            
            // Hide instructions
            instructionsPanel.style.display = 'none';
        } else {
            // If game is active, restart it
            restartGame();
        }
    }
    
    // Pause/Resume the game
    function togglePause() {
        if (!gameActive) return;
        
        gamePaused = !gamePaused;
        
        if (gamePaused) {
            clearInterval(spawnInterval);
            pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume Game';
        } else {
            spawnObjects();
            pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Game';
        }
    }
    
    // Restart the game
    function restartGame() {
        clearGame();
        initGame();
        startGame();
    }
    
    // Clear the game board
    function clearGameBoard() {
        // Remove all game objects
        const objects = document.querySelectorAll('.game-object');
        objects.forEach(obj => obj.remove());
        
        // Clear arrays
        bugs = [];
        codes = [];
    }
    
    // Clear game intervals
    function clearGame() {
        clearInterval(gameInterval);
        clearInterval(spawnInterval);
    }
    
    // Update game state
    function updateGame() {
        if (!gameActive || gamePaused) return;
        
        // Decrease time
        timeLeft--;
        timeElement.textContent = timeLeft;
        
        // Check if time is up
        if (timeLeft <= 0) {
            endGame(false);
            return;
        }
        
        // Increase level every 15 seconds
        const newLevel = Math.floor((60 - timeLeft) / 15) + 1;
        if (newLevel > level) {
            level = newLevel;
            levelElement.textContent = level;
        }
        
        // Randomly remove some bugs (simulate them escaping)
        if (bugs.length > 0 && Math.random() < 0.1) {
            const index = Math.floor(Math.random() * bugs.length);
            removeBug(bugs[index], false);
        }
    }
    
    // Spawn game objects
    function spawnObjects() {
        spawnInterval = setInterval(() => {
            if (!gameActive || gamePaused) return;
            
            // Calculate spawn rate based on level
            const baseSpawnRate = Math.max(300, 800 - (level * 70));
            
            // Spawn bug
            if (Math.random() < 0.7) {
                spawnBug();
            }
            
            // Spawn code (less frequent)
            if (Math.random() < 0.3) {
                spawnCode();
            }
        }, Math.max(300, 800 - (level * 70)));
    }
    
    // Spawn a bug
    function spawnBug() {
        const bug = document.createElement('div');
        bug.className = 'game-object bug';
        bug.innerHTML = '<i class="fas fa-bug"></i>';
        
        // Random position within game board boundaries
        const size = 40 + Math.random() * 30;
        const maxX = gameBoard.offsetWidth - size - 40;
        const maxY = gameBoard.offsetHeight - size - 40;
        
        const x = Math.random() * maxX + 20;
        const y = Math.random() * maxY + 20;
        
        bug.style.width = `${size}px`;
        bug.style.height = `${size}px`;
        bug.style.left = `${x}px`;
        bug.style.top = `${y}px`;
        
        // Add click event
        bug.addEventListener('click', () => destroyBug(bug));
        
        // Add to board and array
        gameBoard.appendChild(bug);
        bugs.push(bug);
        
        // Animate appearance
        bug.style.transform = 'scale(0)';
        bug.style.opacity = '0';
        setTimeout(() => {
            bug.style.transition = 'transform 0.3s, opacity 0.3s';
            bug.style.transform = 'scale(1)';
            bug.style.opacity = '1';
        }, 10);
        
        // Auto-remove after some time
        setTimeout(() => {
            if (bug.parentNode) {
                removeBug(bug, false);
            }
        }, 5000);
    }
    
    // Spawn a code snippet
    function spawnCode() {
        const code = document.createElement('div');
        code.className = 'game-object code';
        code.innerHTML = '<i class="fas fa-code"></i>';
        
        // Random position within game board boundaries
        const size = 40 + Math.random() * 30;
        const maxX = gameBoard.offsetWidth - size - 40;
        const maxY = gameBoard.offsetHeight - size - 40;
        
        const x = Math.random() * maxX + 20;
        const y = Math.random() * maxY + 20;
        
        code.style.width = `${size}px`;
        code.style.height = `${size}px`;
        code.style.left = `${x}px`;
        code.style.top = `${y}px`;
        
        // Add click event
        code.addEventListener('click', () => destroyCode(code));
        
        // Add to board and array
        gameBoard.appendChild(code);
        codes.push(code);
        
        // Animate appearance
        code.style.transform = 'scale(0)';
        code.style.opacity = '0';
        setTimeout(() => {
            code.style.transition = 'transform 0.3s, opacity 0.3s';
            code.style.transform = 'scale(1)';
            code.style.opacity = '1';
        }, 10);
        
        // Auto-remove after some time
        setTimeout(() => {
            if (code.parentNode) {
                removeCode(code);
            }
        }, 6000);
    }
    
    // Destroy a bug (player clicked on it)
    function destroyBug(bug) {
        if (!gameActive || gamePaused) return;
        
        // Update score
        score += 10;
        bugsDestroyed++;
        
        // Remove bug
        removeBug(bug, true);
        
        // Update UI
        updateUI();
        
        // Play effect
        playClickEffect(bug, true);
    }
    
    // Destroy a code snippet (player clicked on it - mistake!)
    function destroyCode(code) {
        if (!gameActive || gamePaused) return;
        
        // Update score (penalty)
        score = Math.max(0, score - 20);
        
        // Remove code
        removeCode(code);
        
        // Update UI
        updateUI();
        
        // Play effect
        playClickEffect(code, false);
    }
    
    // Remove a bug from the game
    function removeBug(bug, destroyedByPlayer) {
        // Remove from array
        const index = bugs.indexOf(bug);
        if (index > -1) {
            bugs.splice(index, 1);
        }
        
        // Animate removal
        bug.style.transition = 'transform 0.3s, opacity 0.3s';
        bug.style.transform = 'scale(0)';
        bug.style.opacity = '0';
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (bug.parentNode) {
                bug.parentNode.removeChild(bug);
            }
        }, 300);
    }
    
    // Remove a code snippet from the game
    function removeCode(code) {
        // Remove from array
        const index = codes.indexOf(code);
        if (index > -1) {
            codes.splice(index, 1);
        }
        
        // Animate removal
        code.style.transition = 'transform 0.3s, opacity 0.3s';
        code.style.transform = 'scale(0)';
        code.style.opacity = '0';
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (code.parentNode) {
                code.parentNode.removeChild(code);
            }
        }, 300);
    }
    
    // Play click effect
    function playClickEffect(element, isBug) {
        // Create effect element
        const effect = document.createElement('div');
        effect.style.position = 'absolute';
        effect.style.left = element.style.left;
        effect.style.top = element.style.top;
        effect.style.width = element.style.width;
        effect.style.height = element.style.height;
        effect.style.borderRadius = '50%';
        effect.style.backgroundColor = isBug ? 'rgba(255, 65, 108, 0.7)' : 'rgba(33, 147, 176, 0.7)';
        effect.style.zIndex = '5';
        effect.style.pointerEvents = 'none';
        
        gameBoard.appendChild(effect);
        
        // Animate effect
        const animation = effect.animate([
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'scale(2)', opacity: 0 }
        ], {
            duration: 500,
            easing: 'ease-out'
        });
        
        // Remove effect after animation
        animation.onfinish = () => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        };
        
        // Create score text
        const scoreText = document.createElement('div');
        scoreText.textContent = isBug ? '+10' : '-20';
        scoreText.style.position = 'absolute';
        scoreText.style.left = element.style.left;
        scoreText.style.top = element.style.top;
        scoreText.style.color = isBug ? '#FF416C' : '#2193b0';
        scoreText.style.fontWeight = 'bold';
        scoreText.style.fontSize = '1.2rem';
        scoreText.style.zIndex = '5';
        scoreText.style.pointerEvents = 'none';
        scoreText.style.textAlign = 'center';
        scoreText.style.width = element.style.width;
        scoreText.style.height = element.style.height;
        scoreText.style.display = 'flex';
        scoreText.style.alignItems = 'center';
        scoreText.style.justifyContent = 'center';
        
        gameBoard.appendChild(scoreText);
        
        // Animate score text
        const textAnimation = scoreText.animate([
            { transform: 'translateY(0)', opacity: 1 },
            { transform: 'translateY(-30px)', opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        });
        
        // Remove score text after animation
        textAnimation.onfinish = () => {
            if (scoreText.parentNode) {
                scoreText.parentNode.removeChild(scoreText);
            }
        };
    }
    
    // Update UI elements
    function updateUI() {
        scoreElement.textContent = score;
        bugsElement.textContent = bugsDestroyed;
        timeElement.textContent = timeLeft;
        levelElement.textContent = level;
    }
    
    // End the game
    function endGame(isWin) {
        gameActive = false;
        clearGame();
        
        // Show game over message
        messageTitle.textContent = isWin ? 'You Win!' : 'Game Over';
        messageText.textContent = isWin 
            ? `Congratulations! You survived all levels with a score of ${score}.` 
            : `Your final score: ${score}`;
        
        finalScoreElement.textContent = score;
        gameMessage.classList.add('active');
        
        // Disable pause button
        pauseBtn.disabled = true;
    }
    
    // Toggle instructions panel
    function toggleInstructions() {
        if (instructionsPanel.style.display === 'none' || !instructionsPanel.style.display) {
            instructionsPanel.style.display = 'block';
        } else {
            instructionsPanel.style.display = 'none';
        }
    }
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', togglePause);
    restartBtn.addEventListener('click', restartGame);
    instructionsBtn.addEventListener('click', toggleInstructions);
    
    // Set current year in footer
    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
    
    // Initialize the game
    initGame();
    instructionsPanel.style.display = 'block';
    
    // Add keyboard controls
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            if (gameActive) {
                togglePause();
            } else {
                startGame();
            }
        }
        
        if (e.key === 'r' || e.key === 'R') {
            restartGame();
        }
        
        if (e.key === 'Escape') {
            if (gameMessage.classList.contains('active')) {
                gameMessage.classList.remove('active');
            }
            if (instructionsPanel.style.display === 'block') {
                instructionsPanel.style.display = 'none';
            }
        }
        
        if (e.key === 'i' || e.key === 'I') {
            toggleInstructions();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (gameActive) {
            // Reposition existing game objects
            bugs.forEach(bug => {
                const size = parseInt(bug.style.width);
                const maxX = gameBoard.offsetWidth - size - 40;
                const maxY = gameBoard.offsetHeight - size - 40;
                
                let x = parseInt(bug.style.left);
                let y = parseInt(bug.style.top);
                
                // Keep objects within bounds
                x = Math.min(Math.max(20, x), maxX);
                y = Math.min(Math.max(20, y), maxY);
                
                bug.style.left = `${x}px`;
                bug.style.top = `${y}px`;
            });
            
            codes.forEach(code => {
                const size = parseInt(code.style.width);
                const maxX = gameBoard.offsetWidth - size - 40;
                const maxY = gameBoard.offsetHeight - size - 40;
                
                let x = parseInt(code.style.left);
                let y = parseInt(code.style.top);
                
                // Keep objects within bounds
                x = Math.min(Math.max(20, x), maxX);
                y = Math.min(Math.max(20, y), maxY);
                
                code.style.left = `${x}px`;
                code.style.top = `${y}px`;
            });
        }
    });
    
    // Add touch support for mobile
    gameBoard.addEventListener('touchstart', (e) => {
        if (e.target.classList.contains('game-object')) {
            e.preventDefault(); // Prevent scrolling
        }
    }, { passive: false });
});