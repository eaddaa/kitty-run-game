import React, { useState, useEffect, useRef } from 'react';

const Game = () => {
  const canvasRef = useRef(null);
  const lastTimeRef = useRef(0);
  const velocityYRef = useRef(0);
  const catYRef = useRef(200);
  const obstaclesRef = useRef([]);
  const requestRef = useRef();
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const gravity = 0.5;
  const groundY = 350;

  const jump = () => {
    if (catYRef.current === groundY && !gameOver) {
      velocityYRef.current = -15; // Jump velocity
    }
  };

  const drawCat = (ctx, x, y) => {
    // Draw the cat emoji 🐱
    ctx.font = '40px Arial';
    ctx.fillText('🐱', x, y); // Use the cat emoji as the character
  };

  const gameLoop = (time) => {
    const canvas = canvasRef.current;
    if (!canvas || gameOver) return; // Stop if game is over
    const ctx = canvas.getContext('2d');

    // Delta time calculation
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update cat position
    velocityYRef.current += gravity;
    catYRef.current += velocityYRef.current;
    if (catYRef.current > groundY) {
      catYRef.current = groundY;
      velocityYRef.current = 0;
    }

    // Draw ground
    ctx.fillStyle = '#654321';
    ctx.fillRect(0, groundY + 50, canvas.width, 50);

    // Draw cat (as a cute kitty emoji)
    drawCat(ctx, 50, catYRef.current);

    // Update obstacles: move them leftwards
    obstaclesRef.current.forEach((obs) => {
      obs.x -= obs.speed;
    });

    // Remove off-screen obstacles
    obstaclesRef.current = obstaclesRef.current.filter(obs => obs.x + obs.width > 0);

    // Draw obstacles and check collision
    ctx.fillStyle = 'red';
    obstaclesRef.current.forEach((obs) => {
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      // Simple collision detection
      if (50 < obs.x + obs.width && 50 + 40 > obs.x && catYRef.current < obs.y + obs.height && catYRef.current + 40 > obs.y) {
        setGameOver(true); // End the game if collision occurs
        cancelAnimationFrame(requestRef.current);
      }
    });

    // Generate new obstacles randomly
    if (!gameOver && Math.random() < 0.02) { // Adjust probability as needed
      obstaclesRef.current.push({
        x: canvas.width,
        y: groundY + 50 - Math.random() * 50, // Random height variation
        width: 30 + Math.random() * 20, // Random width between 30 and 50
        height: 30 + Math.random() * 50, // Random height
        speed: 3 + Math.random() * 2, // Random speed between 3 and 5
      });
    }

    // Increase score
    if (!gameOver) {
      setScore((prevScore) => prevScore + 1); // Increment score
      requestRef.current = requestAnimationFrame(gameLoop);
    } else {
      // Game over message
      ctx.fillStyle = 'black';
      ctx.font = '40px Arial';
      ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    }
  };

  // Start the game loop
  useEffect(() => {
    if (!gameOver) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameOver]);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    obstaclesRef.current = [];
    velocityYRef.current = 0;
    catYRef.current = 200;
  };

  // Add keyboard event listener for Space key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' && !gameOver) { // Space key
        jump();
      }
    };

    // Event listener for Space key
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver]);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid black' }}></canvas>
      <div>
        {!gameOver && <button onClick={jump}>Press Button to Jump</button>}
      </div>
      <div style={{ marginTop: '20px' }}>
        {gameOver ? (
          <div>
            <h3>Game Over!</h3>
            <button onClick={startGame}>Restart Game</button>
          </div>
        ) : (
          <>
            <h3>Press Space to jump! 🐱</h3>
            <h3>Score: {score}</h3> {/* Show current score */}
          </>
        )}
      </div>
    </div>
  );
};

export default Game;
