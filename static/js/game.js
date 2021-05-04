
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

let pawnStart = {
	'white':'G',
	'black':'B'
}

let colors = {
	'b':'black',
	'w':'white'
}

let pieceName = {
	'r': 'rook',
	'n': 'knight',
	'b': 'bishop',
	'q': 'queen',
	'k': 'king',
	'p': 'pawn',
}

class Piece {
constructor(id){
  this.type = pieceName[id.substring(1,2)];
  this.color = colors[id.substring(0,1)];
	this.id = id;
	this.hasMoved = true;
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
      let pawnMove2 = (direction === "down" ? 6 : 1)

      if(!board.board[x][y+increment]){
          possTiles.push(indiciesToBoard(x,y+increment));

          if(!board.board[x][y+(increment * 2)] && y === pawnMove2){
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
  return new Piece(this.id)
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

/*
	[
      [new Piece("br0"),new Piece("bp0"),null,null,null,null,new Piece("wp0"),new Piece("wr0")],
      [new Piece("bn0"),new Piece("bp1"),null,null,null,null,new Piece("wp1"),new Piece("wn0")],
      [new Piece("bb0"),new Piece("bp2"),null,null,null,null,new Piece("wp2"),new Piece("wb0")],
      [new Piece("bk0"),new Piece("bp3"),null,null,null,null,new Piece("wp3"),new Piece("wk0")],
      [new Piece("bq0"),new Piece("bp4"),null,null,null,null,new Piece("wp4"),new Piece("wq0")],
      [new Piece("bb1"),new Piece("bp5"),null,null,null,null,new Piece("wp5"),new Piece("wb1")],
      [new Piece("bn1"),new Piece("bp6"),null,null,null,null,new Piece("wp6"),new Piece("wn1")],
      [new Piece("br1"),null,null,null,null,null,new Piece("wp7"),new Piece("wr1")],
  ]
*/

class Board{

constructor(){
  this.board = []
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

load(jsonDict){

	let allPieces = ["wp0","wp1","wp2","wp3","wp4","wp5","wp6","wp7","bp0","bp1","bp2","bp3","bp4","bp5","bp6","bp7",
									 "wr0","wr1","wb0","wb1","wn0","wn1","wk0","wq0","br0","br1","bb0","bb1","bn0","bn1","bk0","bq0"];

	let newBoard = [];

	for(let i = 0; i < 8; i++){
		newBoard[i] = [];
		for(let j = 0; j < 8; j++){
			newBoard[i][j] = null;
		}
	}

	//console.log(newBoard);

	let pieces=Object.keys(jsonDict);
	let promotedPieces = {};

	jsonDict.promotions.forEach( (element, index) => {
		promotedPieces[element.pieceid] = index;
	});

	console.log(promotedPieces);

	pieces.forEach( element => {
		//console.log("element: ", element , typeof(element) , " is in allP: ", (allPieces.includes(element)));
		if( allPieces.includes(element) && jsonDict[element]){
			let [x,y] = boardToIndicies(jsonDict[element]);
			newBoard[x][y] = new Piece(element);
			if(element in promotedPieces){
				newBoard[x][y].type = pieceName[ jsonDict.promotions[promotedPieces[element]].promotedtype ];
			}
		}

	})

/*
	console.log(newBoard);
	console.log(jsonDict.bkhasmoved, typeof(jsonDict.bkhasmoved));
	jsonDict.bkhasmoved = Number(jsonDict.bkhasmoved);
	console.log(jsonDict.bkhasmoved, typeof(jsonDict.bkhasmoved));
	jsonDict.bkhasmoved = Boolean(jsonDict.bkhasmoved);
	console.log(jsonDict.bkhasmoved, typeof(jsonDict.bkhasmoved));
*/


	if(newBoard[3][0] && newBoard[3][0].type === "king")
		newBoard[3][0].hasMoved = Boolean(Number(jsonDict.bkhasmoved));
	if(newBoard[3][7] && newBoard[3][7].type === "king")
		newBoard[3][7].hasMoved = Boolean(Number(jsonDict.wkhasmoved));
	if(newBoard[0][0] && newBoard[0][0].type === "rook")
		newBoard[0][0].hasMoved = Boolean(Number(jsonDict.br0hasmoved));
	if(newBoard[7][0] && newBoard[7][0].type === "rook")
		newBoard[7][0].hasMoved = Boolean(Number(jsonDict.br1hasmoved));
	if(newBoard[0][7] && newBoard[0][7].type === "rook")
		newBoard[0][7].hasMoved = Boolean(Number(jsonDict.wr0hasmoved));
	if(newBoard[7][7] && newBoard[7][7].type === "rook")
		newBoard[7][7].hasMoved = Boolean(Number(jsonDict.wr1hasmoved));


	//console.log(newBoard);

	this.board = newBoard;

}

/*dump()
 *Turns the current board state and puts it into a json
 *to be stored easier by the DB as id:tilename pairs
 *
 *NOTE: turns none-existing/already taken pieces into FALSES,
 *			however, they will be represented as NULLS in the DB
*/
dump(){

	let allPieces = ["wp0","wp1","wp2","wp3","wp4","wp5","wp6","wp7","bp0","bp1","bp2","bp3","bp4","bp5","bp6","bp7",
									 "wr0","wr1","wb0","wb1","wn0","wn1","wk0","wq0","br0","br1","bb0","bb1","bn0","bn1","bk0","bq0"];

	let dict = {};

	for(let x = 0; x < 8 ; x++){
		for(let y = 0; y < 8; y++){

			if(this.board[x][y]){
				let currPiece = this.board[x][y];
				let tile= indiciesToBoard(x,y);
				dict[currPiece.id] = tile;
				switch(currPiece.id){
					case 'wk0':
						dict.wkhasmoved = Number(this.board[x][y].hasMoved);
						break;
					case 'bk0':
						dict.bkhasmoved = Number(this.board[x][y].hasMoved);
						break;
					case 'wr0':
						dict.wr0hasmoved = Number(this.board[x][y].hasMoved);
						break;
					case 'wr1':
						dict.wr1hasmoved = Number(this.board[x][y].hasMoved);
						break;
					case 'br0':
						dict.br0hasmoved = Number(this.board[x][y].hasMoved);
						break;
					case 'br1':
						dict.br1hasmoved = Number(this.board[x][y].hasMoved);
						break;
				}
			}

		}
	}

	allPieces.forEach( element => {
		console.log(element, " is in? " + (element in dict));
		if(! (element in dict)){
			console.log("tada!");
			dict[element] = null;
		}
	})


	return dict;

}

}


let board = new Board();
let turn, myColor; //CHANGED
let tileMoveFrom, tileMoveTo, lastMoveString; //FOR LAST MOVE TRACKING


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


	if(lastMoveString && lastMoveString.length > 0){

		$('#' + lastMoveString.substring(0,2)).addClass("last-move");
		$('#' + lastMoveString.substring(4,6)).addClass("last-move");

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
      //console.log("moves: ", abcdef)
      if(abcdef.length !== 0){
          done = true;
      }
  }
}

/*NEXT PLAYER HAS NO VIABLE MOVES, LOSES */
if(!done){
  alert (`${turn} has lost!`);
	postGameEnd();
}

paintBoard();

}

let targetPieceCords;
let promotions = [];
let x;

function selectTile(selectedTile){

$('.board-tile').removeClass('active');
$('.board-tile').removeAttr('onclick');
$(".board-tile").attr("onclick","selectTile(this)")

targetPieceCords = null;
let cords = boardToIndicies(selectedTile.id);
let targetPiece = board.board[cords[0]][cords[1]];

//TURN ENFORCEMENT
if(targetPiece && targetPiece.color === turn && turn === myColor){
  targetPieceCords = cords;
  let selectedTiles = targetPiece.getViableMoves(board, cords, true);
  for(let i = 0; i < selectedTiles.length; i++){
			console.log(selectedTiles[i]);
			if(targetPiece.type === "pawn" && (targetPiece.color === "white" ? selectedTiles[i].substring(0,1) === "A" : selectedTiles[i].substring(0,1) === "H")){ 
				$('#' + selectedTiles[i]).addClass('active');
	      $('#' + selectedTiles[i]).removeAttr('onclick')
	      $('#' + selectedTiles[i]).attr('onclick','moveHereAndPromote(this)');
			}else{
			$('#' + selectedTiles[i]).addClass('active');
	      $('#' + selectedTiles[i]).removeAttr('onclick')
	      $('#' + selectedTiles[i]).attr('onclick','moveHere(this)')
			}
  	}
	}
}

function moveHereAndPromote(targetTile){

	//pieceName, images
	console.log(targetTile);
	x = targetTile;
	let promptBox = document.createElement("div");
	promptBox.classList.add("promotion-query");
	let pieces = ["q", "r", "b", "n"];

	pieces.forEach( item => {

		console.log(targetTile, item);
		let option = document.createElement("div");
		option.setAttribute("onclick", `promoteToThis("${item}", x)`)
		option.classList.add("promote-option");
		let img = document.createElement("img");
		img.setAttribute("src", images[myColor][pieceName[item]]);
		let ptag = document.createElement("p");
		ptag.innerHTML = pieceName[item];

		option.append(img);
		option.append(ptag);
		promptBox.append(option);

	});

	$('.dialogue-box').append(promptBox);

}

function promoteToThis(pType, targetTile){
	console.log(pType, targetTile);
	let targetPiece = board.board[targetPieceCords[0]][targetPieceCords[1]];
	targetPiece.type = pieceName[pType];
	promotions = [{
		pieceid: targetPiece.id,
		promotion: pType
	}];
	moveHere(targetTile);
	$(".promotion-query").remove();
}

let gameId;

function moveHere(targetTile){

let targetPiece = board.board[targetPieceCords[0]][targetPieceCords[1]];
let targetCords = boardToIndicies(targetTile.id)

tileMoveFrom = indiciesToBoard(targetPieceCords[0], targetPieceCords[1]);
tileMoveTo = targetTile;


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
postData();
paintBoard();

changeTurn();


}


//AJAX CALLS

let timedQuery;
let myId;

function startTimedQuery() {

	timedQuery = setInterval(() => getData(gameId), 5000);

}

function stopTimedQuery(){
	clearInterval(timedQuery);
}

function getData(){

	let myData = {gameId: gameId};
	//console.log("Here");

	$.get({url:"./data.php",data: myData,
				 success: function(result){
					result = JSON.parse(result);
					result = sanatizeGet(result);
					handleGet(result);
				}
			})
}

let turnNum = 0;

function handleGet(input){

	//console.log(input)

	if(input.won == 0){

		//set my color to the correct one
		if(myId == input.uidinit){
			myColor = input.initcolor;
		}else if(myId == input.uidaccept){
			if(input.initcolor == "white"){
				myColor = "black";
			}else{
				myColor = "white";
			}
		}else{
			//NOT YOUR GAME,
			// maybe: handle logic for viewers???
			myColor = "spectator";
		}

		//console.log(input.turnnum);
		//handle whos turn it is
		if( ((Number(input.turnnum) + 1) % 2) === 0){
			//console.log("init's turn");
			turn = "white";
			$('.turn-active').removeClass('turn-active');
			$('.white-box').addClass('turn-active');
		}else{
			turn = "black";
			$('.turn-active').removeClass('turn-active');
			$('.black-box').addClass('turn-active');
		}

		if(myColor == "spectator"){
			turn="spectator";
		}

		console.log(turn,myColor);
		if(myColor == turn){
			stopTimedQuery();
		}

		$('#turn-num').html(input.turnnum);

	}else{

		stopTimedQuery();
		$('#turn-num').html(input.turnnum + " FINISHED");

	}

		if(myColor === "white"){

			if(myId == input.uidinit){
				$('#white-user').html(input.initusername + " (you)");
				$('#black-user').html(input.acceptusername);
			}else{
				$('#white-user').html(input.acceptusername + " (you)");
				$('#black-user').html(input.initusername);
			}

		}else{

			if(myId == input.uidinit){
				$('#black-user').html(input.initusername  + " (you)");
				$('#white-user').html(input.acceptusername);
			}else{
				$('#black-user').html(input.acceptusername  + " (you)");
				$('#white-user').html(input.initusername);
			}


		}

	console.log(input.turnnum, turnNum);
	//only repaint if the board has changed
	if( !(input.turnnum == turnNum)){
		lastMoveString = input.lastmove;
		board.load(input);
		paintBoard();
		console.log(board.board);
		turnNum = Number(input.turnnum);
	}


}

function setMyId(userId){
	myId = userId;
}

function setGameId(gID){
	gameId = gID;
}

function sanatizeGet(input){

	let newObj = {};
	//console.log(input);

	for(pieceId in input){

		if(input[pieceId]){
			if(pieceId.substring(1,2) === "p"){
				//console.log(pieceId, input[pieceId]);
				if(input[pieceId].substring(2,3) === "0"){

					newObj[pieceId] = input[pieceId].substring(0,2);

				}else{
					//HANDLE CASE OF PROMOTED PAWN
				}
			}else{
				newObj[pieceId] = input[pieceId];
			}
		}
	}


	return newObj;

}

function sanatizePost(input){

	let newObj = {};

	console.log("sanatize input" , input);
	for(pieceId in input){

		if(input[pieceId]){

			if(pieceId.substring(1,2) === "p"){
					if(true){ //HANDLE CASE THEY ARE PROMOTED...
						console.log(pieceId, input[pieceId]);
						newObj[pieceId] = input[pieceId] + "0";
					}
				}else{
					newObj[pieceId] = input[pieceId];
				}
			}else{
				newObj[pieceId] = null;
			}

	}

	console.log("sanatized post: " , newObj);
	return newObj;



}

function postData(){

	let currBoardState = sanatizePost(board.dump());
	console.log(tileMoveFrom, tileMoveTo);
	lastMoveString = `${tileMoveFrom}->${tileMoveTo.id}`;
	currBoardState.lastmove = lastMoveString;

	let myData = {action:"update" ,gameId: gameId, board: currBoardState, promotions: promotions};

	console.log("POST: ", myData);

	$.post({url:"./data.php",data: myData,
				 success: function(result){
					console.log(result);
					getData();
					startTimedQuery();
					promotions = [];
				}
			})

}

function postGameEnd(){

	let myData = {action:"end", gameId: gameId, myWinningId: myId};

	$.post({url:"./data.php", data: myData,
				 success: function(result){
					console.log(result);
					getData();
				}
			})

}

