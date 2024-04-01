const blockWidth = 110;
const blockHeight = 40;
const grid = document.querySelector('.grid');
let score = 0;

const userStart = [230,10];
let currentPosition = userStart;

const ballStart = [(Math.floor(Math.random()*15)+10)*10,40]
let ballCurrentPosition = ballStart;
const ballDimention = 10 

const user = document.createElement('div');
user.classList.add('user');
drawUser();
grid.appendChild(user);

const ball = document.createElement('div');
ball.classList.add('ball');
drawBall();
grid.appendChild(ball);

let intervalId;
const ballDirections = ['NE','NW'];
let ballDirection = ballDirections[Math.round(Math.random())]; 

class Block{
    constructor(xAxis, yAxis){
        this.bottomLeft = [xAxis,yAxis];
        this.bottomRight = [xAxis + blockWidth, yAxis];
        this.topLeft = [xAxis, yAxis + blockHeight];
        this.topRight = [xAxis + blockWidth , yAxis + blockHeight];
    }
}

const blocks = [
    new Block(5,200),
    new Block(5,235),
    new Block(5,270),
    new Block(110,200),
    new Block(110,235),
    new Block(110,270),
    new Block(215,200),
    new Block(215,235),
    new Block(215,270),
    new Block(320,200),
    new Block(320,235),
    new Block(320,270),   
    new Block(425,200),
    new Block(425,235),
    new Block(425,270)
];

