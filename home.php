<?php

	session_start();
	print_r($_SESSION['ID']);
	require_once('DBfuncs.php');
	$dbh = connectDB();
	$curr_user = $_SESSION['ID'];

?><html>

	<head>
		<!-- <link rel="stylesheet" href="./static/css/standard.css"/>  -->
		<link rel="stylesheet" href="./static/css/home.css"/>
  </head>
	<body>

		<div class="page-wrapper">
<?php
			require_once('./navbar.php');
?>
			<div class="main-section">

				<div class="games-section section">

					<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

<script type="text/javascript">

function acceptGame(gameId){
	//console.log("test");
	let data = {action: "accept", gameId: gameId};

	$.post({url: "./data.php", data: data,
				  success: function(result){
						window.location.href=`./game.php?gameId=${gameId}`;
						console.log(result);
					}
				});

}

function declineGame(gameId){
	//console.log("test");
	let data = {action: "decline", gameId: gameId};

	$.post({url: "./data.php", data: data,
				  success: function(result){
						window.location.href=`./home.php`;
						//console.log(result);
					}
				});

}

</script>


					<div class='section pvp-games'>
						<h1>PVP Games!</h1>
						<table>

						<?php
						$accept_games = getAcceptedGames($dbh, $_SESSION['ID']);
						//print_r($unaccept_games);
						echo '<th>Game Id </th>';
						echo '<th>Oposing Username </th>';
						echo '<th>Your Color</th>';
						echo '<th>Play This Game!</th>';

						/*print_r($accept_games);
						echo count($accept_games);*/

						foreach($accept_games as $pot_game){

							$my_color = "";

							if($pot_game->uidinit == $curr_user){
								$my_color = $pot_game->initcolor;
							}elseif($pot_game->initcolor == "black"){
								$my_color = "white";
							}else{
								$my_color = "black";
							}

							//echo $my_color;

							echo '<tr>';
							echo "<td> $pot_game->gameid </td>";
							echo "<td> $pot_game->username </td>";
							echo "<td> $my_color </td>";
							echo "<td> <button onclick='window.location.href=\"./game.php?gameId=$pot_game->gameid\"'> Play </button></td>";
							echo "</tr>";
						}
						?>

						</table>
					</div>

					<div class="section unnaccepted-games">
						<h1>Challengers!</h1>
						<table>

						<?php
						$unaccept_games = getUnacceptedGames($dbh, $_SESSION['ID']);
						//print_r($unaccept_games);
						echo '<th>Oposing Username </th>';
						echo '<th>Their starting color</th>';
						echo '<th>Do you accept?</th>';
						foreach($unaccept_games as $pot_game){
							echo '<tr>';
							echo "<td> $pot_game->username </td>";
							echo "<td> $pot_game->initcolor </td>";
	            echo "<td> <button onclick='acceptGame($pot_game->gameid)'> accept </button> " .
									 " <button onclick='declineGame($pot_game->gameid)'> decline </button> </td>";
//
							echo "</tr>";
						}
						?>

						</table>
					</div>

					<div class='section ai-games'>
						<!-- <h1>AI Games!</h1> -->
					</div>

				</div>

				<div class="friends-section section">

					<div class="accepted-friends friends">
						<h3> Friends </h3>
						<?php
						$friends = getFriends($dbh, $_SESSION['ID']);
						//print_r($friends);
						$numfriends = count($friends);
						//echo "You have $numfriends friends";
						echo "<ul>";
						foreach($friends as $friend){
							echo "<li><a href='./profile?userid=$friend->id'>$friend->username</a>";
						}
						echo "</ul>";
						?>
					</div>

					<div class="unaccepted-friends friends">
						<h3> un-accepted friends </h3>
						<?php
						$un_friends = getUnacceptedFriends($dbh, $_SESSION['ID']);
						//print_r($friends);
						$numfriends = count($friends);
						//echo "You have $numfriends friends";
						echo "<ul>";
						foreach($un_friends as $friend){
							echo "<li><a href='./profile?userid=$friend->id'>$friend->username</a>";
						}
						echo "</ul>";
						?>
					</div>

				</div>

			</div>

		</div>

	</body>

</html>
