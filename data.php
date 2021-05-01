<?php

/*CODE FOR TRAVERSING DATA PASSED IN THROUGH A GET CALL*/

/*require_once('./DBfuncs.php');
$dbh = connectDB();
*/
if(count($_GET) > 0){

	print_r($_GET);
	$game_id = $_GET['gameId'];
	$game_data = array( 2 => 'test');
	//$game_data = getGame($dbh, $game_id);
	print_r($game_data);

	while (list ($key, $value) = each ($game_data)) {
	  echo "array[$key] = $value\n";
	}

	//echo "success!";
	//echo json_encode($game_data);
}

if(count($_POST) > 0){

	$data = array("post0","post1");
	echo json_encode($data);

}

?>
