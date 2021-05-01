<?php

session_start();

?>

<?php

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

function getUnacceptedGames($dbh, $currid){

	try{
		$query = "SELECT * FROM pvpgames JOIN users " .
						 "WHERE pvpgames.uidaccept=:currid AND pvpgames.accepted=0 " .
						 "AND pvpgames.uidinit = users.id";

		$stmt = $dbh->prepare($query);

		$stmt->bindParam('currid', $currid);
		$stmt->execute();
		$db_obj = $stmt->fetchAll(PDO::FETCH_OBJ);
		$stmt = null;

		return $db_obj;

	}catch(PDOException $e){
		die ('PDO error in getUnnaceptedGames: ' . $e->getMessage() );
	}
}

function getAcceptedGames($dbh, $currid){

  try{
		//get the games & opposing user information from the
		//the games that I've initiated
    $query = "SELECT * FROM pvpgames JOIN users " .
						 "WHERE gameid IN " .
						 "(SELECT gameid FROM pvpgames " .
						 "WHERE uidaccept=:currid and accepted=1) " .
						 "AND users.id = :currid" ;

    $stmt = $dbh->prepare($query);

    $stmt->bindParam('currid', $currid);
    $stmt->execute();
    $db_obj = $stmt->fetchAll(PDO::FETCH_OBJ);
    $stmt = null;

    return $db_obj;

  }catch(PDOException $e){
    die ('PDO error in getAcceptedGames: ' . $e->getMessage() );
  }
}

function getFriends($dbh, $currid){

	try{

		$query = "SELECT * FROM users WHERE " .
						 	"id IN ( SELECT uidaccept FROM friends " .
					 	 	"WHERE uidinit=:currid AND accepted=1) " .
						 "OR id IN " . 
						 	"( SELECT uidinit FROM friends " .
					 	 	"WHERE uidaccept=:currid AND accepted=1) " ;
		$stmt = $dbh->prepare($query);

		$stmt->bindParam('currid',$currid);

		$stmt->execute();
		$db_obj = $stmt->fetchAll(PDO::FETCH_OBJ);
		$stmt = null;

		return $db_obj;


	}catch(PDOException $e){
		die('PDO error in getFriends() ' . $e->getMessage());
	}

}

function getUnacceptedFriends($dbh, $currid){

	try{

		$query = "SELECT * FROM users WHERE " .
						 	"id IN ( SELECT uidinit FROM friends " .
					 	 	"WHERE uidaccept=:currid AND accepted=0) " ;
		$stmt = $dbh->prepare($query);

		$stmt->bindParam('currid',$currid);

		$stmt->execute();
		$db_obj = $stmt->fetchAll(PDO::FETCH_OBJ);
		$stmt = null;

		return $db_obj;


	}catch(PDOException $e){
		die('PDO error in getFriends() ' . $e->getMessage());
	}
}

function getUserInfo($dbh, $target_uid){

	try{
		$query = "SELECT * FROM users " .
					 	 "WHERE id=:target_uid";
		$stmt = $dbh->prepare($query);

		$stmt->bindParam('target_uid',$target_uid);

		$stmt->execute();
		$db_obj = $stmt->fetchAll(PDO::FETCH_OBJ);
		$stmt = null;

		return $db_obj;


	}catch(PDOException $e){
		die('PDO error in getFriends() ' . $e->getMessage());
	}
}

/*
Returns:
	3 if both are friends
	2 if YOU(curr_uid) asked THEM(target_uid) to no response
	1 if they invited YOU(curr_id) and you haven't gotten back to them
  0 none of the above, not friends and not requested
*/

