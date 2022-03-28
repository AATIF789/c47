
var PLAY=1
var LOSINGEND=0
var WINNINGEND=2
var gameState=PLAY
var ground, backgroundImg,invisibleGround
var enemy,enemyAttack,enemyRun,enemyImg
var girl,girlImg ,girlRunning, girlColliding
var score
var cash,cashImg,cashGroup

var winSound,loseSound, jumpSound, coinSound  
var gameOver,gameOverImg, restart, restartImg
var obstaclesGroup, obstacle1
var diamondCollected=0
var winningBackgroundImg,winningBackground
var lifeline=3
var showText=true

function preload(){
  backgroundImg= loadImage("Background.png");
  girlRunning=loadAnimation("girl run 1.png","girl run 2.png","girl run 3.png","girl run 4.png","girl run 5.png","girl run 6.png","girl run 7.png","girl run 8.png","girl run 9.png","girl run 10.png","girl run 11.png","girl run 12.png","girl run 13.png","girl run 14.png","girl run 15.png","girl run 16.png","girl run 17.png","girl run 18.png","girl run 19.png");
  enemyAttack=loadAnimation("enemy attack 1.png","enemy attack 2.png","enemy attack 3.png","enemy attack 4.png","enemy attack 5.png","enemy attack 6.png","enemy attack 7.png");
  enemyRun=loadAnimation("enemy run 1.png","enemy run 2.png","enemy run 3.png","enemy run 4.png","enemy run 5.png","enemy run 6.png","enemy run 7.png","enemy run 8.png","enemy run 9.png","enemy run 10.png");
  enemyImg=loadImage("enemy image.png");
  girlImg=loadImage("girl image.png");
  restartImg=loadImage("restart.png");
  gameOverImg=loadImage("game over.png");
  girlColliding=loadAnimation("girl collided.png");
  obstacle1=loadImage("obstacle 1.png")
  cashImg=loadImage("diamond.png")
  winningBackgroundImg=loadImage("download.jpg")
  jumpSound=loadSound("jump.wav")
  loseSound=loadSound("lose.wav")
  winSound=loadSound("win.mp3")
  coinSound=loadSound("coin.wav")
}
function setup() {
  createCanvas(600,500);
  ground=createSprite(0,0,0,0)
  ground.addImage("backgroundImg",backgroundImg)  
  ground.scale=1.4
  ground.velocityX=-1

  girl=createSprite(300,410,20,10)
  //girl.addImage("girlImg",girlImg)
  girl.addAnimation("girlRunning",girlRunning)
  girl.addAnimation("girlColliding",girlColliding)
  girl.scale=0.2

  enemy = createSprite(50, 410, 600, 10);
  enemy.addAnimation("enemyRun", enemyRun);
  enemy.addAnimation("enemyAttack", enemyAttack);
  enemy.addImage("enemyImg", enemyImg);
  enemy.scale = 0.2;

  invisibleGround=createSprite(300,470,600,10)
  invisibleGround.visible=false

  gameOver=createSprite(300,100)
  gameOver.addImage(gameOverImg)

  restart=createSprite(350,160)
  restart.addImage(restartImg)


  winningBackground=createSprite(300,250)
  winningBackground.addImage(winningBackgroundImg)
  winningBackground.scale=2.5

  obstaclesGroup = new Group();
  cashGroup = new Group();
  score=0

}


function draw() 
{
  background("black");  
  girl.velocityY = girl.velocityY + 0.5;
  girl.collide(invisibleGround);

  enemy.velocityY=girl.velocityY+0.8
  enemy.collide(invisibleGround)


  if(gameState===PLAY){
    showText=true
    gameOver.visible=false
    restart.visible=false
    winningBackground.visible=false
    score = score + Math.round(getFrameRate() / 60);
    spawnObstacles();
    createCash();


    if(diamondCollected===10||score==1000){
      gameState=WINNINGEND
      winSound.play()
    }

    if (obstaclesGroup.isTouching(enemy)) {
      enemy.velocityY = -12;
    }

    ground.velocityX = -(4 + 3 * score / 100);
    
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    //console.log(girl.y)
    if ((keyDown("space") && girl.y >= 419.59)) {
      girl.velocityY = -12;
      jumpSound.play()
    }
    if (obstaclesGroup.isTouching(girl)) {
      gameState = LOSINGEND;
      loseSound.play()
      
    } 
    if(cashGroup.isTouching(girl)){
      cashGroup.destroyEach()
      diamondCollected=diamondCollected+1
      coinSound.play()
    }
  }
  else if (gameState === LOSINGEND) {
    showText=true
    gameOver.visible = true;
    restart.visible = true;
    winningBackground.visible=false
    ground.velocityX = 0;
    girl.velocityY = 0
    girl.changeAnimation("girlColliding", girlColliding);
    enemy.changeAnimation("enemyAttack", enemyAttack);
    enemy.x = girl.x;
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
    cashGroup.setLifetimeEach(-1);
    cashGroup.setVelocityXEach(0);
    if (mousePressedOver(restart)) {
      reset();
    } 


  }
  else if(gameState===WINNINGEND){
    showText=false
    ground.velocityX = 0;
    girl.velocityY = 0
    girl.destroy()
    ground.destroy()

    obstaclesGroup.destroyEach()
    cashGroup.destroyEach()
    winningBackground.visible=true
  }
  
  drawSprites()
  if(showText){
   fill("blue");
   textStyle(BOLD)
   textSize(15);
    text("SCORE: " + score, 450, 50);

    fill("green")
    textSize(15)
    text("DIAMOND COLLECTED:  "+diamondCollected,50,50)

    fill("red")
    textSize(15)
    text("LIFELINE: "+lifeline,300,50)
  }

}
function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  girl.changeAnimation("girlRunning", girlRunning);
  obstaclesGroup.destroyEach();
  cashGroup.destroyEach();
  score = 0;
  enemy.x = 50;
  diamondCollected=0
}

function spawnObstacles(){
  if (frameCount % 100 === 0) {
    var obstacle = createSprite(600, 450, 10, 40);


    obstacle.velocityX = -(6+ score/100)

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    obstacle.addImage(obstacle1);
    obstacle.scale = 0.1;
    obstaclesGroup.add(obstacle);
    obstacle.debug = false;
    obstacle.setCollider("circle", 0, 0, 1);
    obstacle.lifetime=100
  }
}
  function createCash(){
    if(frameCount % 200==0){
      var cashes= createSprite(550,random(200,400),10,40)

      cashes.velocityX=-(6+score/200)
      cashes.addImage(cashImg)
      cashes.scale=0.8
      cashGroup.add(cashes)
    //  cashes.debug=true
      cashes.setCollider("rectangle",0,0,50,50)
      cashes.lifetime=100

    }
  }
