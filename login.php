<?php

session_start();
require_once('DBfuncs.php');

?><html>
		<head>
			<link rel='stylesheet' href='./static/css/login.css'/>


    </head>
    <body>
		<div class='page-wrapper'>
			<div class='form-wrapper'>
      <form action='./login.php' method='POST'>
        <div class='input-wrapper'>
	        <label for='username'>Username</label>
	        <input type='text' id='username' name = 'username' value=''
	        />
				</div>

				<div class='input-wrapper'>
	        <label for='password'>Password</label>
	        <input type='text' id='password' name = 'password' value=''
	        />
        </div>

				<div class='input-wrapper'>
        	<input type='submit' value='submit'/>
				</div>

				<br/>
				<?php

					if(isset( $_POST["username"]) && isset( $_POST["username"])  ){
						$username = $_POST["username"];
						$pass = $_POST["password"];

						$dbh = connectDB();
						/*$r = checkUserNamePassword($dbh, $username, $pass);
						echo $r;
						*/
						if(checkUserNamePassword($dbh, $username, $pass)){
								header('location: home.php');
						}else{
								echo "Wrong Login Credentials";
						}
					}

				?>
      </form>
			</div>
		</div>
    </body>
</html>
