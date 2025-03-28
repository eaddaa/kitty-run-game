const drawCat = (ctx, x, y) => {
  // Cat body (as a rounded rectangle)
  ctx.fillStyle = '#FFA500'; // Orange color for the cat
  ctx.beginPath();
  ctx.ellipse(x + 25, y + 25, 25, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cat ears (triangle shapes)
  ctx.fillStyle = '#FFA500';
  ctx.beginPath();
  ctx.moveTo(x + 5, y + 5); // Left ear
  ctx.lineTo(x - 10, y - 10);
  ctx.lineTo(x + 15, y - 15);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(x + 45, y + 5); // Right ear
  ctx.lineTo(x + 60, y - 10);
  ctx.lineTo(x + 35, y - 15);
  ctx.closePath();
  ctx.fill();

  // Cat eyes (small circles)
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(x + 15, y + 20, 5, 0, Math.PI * 2); // Left eye
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + 35, y + 20, 5, 0, Math.PI * 2); // Right eye
  ctx.fill();

  // Cat pupils (smaller black circles)
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(x + 15, y + 20, 2, 0, Math.PI * 2); // Left pupil
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + 35, y + 20, 2, 0, Math.PI * 2); // Right pupil
  ctx.fill();

  // Cat nose (small triangle)
  ctx.fillStyle = 'pink';
  ctx.beginPath();
  ctx.moveTo(x + 25, y + 30);
  ctx.lineTo(x + 20, y + 35);
  ctx.lineTo(x + 30, y + 35);
  ctx.closePath();
  ctx.fill();

  // Cat mouth (small curved line)
  ctx.beginPath();
  ctx.moveTo(x + 25, y + 35);
  ctx.quadraticCurveTo(x + 20, y + 40, x + 25, y + 40); // Left curve
  ctx.moveTo(x + 25, y + 35);
  ctx.quadraticCurveTo(x + 30, y + 40, x + 25, y + 40); // Right curve
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.stroke();
};

const gameLoop = (time) => {
  const canvas = canvasRef.current;
  if (!canvas) return;
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

  // Draw cat (as a cute kitty)
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
    if (50 < obs.x + obs.width && 50 + 50 > obs.x && catYRef.current < obs.y + obs.height && catYRef.current + 50 > obs.y) {
      setGameOver(true);
      cancelAnimationFrame(requestRef.current);
    }
  });

  // Increase score over time
  if (!gameOver) {
    setScore(prev => prev + deltaTime * 0.01);
  }

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

  // Draw score
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${Math.floor(score)}`, 10, 30);

  if (!gameOver) {
    requestRef.current = requestAnimationFrame(gameLoop);
  } else {
    // Game over message
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
  }
};

