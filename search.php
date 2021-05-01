<?php

  session_start();
  print_r($_SESSION['ID']);
  require_once('DBfuncs.php');
  $dbh = connectDB();
  $curr_user = $_SESSION['ID'];

?>

<html>

  <head>
    <!-- <link rel="stylesheet" href="./static/css/standard.css"/>  -->
    <link rel="stylesheet" href="./static/css/home.css"/>
    <link rel="stylesheet" href="./static/css/search"/>
  </head>
  <body>

		<div class="page-wrapper">

			<?php
				require_once('./navbar.php');
			?>
			<script>

				function toProfile(id){
					window.location.href = "./profile?userid=" + id;
				}

			</script>

			<div class="main-section">

				<div class="results-wrapper section">

					<?php

						$response = searchUsers($dbh, $_GET["q"]);

						/*print_r($response);
						echo count($response);
						echo $_GET["q"];*/

						$counter = 0;

						foreach($response as $user){

							if($user->id != $curr_user){

								if($counter % 2 == 0){
									$class_string = "result-wrapper even";
								}else{
									$class_string = "result-wrapper odd";
								}

								echo"<div class='$class_string'>";

								echo"<span> $user->username </span>";

								echo "<button onclick='toProfile($user->id)'> Their Profile </button>";

								echo "</div>";

								$counter++;
							}
						}

					?>

				</div> <!--END OF RESULTS WRAPPER -->

			</div><!--END OF MAIN SECTION -->

		</div><!--END OF PAGE WRAPPER-->

	</body>
</html>
