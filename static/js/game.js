
let letters=["A","B","C","D","E","F","G","H"]
let images = {
"black": {
  "bishop":   "./static/black_bishop.png",
  "king":     "./static/black_king.png",
  "knight":   "./static/black_knight.png",
  "pawn":     "./static/black_pawn.png",
  "rook":     "./static/black_rook.png",
  "queen":    "./static/black_queen.png",
},
"white": {
  "bishop":   "./static/white_bishop.png",
  "king":     "./static/white_king.png",
  "knight":   "./static/white_knight.png",
  "pawn":     "./static/white_pawn.png",
  "rook":     "./static/white_rook.png",
  "queen":    "./static/white_queen.png",
}
}

let colorSide = {
'white':'top',
'black':'bottom'
}

class Piece {
constructor(color, type){
  this.type = type;
  this.color = color;
  this.hasMoved = false;
}
getImgSrc(){
  return images[this.color][this.type]
}

pieceCanMove(board,position,possibleMoves){
  let enemeyPieces = [] //list pairs of the enemy peice its reference[0] & current position[1]
  let kingPos = null;
  let tiles = $('.board-tile');
  for(let i = 0; i < tiles.length; i++ ){
      let [x,y] = boardToIndicies(tiles[i].id);
      if(board.board[x][y] && board.board[x][y].color !== this.color){
          let badGuy = [board.board[x][y] , [x,y]]
          enemeyPieces.push(badGuy)
      }
      if(board.board[x][y] && board.board[x][y].type == 'king' && board.board[x][y].color == this.color ){
          kingPos = indiciesToBoard(x,y);
      }
  }

  console.log("enemy pieces: ", enemeyPieces)
  console.log("my king: ", kingPos)
  let checkedPossibleMoves = [];
  let [currX, currY] = position;

  for(let i = 0; i < possibleMoves.length; i++){
      let nextboard = board.clone();
      nextboard.board[currX][currY] = null;
      let possTile = possibleMoves[i];
      let [possX, possY] = boardToIndicies(possTile);
      nextboard.board[possX][possY] = board.board[currX][currY].clone();
      let valid = true;


      if(this.type !== "king"){
          for(let j = 0; j < enemeyPieces.length && valid; j++){

                  /*If the currently checked board position allows for my king to be attacked, then dont add
                  * it to the list of "checked moves", UNLESS we also can take the piece that is currently
                  * attacking my king
                  */
                  if(enemeyPieces[j][0].getViableMoves(nextboard,enemeyPieces[j][1],false).includes(kingPos)
                  && indiciesToBoard(enemeyPieces[j][1][0],enemeyPieces[j][1][1]) !== possTile){
                      valid = false;
                  }
          }
          if(valid){
             checkedPossibleMoves.push(possibleMoves[i]);
          }
      }else{

          let allEnemyMoves = [];
          for(let j = 0; j < enemeyPieces.length && valid; j++){
              allEnemyMoves.push(...enemeyPieces[j][0].getViableMoves(nextboard,enemeyPieces[j][1],false))
          }
          console.log("curr move: ", possibleMoves[i] , "all enemy moves: ", allEnemyMoves)

          if(!allEnemyMoves.includes(possibleMoves[i])){
              checkedPossibleMoves.push(possibleMoves[i]);
          }
      }
  }
  //ayyyy!

  console.log(this.color,this.type,possibleMoves,checkedPossibleMoves);
  return checkedPossibleMoves;
}

getViableMoves(board, position, check){

  let possTiles = []
  let [x,y] = position
  //TODO: IMPLEMENT 'move allowing check' CHECKING

  if(this.type === 'pawn'){

      let direction = (colorSide[this.color] === "top"? "down" :"up")
      let increment = (direction === "down" ? -1 : 1)
      let pawnMove2 = (direction === "down" ? "G" : "B")

      if(!board.board[x][y+increment]){
          possTiles.push(indiciesToBoard(x,y+increment));

          if(!board.board[x][y+(increment * 2)] && !this.hasMoved){
              possTiles.push(indiciesToBoard(x,y+(increment * 2)));
          }
      }

      //left attack diaganol
      if(x > 0 && board.board[x-1][y+increment] && board.board[x-1][y+increment].color !== this.color )
          possTiles.push(indiciesToBoard(x-1,y+increment));


      //right attack diaganol
      if(x < 7 && board.board[x+1][y+increment] && board.board[x+1][y+increment].color !== this.color )
          possTiles.push(indiciesToBoard(x+1,y+increment));

      //TODO: implement promoting???
  }

  if(this.type === 'rook'){

      //Right Way
      for(let i = x + 1; i < board.board.length; i++){
          if(board.board[i][y]){
             if(board.board[i][y].color === this.color){
                 break;
              }else{
                  possTiles.push(indiciesToBoard(i,y));
                  break;
              }
          }
          possTiles.push(indiciesToBoard(i,y));
      }

      //Left way
      for(let i = x - 1; i >= 0; i--){

          if(board.board[i][y]){
             if(board.board[i][y].color === this.color){
                 break;
              }else{
                  possTiles.push(indiciesToBoard(i,y));
                  break;
              }
          }
          possTiles.push(indiciesToBoard(i,y));
      }

      //Up
      for(let j = y + 1; j < board.board.length; j++){

          if(board.board[x][j]){
             if(board.board[x][j].color === this.color){
                 break;
              }else{
                  possTiles.push(indiciesToBoard(x,j));
                  break;
              }
          }
          possTiles.push(indiciesToBoard(x,j));
      }

      //down
      for(let j = y - 1; j >= 0; j--){
          if(board.board[x][j]){
             if(board.board[x][j].color === this.color){
                 break;
              }else{
                  possTiles.push(indiciesToBoard(x,j));
                  break;
              }
          }
          possTiles.push(indiciesToBoard(x,j));
      }
  }

  if(this.type === 'knight'){

      let moves = [[x+2, y+1],[x-2, y+1],[x+2, y-1],[x-2, y-1],[x+1, y+2],[x-1, y+2],[x+1, y-2],[x-1, y-2]];
      for(let i = 0; i < 8; i++){
          let[potX,potY] = moves[i];
          if(potX >= 0 && potX < 8 && potY >= 0 && potY < 8){
              if(!board.board[potX][potY] || board.board[potX][potY].color !== this.color)
                  possTiles.push(indiciesToBoard(potX,potY));
          }
      }
  }

  if(this.type === 'bishop'){
      let [potX, potY] = position;

      //Top Right Diagonal
      potX++;
      potY++;
      while(potX >= 0 && potX < 8 && potY >= 0 && potY < 8){
          if(board.board[potX][potY]){
              if(board.board[potX][potY].color !== this.color){
                  possTiles.push(indiciesToBoard(potX,potY));
                  break;
              }else{
                  break
              }
          }
          possTiles.push(indiciesToBoard(potX,potY));                       
          potX++;
          potY++;
      }

      [potX, potY] = position;

      //Top Left Diagonal
      potX--;
      potY++;
      while(potX >= 0 && potX < 8 && potY >= 0 && potY < 8){
          if(board.board[potX][potY]){
              if(board.board[potX][potY].color !== this.color){
                  possTiles.push(indiciesToBoard(potX,potY));
                  break;
              }else{
                  break
              }
          }
          possTiles.push(indiciesToBoard(potX,potY));                       
          potX--;
          potY++;
      }

      [potX, potY] = position;

      //Down Left Diagonal
      potX--;
      potY--;
      while(potX >= 0 && potX < 8 && potY >= 0 && potY < 8){
          if(board.board[potX][potY]){
              if(board.board[potX][potY].color !== this.color){
                  possTiles.push(indiciesToBoard(potX,potY));
                  break;
              }else{
                  break
              }
          }
          possTiles.push(indiciesToBoard(potX,potY));                       
          potX--;
          potY--;
      }

      [potX, potY] = position;

      //Down Right Diagonal
      potX++;
      potY--;
      while(potX >= 0 && potX < 8 && potY >= 0 && potY < 8){
          if(board.board[potX][potY]){
              if(board.board[potX][potY].color !== this.color){
                  possTiles.push(indiciesToBoard(potX,potY));
                  break;
              }else{
                  break
              }
          }
          possTiles.push(indiciesToBoard(potX,potY));                       
          potX++;
          potY--;
      }

  }

  if(this.type === 'queen'){

      let [potX, potY] = position;

      //Top Right Diagonal
      potX++;
      potY++;
      while(potX >= 0 && potX < 8 && potY >= 0 && potY < 8){
          if(board.board[potX][potY]){
              if(board.board[potX][potY].color !== this.color){
                  possTiles.push(indiciesToBoard(potX,potY));
                  break;
              }else{
                  break
              }
          }
          possTiles.push(indiciesToBoard(potX,potY));                       
          potX++;
          potY++;
      }

      [potX, potY] = position;

      //Top Left Diagonal
      potX--;
      potY++;
      while(potX >= 0 && potX < 8 && potY >= 0 && potY < 8){
          if(board.board[potX][potY]){
              if(board.board[potX][potY].color !== this.color){
                  possTiles.push(indiciesToBoard(potX,potY));
                  break;
              }else{
                  break
              }
          }
          possTiles.push(indiciesToBoard(potX,potY));                       
          potX--;
          potY++;
      }

      [potX, potY] = position;

      //Down Left Diagonal
      potX--;
      potY--;
      while(potX >= 0 && potX < 8 && potY >= 0 && potY < 8){
          if(board.board[potX][potY]){
              if(board.board[potX][potY].color !== this.color){
                  possTiles.push(indiciesToBoard(potX,potY));
                  break;
              }else{
                  break
              }
          }
          possTiles.push(indiciesToBoard(potX,potY));                       
          potX--;
          potY--;
      }

      [potX, potY] = position;

      //Down Right Diagonal
      potX++;
      potY--;
      while(potX >= 0 && potX < 8 && potY >= 0 && potY < 8){
          if(board.board[potX][potY]){
              if(board.board[potX][potY].color !== this.color){
                  possTiles.push(indiciesToBoard(potX,potY));
                  break;
              }else{
                  break
              }
          }
          possTiles.push(indiciesToBoard(potX,potY));                       
          potX++;
          potY--;
      }

                              //Right Way
      for(let i = x + 1; i < board.board.length; i++){
          if(board.board[i][y]){
             if(board.board[i][y].color === this.color){
                 break;
              }else{
                  possTiles.push(indiciesToBoard(i,y));
                  break;
              }
          }
          possTiles.push(indiciesToBoard(i,y));
      }

      //Left way
      for(let i = x - 1; i >= 0; i--){

          if(board.board[i][y]){
             if(board.board[i][y].color === this.color){
                 break;
              }else{
                  possTiles.push(indiciesToBoard(i,y));
                  break;
              }
          }
          possTiles.push(indiciesToBoard(i,y));
      }

      //Up
      for(let j = y + 1; j < board.board.length; j++){

          if(board.board[x][j]){
             if(board.board[x][j].color === this.color){
                 break;
              }else{
                  possTiles.push(indiciesToBoard(x,j));
                  break;
              }
          }
          possTiles.push(indiciesToBoard(x,j));
      }

      //down
      for(let j = y - 1; j >= 0; j--){
          if(board.board[x][j]){
             if(board.board[x][j].color === this.color){
                 break;
              }else{
                  possTiles.push(indiciesToBoard(x,j));
                  break;
              }
          }
          possTiles.push(indiciesToBoard(x,j));
      }


  }

  if(this.type === 'king'){
      let moves = [[x+1,y],[x+1,y+1],[x,y+1],[x-1,y+1],[x-1,y],[x-1,y-1],[x,y-1],[x+1,y-1]];
      for(let i = 0; i < 8; i++){
          let[potX,potY] = moves[i];
          if(potX >= 0 && potX < 8 && potY >= 0 && potY < 8){
              if(!board.board[potX][potY] || board.board[potX][potY].color !== this.color)
                  possTiles.push(indiciesToBoard(potX,potY));
          }
      }

      //LEFT CASTLE
      if(!this.hasMoved && board.board[0][y] && board.board[0][y].type === "rook" && !board.board[0][y].hasMoved &&
          !board.board[x-1][y] && !board.board[x-2][y] ){
          possTiles.push(indiciesToBoard(x-2,y))
      }

      //RIGHT CASTLE
      if(!this.hasMoved && board.board[7][y] && board.board[7][y].type === "rook" && !board.board[7][y].hasMoved &&
          !board.board[x+1][y] && !board.board[x+2][y] && !board.board[x+3][y]){
          possTiles.push(indiciesToBoard(x+3,y))
      }


  }

  if(check)
      return this.pieceCanMove(board,position,possTiles);
  else
      return possTiles;

}

clone(){
  return new Piece(this.color,this.type)
}
}
//            BOARD FOR TESTING CHECK AND STUFF
//                    this.board = [
//                        [null,null,null,null,new Piece("white","rook"),null,null,null],
//                        [null,null,null,null,null,null,null,null],
//                        [null,null,null,null,null,null,null,null],
//                        [null,new Piece("black","rook"),null,null,new Piece("white","king"),null,null,new Piece("black","rook")],
//                        [null,null,null,null,null,null,null,null],
//                        [null,null,null,null,null,null,null,null],
//                        [null,null,null,null,null,null,null,null],
//                        [null,null,null,null,null,null,null,null],
//                      ]

