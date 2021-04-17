<html>
	<head>

    </head>

    <body>

      <form action='./login.php' action='GET'>
        
        <label for='email'>Email</label>
        <input type='text' id='email' name = 'email' value=''
        />

        <label for='password'>Password</label>
        <input type='text' id='password' name = 'password' value=''
        />
        
        <input type='submit' value='submit'/>
				<br/>
				<?php
					$email = $_GET["email"];
					$pass = $_GET["password"];
					echo "$email, $pass";
				?>

      </form>


    </body>
</html>
