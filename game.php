<?php

session_start();
$game_id = $_GET["gameId"];
$user_id = $_SESSION["ID"];

?><html>

    <head>
    <title>Beta Chess Game</title>
    <link rel='stylesheet' href='./static/css/game.css' />
    <link rel='stylesheet' href='./static/css/home.css' />
    </head>
    <body>

				<?php include('./navbar.php') ?>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

        <script src="./static/js/game.js" type="text/javascript"></script>

        <div class="page-wrapper">
            <div class="board-wrapper">
            </div>
            <div class="dialogue-box">
                <div class="child-box white-box">White: <span id="white-user"> </span></div>
                <div class="child-box turn-box">Turn: <span id="turn-num"> </span></div>
                <div class="child-box black-box"> Black: <span id="black-user"> </span></div>
            </div>
        </div>
       <script type="text/javascript">
	        body = document.getElementsByClassName("board-wrapper")[0];
					body.addEventListener("load", onloadGame(), false);

					function onloadGame(){
						setMyId(<?php echo $user_id; ?>);
						setGameId(<?php echo $_GET["gameId"]; ?>);
						startTimedQuery();
						getData();
					}


				</script>


    </body>


</html>