class Board{
constructor(){
  this.board = [
      [new Piece("black","rook"),new Piece("black","pawn"),null,null,null,null,new Piece("white","pawn"),new Piece("white","rook")],
      [null,new Piece("black","pawn"),null,null,null,null,new Piece("white","pawn"),null],
      [null,new Piece("black","pawn"),null,null,null,null,new Piece("white","pawn"),null],
      [new Piece("black","king"),new Piece("black","pawn"),null,null,null,null,new Piece("white","pawn"),new Piece("white","king")],
      [new Piece("black","queen"),new Piece("black","pawn"),null,null,null,null,new Piece("white","pawn"),new Piece("white","queen")],
      [new Piece("black","bishop"),new Piece("black","pawn"),null,null,null,null,new Piece("white","pawn"),new Piece("white","bishop")],
      [new Piece("black","knight"),new Piece("black","pawn"),null,null,null,null,new Piece("white","pawn"),new Piece("white","knight")],
      [new Piece("black","rook"),new Piece("black","pawn"),null,null,null,null,new Piece("white","pawn"),new Piece("white","rook")],
  ]
}



clone(){
  let newBoard = [];
  for(let i = 0; i < 8; i++){
      newBoard[i] = [];
      for(let j = 0; j < 8; j++){
          if(this.board[i][j])
              newBoard[i][j] = this.board[i][j].clone()
          else
              newBoard[i][j] = null;
      }
  }
  let newBoardObject = new Board();
  newBoardObject.board = newBoard;
  return newBoardObject;
}
}


