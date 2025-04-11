window.onload = function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Paddle properties
    const paddle = {
        width: 150,
        height: 20,
        x: canvas.width / 2 - 75,
        y: canvas.height - 30,
        color: '#ff4757'
    };

    // Ball properties
    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 15,
        color: '#2ed573',
        dx: 4,
        dy: -4
    };

    let gazeX = canvas.width / 2;

    // Initialize WebGazer
    webgazer.setGazeListener(function(data, elapsedTime) {
        if (data == null) {
            return;
        }
        gazeX = data.x;
    }).begin();

    // Draw paddle
    function drawPaddle() {
        ctx.fillStyle = paddle.color;
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    // Draw ball
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
    }

    // Update game elements
    function update() {
        // Move paddle based on gaze
        paddle.x = gazeX - paddle.width / 2;

        // Ensure paddle stays within canvas bounds
        if (paddle.x < 0) {
            paddle.x = 0;
        } else if (paddle.x + paddle.width > canvas.width) {
            paddle.x = canvas.width - paddle.width;
        }

        // Move ball
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Ball collision with walls
        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.dx *= -1;
        }
        if (ball.y - ball.radius < 0) {
            ball.dy *= -1;
        }

        // Ball collision with paddle
        if (ball.y + ball.radius > paddle.y &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.width) {
            ball.dy *= -1;
        }

        // Ball misses paddle
        if (ball.y + ball.radius > canvas.height) {
            // Reset ball position
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.dx = 4;
            ball.dy = -4;
        }
    }

    // Game loop
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPaddle();
        drawBall();
        update();
        requestAnimationFrame(gameLoop);
    }

    // Start the game loop
    gameLoop();
};
