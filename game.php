<?php

/*
THINGS TO CONSIDER ON A GAME PAGE

0)Game id is found
1)The curr user is one of the two users
2)
*/

//require_once('./DBfuncs.php');

?>
<html>

<!--
    <head>
    <title>Beta Chess Game</title>
    <link rel='stylesheet' href='./static/css/game.css' />
    </head>
    <body>

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

        <script src="./static/js/game.js" type="text/javascript"></script>

        <div class="page-wrapper">
            <div class="board-wrapper">
            </div>
            <div class="dialogue-box">
                <div class="child-box">test1</div>
                <div class="child-box">test2</div>
                <div class="child-box">test3</div>
            </div>
        </div>
       <script type="text/javascript">
	        body = document.getElementsByClassName("board-wrapper")[0];
	        //body.addEventListener("load", paintBoard(), false);
					body.addEventListener("load", getData(1) , false);

					function bs(){
						board.load({'wq0':'A1'});
						paintBoard();
					}

			//<?php getGame


//          setInterval(function() {alert("test") },1000)


/*					$.get({url: "./data.php", data: {attr0: "woahhh", attr1: "woahh1"},
								   success: function(result){
										console.log(result);
									}
								});
*/

				</script>


    </body>

-->

<h1> test </h1>
</html>