let board = new Board();
let turn = "white";

function paintBoard(){
console.log("repainting-board");
//The indicies in this function are really ugly because I designed it
//for a wrong board.board set up (I did [y,x] cords...)
$('.board-tile').remove()
for(let y = 7; y >= 0; y--){
  for(let x = 0; x < 8; x++){

      let tile = document.createElement("div");
      tile.setAttribute("class","board-tile");
      tile.id = indiciesToBoard(x,y)

      //If there's a piece there, put its corelating image
      if(board.board[x][y]){
          let img = document.createElement("img");
          img.setAttribute("src",board.board[x][y].getImgSrc());
          img.setAttribute("class","piece");

          if(turn == "white" && board.board[x][y].color === 'white'){
              tile.setAttribute('onclick','selectTile(this)')
          }else{
              tile.setAttribute('onclick','selectTile(this)')
          }

          tile.append(img);
      }

      //math for making the colors change as they should
      let offSet = (x % 2 == 0 ? 0 : 1)
      if( ( (y + offSet) % 2) === 0)
          tile.classList.add("black-tile");
      else
          tile.classList.add("white-tile");

      $(".board-wrapper").append(tile);
  }
}
}

function indiciesToBoard(i, j){
return letters[j] + (i + 1);
}

function boardToIndicies(tileId){
num = Number(tileId.charAt(1)) - 1
letter = letters.findIndex( (item) => item === tileId.charAt(0))
return [num, letter]
}

