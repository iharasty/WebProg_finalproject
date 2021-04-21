<?php

session_start();
require_once('DBfuncs.php');

?><html>
		<head>
			<link rel='stylesheet' href='./static/css/signup.css'/>


    </head>
    <body>
		<div class='page-wrapper'>
			<div class='form-wrapper'>
			<div class='form-modal'>
				<?php
					if (isset($_GET['status']) && $_GET['status'] == "success"){
						echo "Successfully made account!!";
					}
					if (isset($_GET['status']) && $_GET['status'] == "unsuccess"){
						echo "Something went wrong...";
					}
				?>
			</div>
      <form action='./signup.php' method='POST'>
        <div class='input-wrapper'>
	        <label for='username'>Username</label>
	        <input type='text' id='username' name = 'username' value=''
	        />
				</div>
        <div class='input-wrapper'>
	        <label for='email'>Email</label>
	        <input type='text' id='email' name = 'email' value=''
	        />
				</div>
        <div class='input-wrapper'>
	        <label for='password'>Password</label>
	        <input type='password' id='password' name = 'password' value=''
	        />
				</div>
				<div class='input-wrapper'>
	        <label for='conf-password'>Confirm Password</label>
	        <input type='password' id='conf-password' name = 'conf-password' value=''
	        />
        </div>

				<div class='input-wrapper'>
        	<input type='submit' value='submit'/>
				</div>

				<br/>

				<?php

				//start post clause
				if ( isset($_POST['username'])   &&  !empty($_POST['username'])   &&
				     isset($_POST['password'])  &&  !empty($_POST['password'])		&&
						 isset($_POST['conf-password'])  &&  !empty($_POST['conf-password'])		&&
						 isset($_POST['email'])  &&  !empty($_POST['email']) ){

							$dbh = connectDB();
							if(checkUserNameEmailTaken($dbh,$_POST["username"],$_POST["email"])){
								header('location: signup.php?status=unsuccess');
							}else{
								addNewUser($dbh, $_POST['username'], $_POST['email'], $_POST['password']);
								header('location: signup.php?status=success');
						}

				} //end post statement


					//header('location: home.php');
				?>
      </form>
			</div>
		</div>
    </body>
</html>
