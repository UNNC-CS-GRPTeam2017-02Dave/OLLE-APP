<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'config.php';
require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

$app->post('/login','login'); /* User login */
$app->post('/signup','signup'); /* User Signup  */
$app->post('/verifyAccount', 'verifyAccount');
$app->post('/postNewTopic','postNewTopic');
$app->post('/postNewTopicReply','postNewTopicReply');
$app->post('/getForumReply','getForumReply');
$app->post('/getPostedReply','getPostedReply');

$app->get('/getTopics','getTopics');

//$app->get('/getFeed','getFeed'); /* User Feeds  */
//$app->post('/feed','feed'); /* User Feeds  */
//$app->post('/feedUpdate','feedUpdate'); /* User Feeds  */
//$app->post('/feedDelete','feedDelete'); /* User Feeds  */
//$app->post('/getImages', 'getImages');

$app->run();

/************************* USER LOGIN *************************************/
function login() {

    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());

    try {
		
        	$db = getDB();
        	$userData ='';
        	$sql = "SELECT user_id, name, email, username FROM users WHERE (username=:username or email=:username) and password=:password ";
        	$stmt = $db->prepare($sql);
        	$stmt->bindParam("username", $data->username, PDO::PARAM_STR);
        	$password=hash('sha256',$data->password);
        	$stmt->bindParam("password", $password, PDO::PARAM_STR);
        	$stmt->execute();
        	//$mainCount=$stmt->rowCount();
       		$userData = $stmt->fetch(PDO::FETCH_OBJ);

        	if(!empty($userData))
        	{
            	$user_id=$userData->user_id;
            	$userData->token = apiToken($user_id);
       		}

       		$db = null;
         	if($userData){
               $userData = json_encode($userData);
               // echo imprime y retorna la string a result
                echo '{"userData": ' .$userData . '}';
            } else {
               echo '{"error":{"text":"Bad request wrong username and password"}}';
            }
    	}
    	catch(PDOException $e) {
        	echo '{"error":{"text":'. $e->getMessage() .'}}';
    	}
}

function postNewTopicReply(){
	$request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
	
	$topic_id = $data->topic_id;
	$username = $data->username;
	$parent_id = $data->parent_id;

	date_default_timezone_set('PRC'); 
	$post_date = date("Y-m-d H:i:s");

	if(!$parent_id)
	{
		$parent_id = 0;
	}

	$user_post=filter_var($data->user_post, FILTER_SANITIZE_STRING);
	if((strlen($user_post) > 0 and strlen($user_post) < 500))
	{
		try {		
				$db = getDB();       		
				$sql="INSERT INTO posts(topic_id,username,user_post,parent_id,post_date)
										VALUES
										(:topic_id,:username,:user_post,:parent_id, :post_date)";

				$stmt = $db->prepare($sql);
		
				$stmt->bindParam("topic_id", $topic_id,PDO::PARAM_STR);
				$stmt->bindParam("username", $username,PDO::PARAM_STR);
				$stmt->bindParam("user_post", $user_post,PDO::PARAM_STR);
				$stmt->bindParam("parent_id", $parent_id,PDO::PARAM_INT);
				$stmt->bindParam("post_date", $post_date,PDO::PARAM_STR);
	
				$stmt->execute();	
		
				$db = null;
		
				echo '{"success":"Hello Tingting"}';
			}
			catch(PDOException $e) {
				echo '{"error":{"text":'. $e->getMessage() .'}}';
			}
	}else{
		echo '{"error1":{"text":"Invalid reply."}}';
	}
}

