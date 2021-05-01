<?php
	session_start();
	$curr_user = $_SESSION["ID"];
?>

<div class="nav-bar">

	<div class='website-logo'>IChess</div>

		<div class='nav-bar-right'>
		<a href="./home.php"> Home </a>
		<?php
		echo "<a href='./profile.php?userid=$curr_user'> Profile </a>";
		?>
		<div class='search'>
		  <form action="./search.php" method="GET">
		    <input type='text' name="q" value='search'/>
		    <input type='submit' value='submit' />
		  </form>
		</div>
	</div>

</div>
