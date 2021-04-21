<?php

session_start();

function connectDB(){
	
	$hostname = '127.0.0.1';
	$username = 'harastyj6';
	$password = '1Determinedbird!';

	try{
	  $dbh = new PDO("mysql:host=$hostname;dbname=$username",$username,$password);
	}catch(PDOException $e){
	  die ('PDO error: cannot connect: ' . $e->getMessage() );
	}
	return $dbh;
}

/*Login validation, checks to see if password matches password hash.*/
function checkUserNamePassword($dbh, $username, $password){

	try{

		$query = "SELECT id, password FROM users WHERE username=:username";
		$stmt = $dbh->prepare($query);

		$stmt->bindParam('username',$username);

		$stmt->execute();
		$db_obj = $stmt->fetchAll(PDO::FETCH_OBJ);
		$stmt = null;


		if(count($db_obj) == 1 && password_verify($password, $db_obj[0]->password)){
			$_SESSION['ID'] = $db_obj[0]->id;
			return True;
		}else{
			return False;
		}


	}catch(PDOException $e){
		die('PDO error in checkUserNameEmailValid() ' . $e->getMessage());
	}

}

/*Creates a new user with the passed in information*/
function addNewUser($dbh, $username, $email, $password){

	try{
		$query = "INSERT INTO users (username, email, password)".
						 "VALUES (:username, :email, :password)";

		$password_hash = password_hash($password, PASSWORD_DEFAULT);
		$stmt = $dbh->prepare($query);

		$stmt->bindParam('username', $username);
		$stmt->bindParam('email', $email);
		$stmt->bindParam('password', $password_hash);

		$stmt->execute();
		$stmt = null;
	}catch(PDOException $e){
		die ('PDO error in addNewUser(): ' . $e->getMessage() );
	}

}

/*Returns true if either the username OR email are already in use*/
function checkUserNameEmailTaken($dbh, $username, $email){

	try{
		$query = "SELECT id FROM users".
						 "WHERE usename=:username OR email=:email";

		$stmt = $dbh->prepare($query);

		$stmt->bindParam('username', $username);
		$stmt->bindParam('email', $email);
		$stmt->execute();
		$db_obj = $stmt->fetchAll(PDO::FETCH_OBJ);
		$stmt = null;

		if(count($db_obj) > 0){
			print_r($db_obj);
			return True;
		}else{
			return False;
		}

	}catch(PDOException $e){
		die ('PDO error in addNewUser(): ' . $e->getMessage() );
	}

}


?>
