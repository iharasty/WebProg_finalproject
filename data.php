<?php

/*CODE FOR TRAVERSING DATA PASSED IN THROUGH A GET CALL*/

require_once('./DBfuncs.php');
$dbh = connectDB();

if(count($_GET) > 0){

	//print_r($_GET);
	$game_id = $_GET['gameId'];
	$game_data = array( 2 => 'test');
	$game_data = getPvpGame($dbh, $game_id)[0];
	$init_data = getUserInfo($dbh, $game_data->uidinit)[0] -> username;
	$accept_data = getUserInfo($dbh, $game_data->uidaccept)[0] -> username;
	$game_data -> acceptusername = $accept_data;
	$game_data -> initusername = $init_data;
	$game_data -> promotions = getPromotions($dbh, $game_id);
	echo json_encode($game_data);

}


if( isset($_POST["action"]) && !empty($_POST["action"])){

	if($_POST["action"] == "update"){

		print_r($_POST);
		//print_r(json_decode($_POST["board"], true));
		postPvpGame($dbh, $_POST["gameId"] , $_POST["board"]);
		incrementTurn($dbh, $_POST["gameId"]);
		if( count($_POST["promotions"]) > 0){

			$promotion_data = $_POST["promotions"][0];
			promote($dbh, $_POST["gameId"], $promotion_data["pieceid"], $promotion_data["promotion"]);

		}

	}



	if($_POST["action"] == "accept"){

		acceptGame($dbh, $_POST["gameId"]);
		$game_data = getGameInfo($dbh, $_POST["gameId"])[0];
		incrementGamesStarted($dbh, $game_data->uidaccept);
		incrementGamesStarted($dbh, $game_data->uidinit);

	}


	if($_POST["action"] == "decline"){

		declineGame($dbh, $_POST["gameId"]);

	}

	if($_POST["action"] == "end"){

		$game_data = getGameInfo($dbh, $_POST["gameId"])[0];
		$winning_id = $_POST["myWinningId"];
		$loser_id = -1;

		if($winning_id == $game_data->uidinit){
			$loser_id = $game_data->uidaccept;
		}else{
			$loser_id = $game_data->uidinit;
		}

		winGame($dbh, $_POST["gameId"]);
		winUser($dbh, $winning_id);
		loseUser($dbh, $loser_id);


	}

}


?>