function addBlocks(){
    for(let i=0; i<blocks.length ; i++){
        const block = document.createElement('div');
        block.classList.add('block')
        block.style.left=`${blocks[i].bottomLeft[0]}px`;
        block.style.bottom=`${blocks[i].bottomLeft[1]}px`;
        block.setAttribute('data-id',`(${blocks[i].bottomLeft[0]},${blocks[i].bottomLeft[1]})`);
        block.style.backgroundColor = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`;
        grid.appendChild(block);
}
}

//add user

function drawUser()
{
    user.style.left = currentPosition[0]+'px'
    user.style.bottom = currentPosition[1]+'px';
}

function drawBall(){
    ball.style.left= ballCurrentPosition[0]+'px';
    ball.style.bottom = ballCurrentPosition[1]+'px';
}

function moveUser(event){
    switch(event.key){
        case 'a': 
            if(currentPosition[0]>0)
            {
                currentPosition[0] -= 20;
                drawUser();
            }
        break;
        case 'd':
            if(currentPosition[0]<=540-blockWidth)
            {
                currentPosition[0] += 20;
                drawUser();
            }
        break;
    }
}

function moveBall(){
    //add the game ending logic
    switch(ballDirection){
        case 'NE':
            ballCurrentPosition[0]+=5;
            ballCurrentPosition[1]+=5;
            drawBall();
            break;
        case 'NW':
            ballCurrentPosition[0]-=5;
            ballCurrentPosition[1]+=5;
            drawBall();
            break;
        case 'SW':
            ballCurrentPosition[0]-=5;
            ballCurrentPosition[1]-=5;
            drawBall();
            break;
        case 'SE':
            ballCurrentPosition[0]+=5;
            ballCurrentPosition[1]-=5;
            drawBall();
            break;
    }
    if(blocks.length==0)
    {
        postGameConfig();
        window.alert("You Won The Game 😁");
    }
    if(ballCurrentPosition[1]>170)
    {
        checkBlockCollision();
    }
    checkWallCollision();
    document.getElementById("score").textContent = score;
}


function checkWallCollision(){
    if(ballCurrentPosition[0]<=0 && ballCurrentPosition[1]+ballDimention>=300 && ballDirection ==='NW'){
        ballDirection='SE';
    }
    else if(ballCurrentPosition[0]+ballDimention>=530 && ballCurrentPosition[1]+ballDimention>=300 && ballDirection ==='NE')
    {
        ballDirection='SW';
    }
    else if(ballCurrentPosition[0]<=0 && ballCurrentPosition[1]<=0 && ballDirection ==='SW')
    {
        ballDirection='NE';
    }
    else if(ballCurrentPosition[0]+ballDimention>=530 && ballCurrentPosition[1]<=0 && ballDirection ==='SE')
    {
        ballDirection='NW';
    }
    else if(ballCurrentPosition[0]+ballDimention>=530 && ballDirection ==='NE')
    {
        ballDirection='NW';
    }
    else if(ballCurrentPosition[0]+ballDimention>=530 && ballDirection ==='SE')
    {
        ballDirection='SW';
    }
    else if(ballCurrentPosition[0]<=0 && ballDirection ==='NW')
    {
        ballDirection='NE';
    }
    else if(ballCurrentPosition[0]<0 && ballDirection ==='SW')
    {
        ballDirection='SE';
    }
    else if(ballCurrentPosition[1]<=0 && ballDirection ==='SW')
    {
        window.alert("You Lost The Game ☹️");
        postGameConfig();
    }
    else if(ballCurrentPosition[1]<=0 && ballDirection ==='SE')
    {
        window.alert("You Lost The Game ☹️");
        postGameConfig();
    }
    else if(ballCurrentPosition[0]+ballDimention>=currentPosition[0] && ballCurrentPosition[0]<=currentPosition[0]+100 && ballCurrentPosition[1]<=currentPosition[1]+20 &&   ballDirection ==='SW')
    {
        let boost = [0,5,10,15,30]
        let randomIndx = Math.floor(Math.random()*4);
        ballCurrentPosition[0]-=boost[randomIndx];
        ballDirection='NW'; 
    }
    else if(ballCurrentPosition[0]+ballDimention>=currentPosition[0] && ballCurrentPosition[0]<=currentPosition[0]+100 && ballCurrentPosition[1]<=currentPosition[1]+20 && ballDirection ==='SE')
    {
        let boost = [0,5,10,15,40]
        let randomIndx = Math.floor(Math.random()*4);
        ballCurrentPosition[0]+=boost[randomIndx];
        ballDirection='NE'; 
    }
    else if(ballCurrentPosition[1]+ballDimention>=300 && ballDirection ==='NE')
    {
        ballDirection='SE';
    }
    else if(ballCurrentPosition[1]+ballDimention>=300 && ballDirection ==='NW')
    {
        ballDirection='SW';
    }
}

//x-Axis / y-axis
function checkBlockCollision()
{
    for(let i = 0 ; i<blocks.length ; i++){
        let block = blocks[i];
        if(blockCollisionActions(block))
        {
            blocks.splice(i,1);
        };
    }
}

function blockCollisionActions(block) {
    let action = false;
    if (ballCurrentPosition[0] >= block.bottomLeft[0] && ballCurrentPosition[0] <= block.bottomRight[0] &&
        ballCurrentPosition[1] + ballDimention === block.bottomLeft[1] && ballDirection === 'NW') {
        ballDirection = 'SW';
        console.log('Bottom')
        document.querySelector(`[data-id="(${block.bottomLeft[0]},${block.bottomLeft[1]})"]`).remove(); 
        action = true;
        score++;
    }
    else if (ballCurrentPosition[0] >= block.bottomLeft[0] && ballCurrentPosition[0] <= block.bottomRight[0] &&
        ballCurrentPosition[1] + ballDimention === block.bottomLeft[1] && ballDirection === 'NE') {
        ballDirection = 'SE';

        console.log('Bottom')
        document.querySelector(`[data-id="(${block.bottomLeft[0]},${block.bottomLeft[1]})"]`).remove(); 
        action = true;
        score++;
    }
    else if (ballCurrentPosition[0]+ballDimention >= block.topLeft[0] && ballCurrentPosition[0] <= block.topRight[0] &&
        ballCurrentPosition[1] === block.topLeft[1] && ballDirection === 'SW') {
        ballDirection = 'NW';
        console.log('Top')
        document.querySelector(`[data-id="(${block.bottomLeft[0]},${block.bottomLeft[1]})"]`).remove(); 
        action = true;
        score++;
    }
    else if (ballCurrentPosition[0]+ballDimention >= block.topLeft[0] && ballCurrentPosition[0] <= block.topRight[0] &&
        ballCurrentPosition[1] === block.topLeft[1] && ballDirection === 'SE') {
        ballDirection = 'NE';
        console.log('Top')
        document.querySelector(`[data-id="(${block.bottomLeft[0]},${block.bottomLeft[1]})"]`).remove(); 
        action = true;
        score++;
    }
    else if (ballCurrentPosition[0] +ballDimention === block.bottomLeft[0] &&
        ballCurrentPosition[1]+ballDimention >= block.bottomLeft[1] && ballCurrentPosition[1] <= block.topLeft[1] && ballDirection === 'NE') {
        ballDirection = 'NW';
        console.log('Left')
        document.querySelector(`[data-id="(${block.bottomLeft[0]},${block.bottomLeft[1]})"]`).remove(); 
        action = true;
        score++; 
    }
    else if (ballCurrentPosition[0] +ballDimention === block.bottomLeft[0] &&
        ballCurrentPosition[1]+ballDimention >= block.bottomLeft[1] && ballCurrentPosition[1] <= block.topLeft[1] && ballDirection === 'SE') {
        ballDirection = 'SW';
        console.log('Left')
        document.querySelector(`[data-id="(${block.bottomLeft[0]},${block.bottomLeft[1]})"]`).remove(); 
        action = true;
        score++;   
    }
    else if (ballCurrentPosition[0] === block.bottomRight[0] &&
        ballCurrentPosition[1]+ballDimention >= block.bottomRight[1] && ballCurrentPosition[1] <= block.topRight[1] && ballDirection === 'NW') {
        ballDirection = 'NE';
        console.log('Right')
        document.querySelector(`[data-id="(${block.bottomLeft[0]},${block.bottomLeft[1]})"]`).remove(); 
        action = true;
        score++;
    }
    else if (ballCurrentPosition[0] === block.bottomRight[0] &&
        ballCurrentPosition[1]+ballDimention >= block.bottomRight[1] && ballCurrentPosition[1] <= block.topRight[1] && ballDirection === 'SW') {
        ballDirection = 'SE';
        console.log('Right')
        document.querySelector(`[data-id="(${block.bottomLeft[0]},${block.bottomLeft[1]})"]`).remove();
        action = true;
        score++;
    }
    return action;
}

intervalId = setInterval(moveBall,40);

document.addEventListener('keydown',moveUser);

addBlocks();

function postGameConfig()
{
    clearInterval(intervalId);
    document.removeEventListener('keydown',moveUser);
}