function postNewTopic(){
	$request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
	
	$topic_week=$data->topic_week;	

	if(is_numeric($topic_week))
	{
		$topic_title = filter_var($data->topic_title, FILTER_SANITIZE_STRING);
		if((strlen($topic_title) > 0 and strlen($topic_title) < 300))
		{
			$topic_detail = filter_var($data->topic_detail, FILTER_SANITIZE_STRING);
			if((strlen($topic_detail) > 0 and strlen($topic_detail) < 500))
			{
				$topic_date=$data->topic_date;			
				$user_id=$data->user_id;			
				$post_username = filter_var($data->post_username, FILTER_SANITIZE_STRING);
						
				try {		
						$db = getDB();       		
						$sql="INSERT INTO topics(topic_title,topic_detail,topic_date,topic_week,post_username, user_id)
												VALUES
												(:topic_title,:topic_detail,:topic_date,:topic_week,:post_username,:user_id)";

						$stmt = $db->prepare($sql);
		
						$stmt->bindParam("topic_title", $topic_title,PDO::PARAM_STR);
						$stmt->bindParam("topic_detail", $topic_detail,PDO::PARAM_STR);
						$stmt->bindParam("topic_date", $topic_date,PDO::PARAM_STR);
						$stmt->bindParam("topic_week", $topic_week,PDO::PARAM_INT);
						$stmt->bindParam("post_username", $post_username,PDO::PARAM_STR);
						$stmt->bindParam("user_id", $user_id,PDO::PARAM_STR);
	
						$stmt->execute();	
		
						$db = null;
		
						echo '{"success":"Hello Tingting"}';
					}
					catch(PDOException $e) {
						echo '{"error":{"text":'. $e->getMessage() .'}}';
					}			
			}
			else
			{
				echo '{"error3":{"text":"Invalid detail."}}';
			}
		}	
		else
		{
			echo '{"error2":{"text":"Invalid title."}}';
		}

	}
	else
	{
		echo '{"error1":{"text":"Invalid week number."}}';
	}		
}

function getForumReply(){	

	$request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());

    $topic_id = intval($data);
   
	try {       
            $ForumReplyData = '';
            $db = getDB();

            $sql = "SELECT * FROM posts WHERE topic_id= :topic_id AND parent_id = 0";           

            $stmt = $db->prepare($sql); 
            $stmt->bindParam("topic_id", $topic_id, PDO::PARAM_INT);
             
            $stmt->execute();

            $ForumReplyData = $stmt->fetchAll(PDO::FETCH_OBJ);

            $db = null;


            if($ForumReplyData){
				echo '{"ForumReplyData": ' . json_encode($ForumReplyData) . '}';
            }else{
				echo '{"ForumReplyData": ""}';
			}
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }	
}

function getPostedReply(){
	$request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());

    $parent_id = intval($data);
  
	try {       
            $PostedReplyData = '';
            $db = getDB();

            $sql = "SELECT * FROM posts WHERE parent_id= :parent_id";           

            $stmt = $db->prepare($sql); 
            $stmt->bindParam("parent_id", $parent_id, PDO::PARAM_INT);
             
            $stmt->execute();

            $PostedReplyData = $stmt->fetchAll(PDO::FETCH_OBJ);

            $db = null;
            
            if($PostedReplyData){
				echo '{"PostedReplyData": ' . json_encode($PostedReplyData) . '}';
            }else{
				echo '{"PostedReplyData": ""}';
			}
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }	
}


