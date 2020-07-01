const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
var color = "#0095dd";
var gamePaused = false;

let score = 0;
let niveau = 1

const brickRowCount = 9;
const brickColumnCount = 5;


// Creation proprietés de la balle

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4,
    dy: -4
};

// Creation proprietes du paddle

let paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0,

};

// Creation brick proprietes

const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
}

// Creation bricks

const bricks = [];
for(let i = 0; i < brickRowCount; i++){
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++){
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = {x, y, ...brickInfo}

    }
}

// Creation balle dans le canvas

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
};





// Creation paddle dans le canvas

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h)
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
};

// Creation bricks dans le canvas

function drawBricks(){
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? color : 'transparent';
            ctx.fill();
            ctx.closePath();
        })
    })
}

// Cree le scoreboard dans le canvas

function drawScore(){
    ctx.font = "20px Arial";
    ctx.fillText('Score : ' + score , canvas.width - 100, 30);
};
// Cree les niveaux dans le canvas

function drawLevel(){
    ctx.font = "20px Arial";
    ctx.fillText('Niveau : ' + niveau , canvas.width - 790, 30);
};


// Bouger le paddle dans le canvas

function movePaddle(){
    paddle.x += paddle.dx;

    // detection des mur
    if(paddle.x + paddle.w > canvas.width){
        paddle.x = canvas.width - paddle.w;
    }
    if(paddle.x < 0){
        paddle.x = 0;
    }
}

// Bouger la balle dans le canvas

function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Mur detection (gauche/droite)
    if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0){
        ball.dx *= -1; //ball.dx = ball.dx * -1
    }
    //Mur detection (haut/bas)
    if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0){
        ball.dy *= -1;
    }
    // Paddle detection
    if(
        ball.x - ball.size > paddle.x && 
        ball.x + ball.size < paddle.x + paddle.w && 
        ball.y + ball.size > paddle.y
    ){
        ball.dy = -ball.speed;

    }
    // Bricks collision
    bricks.forEach(column =>{
        column.forEach(brick => {
            if(brick.visible){
                if(
                    ball.x - ball.size > brick.x && //brick coté gauche 
                    ball.x + ball.size < brick.x + brick.w && //brick coté droit
                    ball.y + ball.size > brick.y && //brick coté haut
                    ball.y - ball.size < brick.y + brick.h //brick coté bas
                ){
                    ball.dy *= -1;
                    brick.visible = false;


                    increaseScore();
                }
            }
        });
    });

    // touche le sol = perdu

    if(ball.y + ball.size > canvas.height){
        showAllBricks();
        score = 0;
        niveau = 1;
        paddle.w = 80;
        ball.speed = 4;
    }
}

// Augmenter le score

function increaseScore(){
    score++;
    if(score % (brickRowCount * brickRowCount) === 0){
        showAllBricks();
    }
    if(45 === score){
        showAllBricks();
    }
    if(45 <= score){
        paddle.w = 60;
        niveau = 2;
    }
    if(90 === score){
        showAllBricks();
    }
    if(90 <= score){
        ball.speed = 8
        niveau = 3
    }
    if(135 === score){
        showAllBricks();
    }
    if(135 <= score){
        niveau = 4
        color = "#ff0000"
    }
}
// Faire apparaitre toutes les bricks

function showAllBricks(){
    bricks.forEach(column =>{
        column.forEach(brick => (brick.visible = true));
    })
}

// Cree tout

function draw(){
    // clear canvas
    ctx.clearRect(0,0, canvas.width, canvas.height)

    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
    drawLevel();
};

function update(){
    movePaddle();
    moveBall();

    // crée tout
    draw();

    requestAnimationFrame(update);
}


update();

// Evenement du clavier

function keyDown(e){
    if(e.key === "Right" || e.key === "ArrowRight"){
        paddle.dx = paddle.speed;
    }
    else if(e.key === "Left" || e.key === "ArrowLeft"){
        paddle.dx = -paddle.speed;
    }
}

function keyUp(e){
    if(
        e.key === "Right" ||
        e.key === "ArrowRight" || 
        e.key === "Left" || 
        e.key === "ArrowLeft"
    ){
        paddle.dx = 0;
    }
    
}

// Ajout d'une option pause




// Evenement du clavier avec les main


document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);


// Ouvrir et fermé l'explication jeux

rulesBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));