function isFriend($dbh, $target_uid, $curr_uid){

	try{

		$query = "SELECT * FROM friends " .
					 	 "WHERE (uidinit=:target_uid AND uidaccept=:curr_uid) " .
						 "OR (uidinit=:curr_uid AND uidaccept=:target_uid)";

		$stmt = $dbh->prepare($query);

		$stmt->bindParam('target_uid',$target_uid);
		$stmt->bindParam('curr_uid',$curr_uid);

		$stmt->execute();
		$db_obj = $stmt->fetchAll(PDO::FETCH_OBJ);

		$stmt = null;

		if(count($db_obj) > 0){
			if($db_obj[0]->accepted == 1){
				return 3;
			}elseif($db_obj[0]->uidinit == $curr_uid ){
				return 2;
			}else{
				return 1;
			}
		}else{
			return 0;
		}


	}catch(PDOException $e){
		die('PDO error in getFriends() ' . $e->getMessage());
	}
}

function removeFriend($dbh, $curr_uid, $target_uid){

	try{

		$query = "DELETE FROM friends " .
					 	 "WHERE (uidinit=:target_uid AND uidaccept=:curr_uid) " .
						 "OR (uidinit=:curr_uid AND uidaccept=:target_uid)";

		$stmt = $dbh->prepare($query);

		$stmt->bindParam('target_uid',$target_uid);
		$stmt->bindParam('curr_uid',$curr_uid);

		$stmt->execute();
		$db_obj = $stmt->fetchAll(PDO::FETCH_OBJ);
		$stmt = null;

	}catch(PDOException $e){
		die('PDO error in getFriends() ' . $e->getMessage());
	}
}

function addFriend($dbh, $curr_uid, $target_uid){

	try{

		$query = "INSERT INTO friends (uidinit, uidaccept) VALUES (:curr_uid, :target_uid)";

		$stmt = $dbh->prepare($query);

		$stmt->bindParam('target_uid',$target_uid);
		$stmt->bindParam('curr_uid',$curr_uid);

		$stmt->execute();
		$db_obj = $stmt->fetchAll(PDO::FETCH_OBJ);
		$stmt = null;

	}catch(PDOException $e){
		die('PDO error in getFriends() ' . $e->getMessage());
	}
}

function acceptFriend($dbh, $curr_uid, $target_uid){

	try{

		$query = "UPDATE friends SET accepted=1 WHERE uidinit=:target_uid AND uidaccept=:curr_uid";

		$stmt = $dbh->prepare($query);

		$stmt->bindParam('target_uid',$target_uid);
		$stmt->bindParam('curr_uid',$curr_uid);

		$stmt->execute();
		$db_obj = $stmt->fetchAll(PDO::FETCH_OBJ);
		$stmt = null;

	}catch(PDOException $e){
		die('PDO error in getFriends() ' . $e->getMessage());
	}
}

function searchUsers($dbh, $search_string){

	try{

		$search_string = "%" . $search_string . "%";
		$query = "SELECT * FROM users " .
					 	 "WHERE username like :search_string";


		$stmt = $dbh->prepare($query);

		$stmt->bindParam('search_string',$search_string);
		//var_dump($stmt);
		$stmt->execute();
		$db_obj = $stmt->fetchAll(PDO::FETCH_OBJ);
		$stmt = null;

		return $db_obj;


	}catch(PDOException $e){
		die('PDO error in getFriends() ' . $e->getMessage());
	}


}

function getGame($dbh, $game_id){

	try{

		$query = "SELECT * FROM users " .
					 	 "WHERE gameid=:game_id";


		$stmt = $dbh->prepare($query);

		$stmt->bindParam('gameid',$game_id);
		//var_dump($stmt);
		$stmt->execute();
		$db_obj = $stmt->fetchAll(PDO::FETCH_OBJ);
		$stmt = null;

		return $db_obj;


	}catch(PDOException $e){
		die('PDO error in getFriends() ' . $e->getMessage());
	}

}

//NOTWORKING
function postGame($dbh, $game_id, $peices){

	try{

		$query = "SELECT * FROM users " .
					 	 "WHERE gameid=:game_id";


		$stmt = $dbh->prepare($query);

		$stmt->bindParam('gameid',$game_id);
		//var_dump($stmt);
		$stmt->execute();
		$db_obj = $stmt->fetchAll(PDO::FETCH_OBJ);
		$stmt = null;

		return $db_obj;


	}catch(PDOException $e){
		die('PDO error in getFriends() ' . $e->getMessage());
	}

}

?>