function getTopics(){	
	try {

        if(1){
            $TopicsData = '';
            $db = getDB();

                $sql = "SELECT * FROM topics ORDER BY topic_week DESC";
                $stmt = $db->prepare($sql);
                $stmt->bindParam("topic_title", $topic_title, PDO::PARAM_STR);
                $stmt->bindParam("topic_username", $topic_username, PDO::PARAM_STR);

            	$stmt->execute();
            	$TopicsData = $stmt->fetchAll(PDO::FETCH_OBJ);

           		$db = null;

            if($TopicsData){
				echo '{"TopicsData": ' . json_encode($TopicsData) . '}';
            }else{
				echo '{"TopicsData": ""}';
			}
        } else{
            echo '{"error":{"text":"No access"}}';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }	
}

/* I should check what variables are necessary and which others can be gotten rid off.*/
/************************* USER REGISTRATION *************************************/
function signup() {
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
	
    $email=$data->email;
    $name=$data->name;
    $surname=$data->surname;
    $username=$data->username;
    $password=$data->password;

    try {

        // Tests
        /*$username_check = preg_match('~^[A-Za-z0-9_]{3,20}$~i', $username);
        $email_check = preg_match('~^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.([a-zA-Z]{2,4})$~i', $email);
        $password_check = preg_match('~^[A-Za-z0-9!@#$%^&*()_]{6,20}$~i', $password);

        // Check for 'nottingham' email
        $isValidEmail = strpos($email, "@nottingham.edu.cn");

        if (strlen(trim($username))>0 && strlen(trim($password))>0 && strlen(trim($email))>0 && $email_check>0 && $username_check>0 && $password_check>0 && $isValidEmail>0)*/

        // Check for 'nottingham' email
        $isNottinghamEmail = strpos($email, "@nottingham.edu.cn");
        if($isNottinghamEmail>0)
        {
            // Check username already exist in database
            $db = getDB();
            $userData = '';
            $sql = "SELECT user_id FROM users WHERE username=:username";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("username", $username,PDO::PARAM_STR);
            $stmt->execute();
            $isValidUsername=$stmt->rowCount();

            if($isValidUsername==0)
            {
                // Check email already exist in database
                $sql1 = "SELECT user_id FROM users WHERE email=:email";
                $stmt1 = $db->prepare($sql1);
                $stmt1->bindParam("email", $email,PDO::PARAM_STR);
                $stmt1->execute();
                $isValidEmail=$stmt1->rowCount();

                if($isValidEmail==0){
                    /*Password to verify user account via email*/
                    $valCode = rand(100000, 999999);

                    /*Inserting user values into DB*/
                    $sql2="INSERT INTO users(username,password,email,name, surname, user_validation_code)VALUES(:username,:password,:email,:name,:surname,:user_validation_code)";
                    $stmt2 = $db->prepare($sql2);
                    $stmt2->bindParam("username", $username,PDO::PARAM_STR);
                    $password=hash('sha256',$data->password);
                    $stmt2->bindParam("password", $password,PDO::PARAM_STR);
                    $stmt2->bindParam("email", $email,PDO::PARAM_STR);
                    $stmt2->bindParam("name", $name,PDO::PARAM_STR);
                    $stmt2->bindParam("surname", $surname,PDO::PARAM_STR);
                    $stmt2->bindParam("user_validation_code", $valCode,PDO::PARAM_STR);
                    $stmt2->execute();

                    //echo '{"emailSent":{"text":"Email sent successfuly."}}';
                    // sending $email avoids sending the password.
                    sendEmail($email, $valCode);

                } else {
                    // Invalid email
                    echo '{"error3":{"text":"Repeated email."}}';
                }


            } else{
                // Invalid Username
                echo '{"error2":{"text":"Repeated username."}}';
            }

        }
        else{
            echo '{"error1":{"text":"Not a nottingham email."}}';
        }
        $db = null;
    }
    catch(PDOException $e) {
        echo '{"errorHard":{"text":'. $e->getMessage() .'}}';
    }
}

function generateNewValidationCode () {
  $request = \Slim\Slim::getInstance()->request();
  $email = json_decode($request->getBody());
  $valCode = rand(100000, 999999);

  try {
      // Update validation code in the database
      $db = getDB();
      $sql = "UPDATE users SET user_validation_code:=valCode WHERE email:=email";
      $stmt = $db->prepare($sql);
      $stmt->bindParam("valCode", $valCode);
      $stmt->bindParam("email", $email);
      $stmt->execute();
      $db = null;

      //send email & code to email
      sendEmail($email, $valCode);

  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
  }

}

function verifyAccount () {
  $request = \Slim\Slim::getInstance()->request();
  $data = json_decode($request->getBody());
  $valCode = $data->valCode;
  $email = $data->email;

  try {
      $db = getDB();

      // Query the validation code stored in DB for the given email.
      $sql = "SELECT user_validation_code, user_account_status FROM users WHERE email=:email";
      $stmt = $db->prepare($sql);
      $stmt->bindParam("email", $email,PDO::PARAM_STR);
      $stmt->execute();

      $userCode = $stmt->fetch(PDO::FETCH_OBJ);

      // Case where queried code equals the validation code typed by the user and the account has not been previously validated
      if( $userCode->user_validation_code == $valCode    &&    $userCode->user_account_status === "not validated" ){
          //echo '{"wtf":{"text":"Happy days."}}';
          // Validate user.
          $sql1 = "UPDATE users SET user_account_status = 'validated' WHERE email=:email";
          $stmt1 = $db->prepare($sql1);
          $stmt1->bindParam("email", $email, PDO::PARAM_STR);
          $stmt1->execute();

          $userData=internalUserDetails($email);
          $userData = json_encode($userData);
          echo  '{"success":' .$userData .'}';

      // Case where account has already been validated (can this scenario occur?)
    } else if ( $userCode->user_account_status === "validated" ) {

      // Incorrect validation user input.
      } else {

          echo '{"error":{"text":"Incorrect validation code."}}';
      }

      $db = null;

  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}

function sendEmail($email, $valCode){
  $userData = internalUserDetails($email);

  $email_body = "
  <p>Hi ".$userData->username."!,</p><br></br>
  <p>Thank you for registering into the OLLE language learning app. We hope it aids you to improve your language learning skills and meet new people. Please open this link to verify your account: " .$valCode."</p><br></br>
  <p> On completion, you can log-in into the app with the password you provided. </p><br></br>
  <p>Happy Language Learning,<br/>OLLE/VAV Team</p>";


// add comments from PHPMailer
  $mail = new PHPMailer;
  //echo '{"emailSent":{"text":"Email sent successfuly."}}';
  $mail->SMTPDebug = 0;
  $mail->isSMTP();
  $mail->Host = /*'smtp-mail.outlook.com'*/'smtp.live.com';
  $mail->SMTPAuth = true;
  $mail->Username = 'hengaoxinxiendao@outlook.com';
  $mail->Password = 'Sayaman999';
  $mail->SMTPSecure = 'tls';
  $mail->Port = 587;



  $mail->setFrom('hengaoxinxiendao@outlook.com');
  $mail->AddAddress($email, $userData->name);
  //$mail->WordWrap = 100;
  $mail->IsHTML(true);       // set message type to html
  $mail->Subject = 'Account Verification';
  $mail->Body = $email_body;

  // Check for succesful send of email
  if($mail->Send()){
      echo '{"emailSent":{"text":"Email sent successfuly."}}';


  } else {
      //echo (extension_loaded('openssl')?'SSL loaded':'SSL not loaded')."\n";
      echo '{"emailFailed":'.$mail->ErrorInfo.'}';
      //echo '{"emailSent":{"text":"Email sent successfuly."}}';
  }

}


/*function email() {
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $email=$data->email;

    try {

        $email_check = preg_match('~^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.([a-zA-Z]{2,4})$~i', $email);

        if (strlen(trim($email))>0 && $email_check>0)
        {
            $db = getDB();
            $userData = '';
            $sql = "SELECT user_id FROM emailUsers WHERE email=:email";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("email", $email,PDO::PARAM_STR);
            $stmt->execute();
            $mainCount=$stmt->rowCount();
            $created=time();
            if($mainCount==0)
            {

                /*Inserting user values*/
/*                $sql1="INSERT INTO emailUsers(email)VALUES(:email)";
                $stmt1 = $db->prepare($sql1);
                $stmt1->bindParam("email", $email,PDO::PARAM_STR);
                $stmt1->execute();


            }
            $userData=internalEmailDetails($email);
            $db = null;
            if($userData){
               $userData = json_encode($userData);
                echo '{"userData": ' .$userData . '}';
            } else {
               echo '{"error":{"text":"Enter valid dataaaa"}}';
            }
        }
        else{
            echo '{"error":{"text":"Enter valid data"}}';
        }
    }

    catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}


/* ### internal Username Details ### */
function internalUserDetails($input) {

    try {
        $db = getDB();
        $sql = "SELECT user_id, name, email, username, surname, user_account_status FROM users WHERE username=:input or email=:input";
        $stmt = $db->prepare($sql);
        $stmt->bindParam("input", $input,PDO::PARAM_STR);
        $stmt->execute();
        $usernameDetails = $stmt->fetch(PDO::FETCH_OBJ);
        $usernameDetails->token = apiToken($usernameDetails->user_id);
        $db = null;
        return $usernameDetails;

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}

/*function getFeed(){


    try {

        if(1){
            $feedData = '';
            $db = getDB();

                $sql = "SELECT * FROM feed  ORDER BY feed_id DESC LIMIT 15";
                $stmt = $db->prepare($sql);
                $stmt->bindParam("user_id", $user_id, PDO::PARAM_INT);
                $stmt->bindParam("lastCreated", $lastCreated, PDO::PARAM_STR);

            $stmt->execute();
            $feedData = $stmt->fetchAll(PDO::FETCH_OBJ);

            $db = null;

            if($feedData)
            echo '{"feedData": ' . json_encode($feedData) . '}';
            else
            echo '{"feedData": ""}';
        } else{
            echo '{"error":{"text":"No access"}}';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}

function feed(){
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $user_id=$data->user_id;
    $token=$data->token;
    $lastCreated = $data->lastCreated;
    $systemToken=apiToken($user_id);

    try {

        if($systemToken == $token){
            $feedData = '';
            $db = getDB();
            if($lastCreated){
                $sql = "SELECT * FROM feed WHERE user_id_fk=:user_id AND created < :lastCreated ORDER BY feed_id DESC LIMIT 5";
                $stmt = $db->prepare($sql);
                $stmt->bindParam("user_id", $user_id, PDO::PARAM_INT);
                $stmt->bindParam("lastCreated", $lastCreated, PDO::PARAM_STR);
            }
            else{
                $sql = "SELECT * FROM feed WHERE user_id_fk=:user_id ORDER BY feed_id DESC LIMIT 5";
                $stmt = $db->prepare($sql);
                $stmt->bindParam("user_id", $user_id, PDO::PARAM_INT);
            }
            $stmt->execute();
            $feedData = $stmt->fetchAll(PDO::FETCH_OBJ);

            $db = null;

            if($feedData)
            echo '{"feedData": ' . json_encode($feedData) . '}';
            else
            echo '{"feedData": ""}';
        } else{
            echo '{"error":{"text":"No access"}}';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}

function feedUpdate(){

    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $user_id=$data->user_id;
    $token=$data->token;
    $feed=$data->feed;

    $systemToken=apiToken($user_id);

    try {

        if($systemToken == $token){


            $feedData = '';
            $db = getDB();
            $sql = "INSERT INTO feed ( feed, created, user_id_fk) VALUES (:feed,:created,:user_id)";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("feed", $feed, PDO::PARAM_STR);
            $stmt->bindParam("user_id", $user_id, PDO::PARAM_INT);
            $created = time();
            $stmt->bindParam("created", $created, PDO::PARAM_INT);
            $stmt->execute();



            $sql1 = "SELECT * FROM feed WHERE user_id_fk=:user_id ORDER BY feed_id DESC LIMIT 1";
            $stmt1 = $db->prepare($sql1);
            $stmt1->bindParam("user_id", $user_id, PDO::PARAM_INT);
            $stmt1->execute();
            $feedData = $stmt1->fetch(PDO::FETCH_OBJ);


            $db = null;
            echo '{"feedData": ' . json_encode($feedData) . '}';
        } else{
            echo '{"error":{"text":"No access"}}';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}



function feedDelete(){
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $user_id=$data->user_id;
    $token=$data->token;
    $feed_id=$data->feed_id;

    $systemToken=apiToken($user_id);

    try {

        if($systemToken == $token){
            $feedData = '';
            $db = getDB();
            $sql = "Delete FROM feed WHERE user_id_fk=:user_id AND feed_id=:feed_id";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("user_id", $user_id, PDO::PARAM_INT);
            $stmt->bindParam("feed_id", $feed_id, PDO::PARAM_INT);
            $stmt->execute();


            $db = null;
            echo '{"success":{"text":"Feed deleted"}}';
        } else{
            echo '{"error":{"text":"No access"}}';
        }

    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }

}
$app->post('/userImage','userImage'); /* User Details */
/*function userImage(){
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $user_id=$data->user_id;
    $token=$data->token;
    $imageB64=$data->imageB64;
    $systemToken=apiToken($user_id);
    try {
        if(1){
            $db = getDB();
            $sql = "INSERT INTO imagesData(b64,user_id_fk) VALUES(:b64,:user_id)";
            $stmt = $db->prepare($sql);
            $stmt->bindParam("user_id", $user_id, PDO::PARAM_INT);
            $stmt->bindParam("b64", $imageB64, PDO::PARAM_STR);
            $stmt->execute();
            $db = null;
            echo '{"success":{"status":"uploaded"}}';
        } else{
            echo '{"error":{"text":"No access"}}';
        }
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}

$app->post('/getImages', 'getImages');
function getImages(){
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    $user_id=$data->user_id;
    $token=$data->token;

    $systemToken=apiToken($user_id);
    try {
        if(1){
            $db = getDB();
            $sql = "SELECT b64 FROM imagesData";
            $stmt = $db->prepare($sql);

            $stmt->execute();
            $imageData = $stmt->fetchAll(PDO::FETCH_OBJ);
            $db = null;
            echo '{"imageData": ' . json_encode($imageData) . '}';
        } else{
            echo '{"error":{"text":"No access"}}';
        }
    } catch(PDOException $e) {
        echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
}*/


?>

