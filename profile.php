<?php
	session_start();
	$user_id = $_SESSION["ID"];
	require_once('./DBfuncs.php');
	$dbh = connectDB();

	$viewing_uid = $_GET["userid"];
	$viewing_raw_data = getUserInfo($dbh, $viewing_uid);
	//print_r($viewing_raw_data);
	$viewing_user = $viewing_raw_data[0];
	//print_r($viewing_user);


	$viewing_self = False;
	if($viewing_user->id == $user_id){
		$viewing_self= True;
	}

	if($_POST["challenge"] == "accept"){
		//echo "accepted!";
		acceptChallenge($dbh, $user_id, $viewing_uid);
	}
	if($_POST["challenge"] == "decline"){
		//echo "declined!";
		declineChallenge($dbh, $user_id, $viewing_uid);
	}
	if($_POST["challenge"] == "initiate"){
		//echo "challenged!";
		initiateChallenge($dbh, $user_id, $viewing_uid, "white");
	}

  if($_POST["action"] == "remove"){
    //echo "removed!";
		removeFriend($dbh, $user_id, $viewing_uid);
	}
  if($_POST["action"] == "add"){
    //echo "added!";
		addFriend($dbh, $user_id, $viewing_uid);
	}
  if($_POST["action"] == "accept"){
    //echo "accepted!";
		acceptFriend($dbh, $user_id, $viewing_uid);
	}
	//add 'Dont Accept!!!!'

	$is_friend = isFriend($dbh, $viewing_uid, $user_id);
	$is_challenged = isChallenged($dbh, $viewing_uid, $user_id);
	echo $is_challenged;
?>
<html>

  <head>
    <!-- <link rel="stylesheet" href="./static/css/standard.css"/>  -->
    <link rel="stylesheet" href="./static/css/home.css"/>
  	<link rel="stylesheet" href="./static/css/profile.css"/>
	</head>

   <div class="page-wrapper">

		<?php

			if(count($viewing_raw_data) > 0){

		?>

			<?php
				require_once('./navbar.php');
			?>

	<div class="main-section">

		<div class="username-section section">

			<div class="username-wrapper">
			<?php
				echo "$viewing_user->username";
			?>
			</div>
			<div class="is-friend-wrapper">
			<?php
				if($viewing_self){
					echo "ur own page";
				}else{

					if($is_friend == 3){
						echo "Friends!";
					}elseif($is_friend == 0){
						echo "Not Friend :(";
					}else{
						echo "maayyybe... friends ;)";
					}

				}
			?>

			</div>
		</div> <!--End of Username Wrapper -->

		<?php
			if(!$viewing_self){
		?>

		<div class="friend-button section">

			<?php
					if($is_friend == 0){
						echo "<form action='./profile.php?userid=$viewing_uid' method='POST'> <input class='invis' name='action' value='add'/>".
									"<button type='submit'> Add friend </button> </form>";
					}elseif($is_friend==1){
						echo "<form action='./profile.php?userid=$viewing_uid' method='POST'> <input class='invis' name='action' value='accept'/>".
									"<button type='submit'> Accept request? </button> </form>";
					}elseif($is_friend == 2){
						echo "waiting for them <br/> to respond...";
					}elseif($is_friend == 3){
						echo "<form action='./profile.php?userid=$viewing_uid' method='POST'> <input class='invis' name='action' value='remove'/>".
									"<button type='submit'> Remove friend </button> </form>";
					}


					if($is_challenged == 0){
						echo "<form action='./profile.php?userid=$viewing_uid' method='POST'> <input class='invis' name='challenge' value='initiate'/>".
									"<button type='submit'> Challenge </button> </form>";
					//WRITE JS TO HANDLE THIS CASE!!!!!
					}elseif($is_challenged==2){
						echo "<form action='./profile.php?userid=$viewing_uid' method='POST'> <input class='invis' name='challenge' value='accept'/>".
									"<button type='submit'> Accept Game </button> </form>";
						echo "<form action='./profile.php?userid=$viewing_uid' method='POST'> <input class='invis' name='challenge' value='decline'/>".
									"<button type='submit'> Decline Game </button> </form>";
					}elseif($is_challenged == 1){
						echo "waiting for them <br/> to respond...";
						echo "<form action='./profile.php?userid=$viewing_uid' method='POST'> <input class='invis' name='challenge' value='decline'/>".
									"<button type='submit'> Decline Game </button> </form>";
					}
			?>

		</div>

		<?php
			}
		?>

		<div class="profile-stats section">
			<h1>Game Stats</h1>

			<table class="game-stats">
			<?php
				$finished =  $viewing_user->wins +  $viewing_user->losses;
				echo "<th>Wins</th>";
				echo "<th>Losses</th>";
				echo "<th>Games Finished</th>";
				echo "<th>Games Played</th>";
				echo "<tr>";
				echo "<td>$viewing_user->wins</td>";
				echo "<td>$viewing_user->losses</td>";
				echo "<td>$finished</td>";
				echo "<td>$viewing_user->gamesstarted</td>";

			?>
			</table>

		</div>

		<div class="profile-friends section">
		<h1> Friends </h1>
			<div class='friends-wrapper'>
				<?php

					$friends = getFriends($dbh, $viewing_user->id);
					foreach($friends as $friend){
						if($friend->id != $user_id){
							echo "<div class='friend'> <a href='./profile?userid=$friend->id'>$friend->username</a> </div>";
						}else{
							echo "<div class='friend friend-self'> $friend->username (you) </div>";
						}
					}

				?>
			</div>
		</div>

		<div class="old-games section">

			<?php
					$finished_games = getFinishedGames($dbh, $viewing_uid);
					$num_finished_games = count($finished_games);
			?>

			<h1> Finished Games</h1>

			<h3 class="num-games"> 
				<?php echo "<span> $viewing_user->username has finished $num_finished_games game(s)</span>";?>
			</h3>

			<table class="game-stats">
				<th> Game Id </th>
				<th> Other Player </th>
				<th> See Game Here</th>

				<?php

					foreach($finished_games as $game){
						echo "<tr>";
						echo "<td>$game->gameid</td>";
						echo "<td>$game->username</td>";
            echo "<td> <button onclick='window.location.href=\"./game.php?gameId=$game->gameid\"'> Play </button>"; 
						echo "</tr>";
					}

					?>
			</table>

		</div>

	</div> <!--end main-section -->
	
	<?php
		}else{
	?>

		<h1>No user for that id!</h1>
		<!--HTML FOR USER NOT FOUND -->

	<?php
		}
	?>
	</div> <!--End Page Wrapper -->
</html?
