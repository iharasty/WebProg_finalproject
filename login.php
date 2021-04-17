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

					$hostname = '127.0.0.1';
					$username = 'harastyj6';
					$password = '1Determinedbird!';

					try{
						$dbh = new PDO("mysql:host=$hostname;dbname=$username",$username,$password);
						echo 'connected to DB!';
					}catch(PDOException $e){
						die ('PDO error: cannot connect: ' . $e->getMessage() );
					}

					echo '<br/>';

					try {
	    				// set up query
				    $phone_query = "SELECT * FROM users WHERE email=:email";
				    // prepare to execute (this is a security precaution)
				    $stmt = $dbh->prepare($phone_query);
						$stmt->bindParam(':email',$email);
				    // run query
				    $stmt->execute();
				    // get all the results from database into array of objects
				    $users = $stmt->fetchAll(PDO::FETCH_OBJ);
				    // release the statement
				    $stmt = null;
						echo "<br/> query successful, $users";
						}
						catch(PDOException $e)
						{
						    die ('PDO error fetching data": ' . $e->getMessage() );
						}


					echo '<br/>';
					echo "here!";
	
					foreach ( $users as $user ){
						echo "here";
						echo " $user->id, $user->password ";
					}

					header('location: home.php');
				?>
      </form>


    </body>
</html>