function changeTurn(){
if(turn === "white"){
  turn = "black";
}else{
  turn = "white"
}
let tiles = $('.board-tile');
let done = false;

for(let i = 0; i < tiles.length && !done; i++ ){
  let [x,y] = boardToIndicies(tiles[i].id);
  if(board.board[x][y] && board.board[x][y].color === turn){
      let abcdef = board.board[x][y].getViableMoves(board, [x,y], true);
      console.log("moves: ", abcdef)
      if(abcdef.length !== 0){
          done = true;
      }
  }
}

if(!done){
  alert(`${turn} has Lost the game!`)
}

paintBoard();

}

let targetPieceCords;

function selectTile(selectedTile){

$('.board-tile').removeClass('active');
$('.board-tile').removeAttr('onclick');
$(".board-tile").attr("onclick","selectTile(this)")

targetPieceCords = null;
let cords = boardToIndicies(selectedTile.id);
let targetPiece = board.board[cords[0]][cords[1]];

//TURN ENFORCEMENT
if(targetPiece && targetPiece.color === turn){
  targetPieceCords = cords;
  let selectedTiles = targetPiece.getViableMoves(board, cords, true);
  for(let i = 0; i < selectedTiles.length; i++){
      $('#' + selectedTiles[i]).addClass('active');
      $('#' + selectedTiles[i]).removeAttr('onclick')
      $('#' + selectedTiles[i]).attr('onclick','moveHere(this)')
  }
}
}

