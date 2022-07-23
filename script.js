let board = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0]
];

const playerKey = {
    'ai': 1,
    'person': 2,
}

let gameOverBool = false;
let extraTurn = false;

console.log(playerKey);

let turn = (Math.random() < 0.5);

let json_obj="";

let apiURL = "";
// let apiURL = 'https://kevinalbs.com/connect4/back-end/index.php/getMoves?board_data='+boardToString()+'&player='+playerKey.ai;

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

const columns = document.querySelectorAll('.column');

if(turn){
    document.getElementById('TurnAlert').innerHTML = 'The AI went first!' +'<br>'+'It\'s your turn!';
    console.log('ai plays first');
    lockGame();
    playPiece(findTurn(),'ai');

    unlockGame();
}
else{
    document.getElementById('TurnAlert').innerHTML = 'You go first!' +'<br>'+'It\'s your turn!';
    console.log('person plays first');
}

columns.forEach(col => {
  col.addEventListener('click', function handleClick(event) {
      if(!gameOverBool) {

          console.log('column ' + col.id + ' clicked');
          playPiece(col.id, 'person');
          checkForWin();

          if(!extraTurn) {
                console.log('ai plays');
              lockGame();
              playPiece(findTurn(), 'ai');
              checkForWin();
              unlockGame();
          }
          document.getElementById('TurnAlert').innerHTML = ' ';

      }
  });
});

function boardToString(){
  let boardString = "";
  for(let row of board){
    for(let item of row){
      boardString+=item;
    }
  }
  console.log(boardString);
  return boardString;
}

function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    console.log(Httpreq.responseText);
    return Httpreq.responseText;          
}

function returnJSON(yourUrl){
    var json_obj = JSON.parse(Get(yourUrl));
    return json_obj;
}

function getData(yourUrl){
  json_obj = returnJSON(yourUrl);
  // console.log(json_obj);
}

function updateAPIURL(){
    let bString = boardToString();
    console.log('board string: '+bString);
    apiURL = 'https://kevinalbs.com/connect4/back-end/index.php/getMoves?board_data='+bString+'&player='+playerKey.ai;
    console.log(apiURL);
    getData(apiURL);
}

function findTurn(){
    updateAPIURL();
    console.log(json_obj);
  var mapMoves = new Map();

  mapMoves.set("0", json_obj[0]);
  mapMoves.set("1", json_obj[1]);
  mapMoves.set("2", json_obj[2]);
  mapMoves.set("3", json_obj[3]);
  mapMoves.set("4", json_obj[4]);
  mapMoves.set("5", json_obj[5]);
  mapMoves.set("6", json_obj[6]);

  //filter mapMoves to remove undefined values
    var filteredMap = new Map([...mapMoves].filter(
        ([key, value]) => value !== undefined
    ));

    console.log(mapMoves);

filteredMap[Symbol.iterator] = function* () {
    yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
}

  let sorted = [...filteredMap];
  console.log(sorted);

const lastValue = Object.values(sorted).pop();
console.log('play piece in column '+lastValue[0]);

// return lastValue[lastValue.length-1];
    return lastValue[0];
  
}

function playPiece(column,player){
  console.log(column);
  for(let row = 6; row>=0; row--){
    if(board[row][column]==0){
        extraTurn = false;
        console.log(playerKey[player]);
      board[row][column] = playerKey[player];
      console.log(+turn+1);
      // row = 5-row;
      let circleID = column.toString()+row.toString();
      console.log(circleID);
      if(player=='ai'){
            document.getElementById(circleID).style.background='red';
      }
      if(player=='person'){
            document.getElementById(circleID).style.background='yellow';
      }
      console.log(board);
      return;
    }
    else{
        console.log('column full');
        document.getElementById('TurnAlert').innerHTML = 'That Column is full!';
        // alert('That Column is full! Play somwhere else!');
        extraTurn = true;
    }
  }
}

function checkWin(){
  for(let i =0; i<=6; i++){
    for(let j =0; j<=6; j++){
        if(board[i][j]==0){
            continue;
        }
        let winURL = 'https://kevinalbs.com/connect4/back-end/index.php/hasWon?board_data='+boardToString()+'&player='+(+turn+1)+'&i='+i+'&j='+j;
        console.log(getData(winURL));
        if(getData(winURL)=='true'){
        alert('game over');
        }
    }
}
}

function gameOver(playerNum){
    gameOverBool = true;
    lockGame();
    localStorage.setItem('total', localStorage.getItem('total')+1);
    if(playerNum==2){
        localStorage.setItem('wins', localStorage.getItem('wins')+1);
        document.getElementById('modalWords').innerHTML = 'You Win!';

    }
    if(playerNum==1){
        document.getElementById('modalWords').innerHTML = 'You Lose!';
    }
    let percent = (localStorage.getItem('wins')/localStorage.getItem('total'))*100;
    document.getElementById('stats').innerHTML = percent.toFixed(2)+'%'+' of games won';
    // document.getElementById('modalWords').innerHTML = 'Player '+playerNum+' wins!';
    modal.style.display = "block";

}

//function to determine connect 4 win
function checkForWin(){
  for(let i =0; i<=6; i++){
    for(let j =0; j<=6; j++){
      if(board[i][j]==0){
        continue;
      }
      try {
          if (board[i][j] == board[i][j + 1] && board[i][j] == board[i][j + 2] && board[i][j] == board[i][j + 3]) {
              console.log('GAME OVER: Player ' + board[i][j] + ' wins!');
              gameOver(board[i][j]);
              return;
          }
          if (board[i][j] == board[i + 1][j] && board[i][j] == board[i + 2][j] && board[i][j] == board[i + 3][j]) {
              console.log('GAME OVER: Player ' + board[i][j] + ' wins!');
              gameOver(board[i][j]);
              return;
          }
          if (board[i][j] == board[i + 1][j + 1] && board[i][j] == board[i + 2][j + 2] && board[i][j] == board[i + 3][j + 3]) {
              console.log('GAME OVER: Player ' + board[i][j] + ' wins!');
              gameOver(board[i][j]);
              return;
          }
          if (board[i][j] == board[i + 1][j - 1] && board[i][j] == board[i + 2][j - 2] && board[i][j] == board[i + 3][j - 3]) {
              console.log('GAME OVER: Player ' + board[i][j] + ' wins!');
              gameOver(board[i][j]);
              return;
          }
      }
        catch(err){

        }
    }
  }
}

function lockGame(){
    const columnsCSS = document.querySelectorAll('.column');
    columnsCSS.forEach(col => {
        col.style.cursor='not-allowed';
        col.style.pointerEvents='none';

    });
    console.log('locked');
}

function unlockGame(){
    const columnsCSS = document.querySelectorAll('.column');
    columnsCSS.forEach(col => {
        col.style.cursor='auto';
        col.style.pointerEvents='auto';

    });
    // throw new Error('unlocked');
    console.log('unlocked');
}

//modal functions

var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



