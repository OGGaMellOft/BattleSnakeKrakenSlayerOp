const bodyParser = require('body-parser')
const express = require('express')

const PORT = process.env.PORT || 3000

const app = express()
app.use(bodyParser.json())

app.get('/', handleIndex)
app.post('/start', handleStart)
app.post('/move', handleMove)
app.post('/end', handleEnd)

app.listen(PORT, () => console.log(`Battlesnake Server listening at http://127.0.0.1:${PORT}`))


function handleIndex(request, response) {
  var battlesnakeInfo = {
    apiversion: '1',
    author: 'gamelloft',
    color: '#51C944',
    head: 'silly',
    tail: 'default'
  }
  response.status(200).json(battlesnakeInfo)
}

function handleStart(request, response) {
  var gameData = request.body
  console.log(gameData.board.snakes[0])
  console.log(gameData.board.snakes[1])

  console.log('START')
  response.status(200).send('ok')
}

function handleMove(request, response) {
  var gameData = request.body

  //console.log(gameData)
  //console.log(gameData.board.snakes[1])
 
  //move = wallrunner(gameData)
  move = randomMove()
  var count = 0
  while(!isValidMove(move, gameData)){
    if(count == 30) break
    console.log("was invalid")
    move = randomMove()
    console.log("current move: " + move)
    count++
  }
  console.log("was valid")
  response.status(200).send({
    move: move
  })
}

function handleEnd(request, response) {
  var gameData = request.body

  console.log('END')
  response.status(200).send('ok')
}

function getPossibleMoves(){
  return ['up', 'down', 'left', 'right']
}

function wallrunner(gameData){
  var you = gameData.you
  var board = gameData.board
  var possibleMoves = getPossibleMoves()

   if(gameData.turn = 0) { move = possibleMoves[0] }
  else if(you.head.y != 0 && you.head.y != board.height - 1 && you.head.x != 0 && you.head.x != board.width - 1 ){
    move = possibleMoves[0]
  } else if ( you.head.y == board.height - 1 && you.head.x < board.width - 1) {
    move = possibleMoves[3]
  } else if ( you.head.y == 0 && you.head.x > 0) {
    move = possibleMoves[2]
  } else if ( you.head.x == board.width - 1 && you.head.y > 0) {
    move = possibleMoves[1]
  } else if ( you.head.x == 0 && you.head.y < board.height - 1) {
    move = possibleMoves[0]
  }
  return move
}

function nextMovePosition (move, gameData){
  var headPosition = [gameData.you.head.x, gameData.you.head.y]
  var possibleMoves = getPossibleMoves()
  //console.log("HEAD current pos: " + headPosition)
  if (move == possibleMoves[0]) headPosition[1] = headPosition[1] + 1
  else if (move == possibleMoves[1]) headPosition[1] = headPosition[1] - 1
  else if (move == possibleMoves[2]) headPosition[0] = headPosition[0] - 1
  else if (move == possibleMoves[3]) headPosition[0] = headPosition[0] + 1
  //console.log("HEAD next pos: " + headPosition)
  return headPosition;
}

function isValidMove(move, gameData){
 var wrongMove = [[-2,-2]]
 for(var i = -1; i <= gameData.board.height; i++){
    for(var j = -1; j <= gameData.board.width; j++){
      if( i == -1 || i == gameData.board.height || j == -1 || j == gameData.board.width){
        wrongMove.push([i,j])
      }
    }
 }

 for(var i = 0; i < gameData.board.snakes.length; i++){
   //dodge actuall body parts
   for(var j = 0; j < gameData.board.snakes[i].body.length; j++){
     wrongMove.push([gameData.board.snakes[i].body[j].x, gameData.board.snakes[i].body[j].y])
  }
  //dodge possible heads
  if(!isYou(gameData.board.snakes[i], gameData.you)){
    var possHeadPos = getPossibleSnakeHeadPositions(gameData.board.snakes[i])
    for(var k = 0; k < possHeadPos.length; k++){
        wrongMove.push(possHeadPos[k])
    }
  }
 }
  var nextMovePos = nextMovePosition(move, gameData)
  for(var i = 0; i < wrongMove.length; i++){
    if(JSON.stringify(wrongMove[i]) == JSON.stringify(nextMovePos)){
      //console.log("move: " + move + " --- next pos: " + nextMovePosition(move, gameData) + "--- wrong: " + wrongMove)
      return false;
    }
  }

  //console.log(wrongMove)
  return true
}

function randomMove(){
  possibleMoves = getPossibleMoves()
  return possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
}

function isDeadEnd(move, gameData){
  var nextMovePos = nextMovePosition(move, gameData)
  var possibleMoves = getPossibleMoves()
  //TODO
}

function goForKill(){
  //TODO
}

function getPossibleSnakeHeadPositions(snake){
  var possHeadPos = [[snake.head.x, snake.head.y]]
  possHeadPos.push([snake.head.x + 1, snake.head.y])
  possHeadPos.push([snake.head.x - 1, snake.head.y])
  possHeadPos.push([snake.head.x, snake.head.y + 1])
  possHeadPos.push([snake.head.x, snake.head.y - 1])
  //console.log("possHeadOtherSnake" + possHeadPos[1] + possHeadPos[2] + possHeadPos[3] + possHeadPos[4])
  return possHeadPos
}

function isYou (snake, you){
  if(you.id == snake.id){
    console.log("isYou");
    return true
  }
  console.log("notU")
  return false
}

function SeeFoodInOne(gameData){
  //TODO
}