function moveHere(targetTile){
let targetPiece = board.board[targetPieceCords[0]][targetPieceCords[1]];
let targetCords = boardToIndicies(targetTile.id)

//handling the special cases of promotion, or castling
if(targetPiece.type === "king" && !targetPiece.hasMoved && (targetCords[0] === 1 || targetCords[0] === 6)){

  let rookX, castleDir;
  if(targetCords[0] === 1){
      rookX = 0;
      castleDir = 1;
  }else{
      rookX = 7;
      castleDir = -1;
  }

  rookLocation = [rookX,targetCords[1]]
  board.board[targetCords[0]][targetCords[1]] = targetPiece;
  board.board[targetCords[0]][targetCords[1]].hasMoved = true;
  board.board[targetPieceCords[0]][targetPieceCords[1]] = null;

  board.board[targetCords[0] + castleDir][targetCords[1]] = board.board[rookLocation[0]][rookLocation[1]];
  board.board[rookLocation[0]][rookLocation[1]].hasMoved = true;
  board.board[rookLocation[0]][rookLocation[1]] = null;
}if(targetPiece.type === "pawn" && (targetCords[1] === 0 || targetCords[1] === 7)){
  targetPiece.type = 'queen';
  board.board[targetCords[0]][targetCords[1]] = targetPiece;
  board.board[targetCords[0]][targetCords[1]].hasMoved = true;
  board.board[targetPieceCords[0]][targetPieceCords[1]] = null;
}else{
  board.board[targetCords[0]][targetCords[1]] = targetPiece;
  board.board[targetCords[0]][targetCords[1]].hasMoved = true;
  board.board[targetPieceCords[0]][targetPieceCords[1]] = null;
}
paintBoard();
changeTurn();

