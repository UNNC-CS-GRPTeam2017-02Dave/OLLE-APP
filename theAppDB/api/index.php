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

$app->post('/isAdminUser','isAdminUser');

$app->post('/login','login'); /* User login */
$app->post('/signup','signup'); /* User Signup  */
$app->post('/verifyAccount', 'verifyAccount');
$app->post('/generateNewValidationCode', 'generateNewValidationCode');
$app->post('/chat', 'chat');
$app->post('/deleteChat', 'deleteChat');
$app->post('/createChat', 'createChat');
$app->post('/updateChat', 'updateChat');
$app->post('/deleteMessages', 'deleteMessages');
$app->post('/storeMessage', 'storeMessage');
$app->post('/getFirstBatchMessages', 'getFirstBatchMessages');  // Done
$app->post('/getNewMessages', 'getNewMessages');
$app->post('/getBatchMessages', 'getBatchMessages');
$app->post('/getCalendarEvents', 'getCalendarEvents');
$app->post('/storeCalendarEvent', 'storeCalendarEvent');
$app->post('/updateCalendarEvent', 'updateCalendarEvent');
$app->post('/deleteCalendarEvent', 'deleteCalendarEvent');
$app->post('/removeOutdatedCalendarEvents', 'removeOutdatedCalendarEvents');
$app->post('/updateName', 'updateName');
$app->post('/updateSurname', 'updateSurname');
$app->post('/updateUsername', 'updateUsername');
$app->post('/updatePassword', 'updatePassword');
//$app->get('/getFeed','getFeed'); /* User Feeds  */
//$app->post('/feed','feed'); /* User Feeds  */
//$app->post('/feedUpdate','feedUpdate'); /* User Feeds  */
//$app->post('/feedDelete','feedDelete'); /* User Feeds  */
//$app->post('/getImages', 'getImages');
$app->post('/postNewTopic','postNewTopic');
$app->post('/postNewTopicReply','postNewTopicReply');
$app->post('/getForumReply','getForumReply');
$app->post('/removeTopic','removeTopic');
$app->post('/getPostedReply','getPostedReply');
$app->post('/updateTopic','updateTopic');
$app->get('/getTopics','getTopics');


$app->run();


function isValidUser($user_id, $token) {
  return $token === apiToken($user_id);
}

function isAdminUser(){
  $request = \Slim\Slim::getInstance()->request();
  $data = json_decode($request->getBody());
  try {
      // security layer: token auth
    if( isValidUser($data->user_id, $data->token) ){
          $db = getDB();
          $sql = "SELECT user_account_status FROM users WHERE user_id=:user_id";

          $stmt = $db->prepare($sql);
          $stmt->bindParam("user_id", $data->user_id, PDO::PARAM_INT);
          $stmt->execute();

          $fData = $stmt->fetch(PDO::FETCH_OBJ);
          $db = null;

          if( $fData->user_account_status === "admin" ){
            echo '{"true":"Admin"}';

          } else if( $fData->user_account_status === "master" ){
            echo '{"isMaster":"Master"}';

          } else {
            echo '{"false":"Registered"}';
          }

      } else {
          echo '{"LogoutError":"Access Denied"}';
      }


  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}
/************************* USER LOGIN *************************************/
function login() {

    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());

    try {

        $db = getDB();
        $userData ='';
        $sql = "SELECT user_id, name, surname, email, username, language FROM users WHERE (username=:username or email=:username) and password=:password ";
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

/* I should check what variables are necessary and which others can be gotten rid off.*/
/************************* USER REGISTRATION *************************************/
function signup() {
    $request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
    //$user_id=$data->user_id;           // user to verify whether the user already exists. Should you use an alternative way, you might just keep the old, outdated info of the user forever


    try {

        // Tests
        /*$username_check = preg_match('~^[A-Za-z0-9_]{3,20}$~i', $username);
        $email_check = preg_match('~^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.([a-zA-Z]{2,4})$~i', $email);
        $password_check = preg_match('~^[A-Za-z0-9!@#$%^&*()_]{6,20}$~i', $password);


        if (strlen(trim($username))>0 && strlen(trim($password))>0 && strlen(trim($email))>0 && $email_check>0 && $username_check>0 && $password_check>0 && $isValidEmail>0)*/

        // Check for 'nottingham' email


        $isNottinghamEmail = strpos($data->email, "@nottingham.edu.cn");
        if($isNottinghamEmail>0)
        {
            $db = getDB();
            //$userData = '';

            // Check username already exist in database
            $isValidUsername = checkUsername($db, $data->username);
            $isValidEmail    = checkEmail($db, $data->email);

            // user registers for the first time
            if(!$data->user_id){

              // unique username
                if($isValidUsername==0) {

                    // unique email
                    if($isValidEmail==0) {
                        /*Password to verify user account via email*/
                        $data->valCode = rand(100000, 999999);
                        /*Insert user values into DB*/
                        insertUserData($db, $data);
                        /* Prepare Email. */
                        sendEmail($data->email, $data->valCode);

                    } else {
                        // Invalid email
                        echo '{"error3":{"text":"Repeated email."}}';
                    }
                }else{
                    // Invalid Username
                    echo '{"error2":{"text":"Repeated username."}}';
                }
            }
            // user cancelled code validation step, and re-signsup
            else {

                // get old email given its id
                $oldData = getOldUserData($db, $data->user_id);

                // user changes username
                if($oldData->username !== $data->username) {
                    $isValidUsername = checkUsername($db, $data->username);

                    if($isValidUsername==0){

                        // user changes email info
                        if( $data->email !== $oldData->email ) {
                            // re-check unique email
                            $isValidEmail = checkEmail($db, $data->email);

                            // update info if unique email
                            if($isValidEmail==0){
                                $data->valCode = rand(100000, 999999);
                                updateUserData($db, $data);
                                sendEmail($data->email, $data->valCode);

                            // repeated email
                            } else {
                                echo '{"error3":{"text":"Repeated email."}}';
                            }

                        // user has same email implies just updating parameters
                        } else {
                            $data->valCode = $oldData->user_validation_code;
                            updateUserData($db, $data);
                            $userData = json_encode($data);
                            echo  '{"userData":' .$userData .'}';
                        }

                    // using username from already registered user.
                    } else {
                        echo '{"error2":{"text":"Repeated username."}}';
                    }

                // user changes email
                } else if ( $data->email !== $oldData->email ) {
                    // re-check unique email
                    $isValidEmail = checkEmail($db, $data->email);

                    // update info if unique email
                    if($isValidEmail==0){
                        $data->valCode = rand(100000, 999999);
                        updateUserData($db, $data);
                        sendEmail($data->email, $data->valCode);

                    // repeated email
                    } else {
                        echo '{"error3":{"text":"Repeated email."}}';
                    }

                // user makes no changes or changes the name, surname or password
                } else {
                    $data->valCode = $oldData->user_validation_code;
                    updateUserData($db, $data);
                    $userData = json_encode($data);
                    echo  '{"userData":' .$userData .'}';
                }
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

// Resend verification code to user
function generateNewValidationCode () {
  $request = \Slim\Slim::getInstance()->request();
  $email = json_decode($request->getBody());
  $valCode = rand(100000, 999999);

  try {
      // Update validation code in the database
      $db = getDB();
      $sql = "UPDATE users SET user_validation_code=:valCode WHERE email=:email";
      $stmt = $db->prepare($sql);
      $stmt->bindParam("valCode", $valCode, PDO::PARAM_INT);
      $stmt->bindParam("email", $email, PDO::PARAM_STR);
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
      if( $userCode->user_validation_code == $valCode    &&    $userCode->user_account_status === "registered" ){

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
  <p>Hi ".$userData->username."!</p><br></br>
  <p>Thank you for registering into the OLLE language learning app. We hope it aids you to improve your language learning skills and meet new people. Please open this link to verify your account: " .$valCode."</p><br></br>
  <p> On completion, you can log-in into the app with the password you provided. </p><br></br>
  <p>Happy Language Learning,<br/>OLLE/VAV Team</p>";


  // add comments from PHPMailer
  $mail = new PHPMailer;
  //echo '{"userData":{"text":"Email sent successfuly."}}';
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
      //echo '{"emailSent":{"text":"Email sent successfuly."}}';
      $userData = json_encode($userData);
      echo  '{"userData":' .$userData .'}';

  } else {
      //echo (extension_loaded('openssl')?'SSL loaded':'SSL not loaded')."\n";
      echo '{"emailFailed":'.$mail->ErrorInfo.'}';
      //echo '{"emailSent":{"text":"Email sent successfuly."}}';
  }

}

/*############################# CHAT SYSTEM ##########################*/
function chat() {

  try {
      $db = getDB();
      $sql = "SELECT * FROM chat_languages";
      $stmt = $db->prepare($sql);
      $stmt->execute();

      // fetchAll gets all elements in the array, while fetch just gets 1
      $fData = $stmt->fetchAll(PDO::FETCH_OBJ);
      $fData = json_encode($fData);
      $db = null;
      echo '{"fData":' .$fData.'}';

  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}

function deleteChat() {
  $request = \Slim\Slim::getInstance()->request();
  $data = json_decode($request->getBody());

  try {
      $db = getDB();

      // should add foreign keys...
      $sql = "DELETE FROM chat_languages WHERE chat_id=:chat_id AND (SELECT user_account_status FROM users WHERE user_id=:user_id)= 'admin'";
      $stmt = $db->prepare($sql);
      $stmt->bindParam("chat_id", $data->chat_id, PDO::PARAM_INT);
      $stmt->bindParam("user_id", $data->user_id, PDO::PARAM_INT);
      $stmt->execute();

      $sql = "DELETE FROM chat_message WHERE chat_id=:chat_id AND (SELECT user_account_status FROM users WHERE user_id=:user_id)= 'admin'";
      $stmt = $db->prepare($sql);
      $stmt->bindParam("chat_id", $data->chat_id, PDO::PARAM_INT);
      $stmt->bindParam("user_id", $data->user_id, PDO::PARAM_INT);
      $stmt->execute();

      $db = null;
      echo '{"removed":"Chat has been removed."}';

  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
  }

}

function createChat() {
  $request = \Slim\Slim::getInstance()->request();
  $data = json_decode($request->getBody());

  try {
      $db = getDB();

      // need to check it is an admin user
      $sql = "INSERT INTO chat_languages(language, topic, description) VALUES (:language, :topic, :description)";
      $stmt = $db->prepare($sql);
      $stmt->bindParam("language", $data->language, PDO::PARAM_STR);
      $stmt->bindParam("topic", $data->topic, PDO::PARAM_STR);
      $stmt->bindParam("description", $data->description, PDO::PARAM_STR);
      $stmt->execute();

      $sql = "SELECT * FROM chat_languages ORDER BY chat_id DESC LIMIT 1";
      $stmt = $db->prepare($sql);
      $stmt->execute();

      // fetchAll gets all elements in the array, while fetch just gets 1
      $fData = $stmt->fetch(PDO::FETCH_OBJ);
      $fData = json_encode($fData);
      $db = null;
      echo '{"fData":' .$fData.'}';

      $db = null;

  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}

function updateChat() {
  $request = \Slim\Slim::getInstance()->request();
  $data = json_decode($request->getBody());

  try {
      $db = getDB();
      // need to check it is an admin user

      $sql = "UPDATE chat_languages SET topic=:topic, description=:description WHERE chat_id=:chat_id AND (SELECT user_account_status FROM users WHERE user_id=:user_id)= 'admin'";
      $stmt = $db->prepare($sql);
      $stmt->bindParam("topic", $data->topic, PDO::PARAM_STR);
      $stmt->bindParam("description", $data->description, PDO::PARAM_STR);
      $stmt->bindParam("chat_id", $data->chat_id, PDO::PARAM_INT);
      $stmt->bindParam("user_id", $data->user_id, PDO::PARAM_INT);
      $stmt->execute();

      $db = null;
      echo '{"updated":"Chat has been updated."}';

  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}

function deleteMessages() {
  $request = \Slim\Slim::getInstance()->request();
  $data = json_decode($request->getBody());

  try {
      $db = getDB();

      // need to check for administrator rights
      $sql = "DELETE FROM chat_message WHERE chat_id=:chat_id";
      $stmt = $db->prepare($sql);
      $stmt->bindParam("chat_id", $data->chat_id, PDO::PARAM_INT);
      $stmt->execute();

      $db = null;
      echo '{"removed":"Messages have been deleted."}';

  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}

function storeMessage() {
  $request = \Slim\Slim::getInstance()->request();
  $data = json_decode($request->getBody());
  $chat_id = $data->chat_id;
  $user_id = $data->user_id;
  $message = $data->message;

  try {
      if( isValidUser($data->user_id, $data->token ) ){
        $db = getDB();
        $sql = "INSERT INTO chat_message(chat_id, user_id, message, time_sent) VALUES (:chat_id, :user_id,:message, NOW())";
        $stmt = $db->prepare($sql);
        //echo "Hello";
        $stmt->bindParam("chat_id", $chat_id, PDO::PARAM_INT);
        $stmt->bindParam("user_id", $user_id, PDO::PARAM_INT);
        $stmt->bindParam("message", $message, PDO::PARAM_STR);
        $stmt->execute();

        echo '{"stored":{"text":"Message stored succesfully"}}';

      } else {
        echo '{"LogoutError":"Access Denied"}';
      }


  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}

function getFirstBatchMessages() {
  $request = \Slim\Slim::getInstance()->request();
  $data = json_decode($request->getBody());

  try {
      // user verified successfuly
    if( isValidUser($data->user_id, $data->token ) ){
          $db = getDB();
          $sql = "SELECT message_id, users.user_id, username, message, time_sent
                  FROM users, ( SELECT *
                                FROM chat_message
                                WHERE chat_id=:chat_id
                                ORDER BY message_id DESC
                                LIMIT 15 ) subquery
                  WHERE users.user_id=subquery.user_id
                  ORDER BY message_id ASC";

          $stmt = $db->prepare($sql);
          $stmt->bindParam("chat_id", $data->chat_id, PDO::PARAM_INT);
          $stmt->execute();

          $fData = json_encode($stmt->fetchAll(PDO::FETCH_OBJ));
          echo '{"fData": ' .$fData. '}';

      } else {
          echo '{"LogoutError":"Access Denied"}';
      }


  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}  // Done

function getBatchMessages() {
  $request = \Slim\Slim::getInstance()->request();
  $data = json_decode($request->getBody());
  try {

      $db = getDB();
      $sql = "SELECT message_id, users.user_id, username, message, time_sent
              FROM users, ( SELECT *
                            FROM chat_message
                            WHERE chat_id=:chat_id AND message_id <:message_id AND time_sent < :time_sent
                            ORDER BY message_id DESC
                            LIMIT 15 ) subquery
              WHERE users.user_id=subquery.user_id
              ORDER BY message_id ASC";

      $stmt = $db->prepare($sql);
      $stmt->bindParam("chat_id", $data->chat_id, PDO::PARAM_INT);
      $stmt->bindParam("message_id", $data->message_id, PDO::PARAM_INT);
      $stmt->bindParam("time_sent", $data->time, PDO::PARAM_STR);
      $stmt->execute();

      $fData = json_encode($stmt->fetchAll(PDO::FETCH_OBJ));
      echo '{"fData": ' .$fData. '}';

  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}

function getNewMessages(){
  $request = \Slim\Slim::getInstance()->request();
  $data = json_decode($request->getBody());
  try {
      // store message into the DB
      $db = getDB();
      $sql = "SELECT message_id, users.user_id, username, message, time_sent FROM users, chat_message WHERE chat_id=:chat_id AND users.user_id=chat_message.user_id AND message_id > :message_id AND time_sent>=:time_sent";

      $stmt = $db->prepare($sql);
      $stmt->bindParam("chat_id", $data->chat_id, PDO::PARAM_INT);
      $stmt->bindParam("message_id", $data->message_id, PDO::PARAM_INT);
      $stmt->bindParam("time_sent", $data->time, PDO::PARAM_STR);
      $stmt->execute();

      $fData = json_encode($stmt->fetchAll(PDO::FETCH_OBJ));
      echo '{"fData": ' .$fData. '}';

  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
  }

}

/*######################END CHAT SYSTEM#############################*/

/*###########################CALENDAR#############################*/
function getCalendarEvents() {
  try {
      // store message into the DB
      $db = getDB();
      $sql = "SELECT * FROM calendar_events";/*WHERE endTime > NOW()";*/
      $stmt = $db->prepare($sql);
      $stmt->execute();
      $fData = $stmt->fetchAll(PDO::FETCH_OBJ);


      $fData = json_encode($fData);
      echo '{"fData": '.$fData.'}';


  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}

function storeCalendarEvent() {
  $request = \Slim\Slim::getInstance()->request();
  $data = json_decode($request->getBody());
  $title = $data->title;
  $description = $data->description;
  $start_time = $data->startTime;
  $end_time = $data->endTime;

  try {

      $db = getDB();
      $sql = "INSERT INTO calendar_events(title, description, startTime, endTime ) VALUES (:title, :description,:start_time, :end_time)";
      $stmt = $db->prepare($sql);

      //echo "Hello";
      $stmt->bindParam("title", $title, PDO::PARAM_STR);
      $stmt->bindParam("description", $description, PDO::PARAM_STR);
      $stmt->bindParam("start_time", $start_time, PDO::PARAM_STR);
      $stmt->bindParam("end_time", $end_time, PDO::PARAM_STR);
      $stmt->execute();

      $sql = "SELECT event_id FROM calendar_events ORDER BY event_id DESC";
      $stmt = $db->prepare($sql);
      $stmt->execute();
      $event_id = $stmt->fetch(PDO::FETCH_OBJ);
      echo $event_id;
      $db = null;

      echo '{"stored":' .json_encode($event_id). '}';

  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}

function updateCalendarEvent() {
  $request = \Slim\Slim::getInstance()->request();
  $data = json_decode($request->getBody());
  $title = $data->title;
  $description = $data->description;
  $start_time = $data->startTime;
  $end_time = $data->endTime;

  try {

      $db = getDB();

      $sql = "UPDATE calendar_events SET title=:title, description=:description, startTime=:start_time, endTime=:end_time WHERE event_id=:event_id";
      $stmt = $db->prepare($sql);
      $stmt->bindParam("event_id", $data->event_id, PDO::PARAM_INT);

      //echo "Hello";
      $stmt->bindParam("title", $title, PDO::PARAM_STR);
      $stmt->bindParam("description", $description, PDO::PARAM_STR);
      $stmt->bindParam("start_time", $start_time, PDO::PARAM_STR);
      $stmt->bindParam("end_time", $end_time, PDO::PARAM_STR);
      $stmt->execute();

      $sql = "SELECT MAX(event_id) FROM calendar_events";
      $stmt = $db->prepare($sql);
      $stmt->execute();
      $event_id = $stmt->fetch(PDO::FETCH_OBJ);

      $db = null;
      echo '{"updated":"Event stored succesfully"}';


  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}

function deleteCalendarEvent() {
  $request = \Slim\Slim::getInstance()->request();
  $data = json_decode($request->getBody());

  try {
      // security layer: token auth
    if( isValidUser($data->user_id, $data->token) ){
          $db = getDB();
          $sql = "DELETE FROM calendar_events WHERE event_id=:event_id";

          $stmt = $db->prepare($sql);
          $stmt->bindParam("event_id", $data->event_id, PDO::PARAM_INT);
          $stmt->execute();
          $db = null;

          echo '{"deleted":"Event deleted successfuly."}';

      } else {
          echo '{"LogoutError":"Access Denied"}';
      }


  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}

function removeOutdatedCalendarEvents(){
  try {
      $db = getDB();
      $sql = "DELETE FROM calendar_events WHERE endTime < NOW()";
      $stmt = $db->prepare($sql);
      $stmt->execute();

      echo '{"deleted":"Events deleted successfuly."}';


  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}

/*########################END CALENDAR#############################*/

/*#######################FORUM############################*/

function postNewTopic(){
	$request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
	
	if( isValidUser($data->user_id, $data->token) ){

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
						$topic_id = $data->topic_id;
						if($topic_id) 
						{
							$sql="UPDATE topics SET topic_title=:topic_title, topic_detail=:topic_detail, topic_date=:topic_date, topic_week=:topic_week, post_username=:post_username,user_id=:user_id WHERE topic_id = :topic_id";
							$stmt = $db->prepare($sql);
							$stmt->bindParam("topic_id", $topic_id,PDO::PARAM_INT);	
						} 
						else{
							$sql="INSERT INTO topics(topic_title,topic_detail,topic_date,topic_week,post_username,user_id)
												VALUES
												(:topic_title,:topic_detail,:topic_date,:topic_week,:post_username,:user_id)";
						    $stmt = $db->prepare($sql);
						}    		
						

								
						$stmt->bindParam("topic_title", $topic_title,PDO::PARAM_STR);
						$stmt->bindParam("topic_detail", $topic_detail,PDO::PARAM_STR);
						$stmt->bindParam("topic_date", $topic_date,PDO::PARAM_STR);
						$stmt->bindParam("topic_week", $topic_week,PDO::PARAM_INT);
						$stmt->bindParam("post_username", $post_username,PDO::PARAM_STR);
						$stmt->bindParam("user_id", $user_id,PDO::PARAM_STR);
	
						$stmt->execute();

						$sql = "SELECT * FROM topics ORDER BY topic_id DESC LIMIT 1";
      					$stmt = $db->prepare($sql);
      					$stmt->execute();
      					// fetchAll gets all elements in the array, while fetch just gets 1
      					$topicData = $stmt->fetch(PDO::FETCH_OBJ);
      					$topicData = json_encode($topicData);	
		
						$db = null;
		
						echo '{"topicData":' .$topicData.'}';
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
}


function updateTopic(){
	$request = \Slim\Slim::getInstance()->request();
    $data = json_decode($request->getBody());
	
	if( isValidUser($data->user_id, $data->token) ){

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
							$topic_id = $data->topic_id;
						
							$sql="UPDATE topics SET topic_title=:topic_title, topic_detail=:topic_detail, topic_date=:topic_date, topic_week=:topic_week WHERE topic_id = :topic_id";
							$stmt = $db->prepare($sql);
							
							$stmt->bindParam("topic_id", $topic_id,PDO::PARAM_INT);									
							$stmt->bindParam("topic_title", $topic_title,PDO::PARAM_STR);
							$stmt->bindParam("topic_detail", $topic_detail,PDO::PARAM_STR);
							$stmt->bindParam("topic_date", $topic_date,PDO::PARAM_STR);
							$stmt->bindParam("topic_week", $topic_week,PDO::PARAM_INT);
	
							$stmt->execute();

							$sql = "SELECT * FROM topics ORDER BY topic_id DESC LIMIT 1";
      						$stmt = $db->prepare($sql);
      						$stmt->execute();
      						// fetchAll gets all elements in the array, while fetch just gets 1
      						$topicData = $stmt->fetch(PDO::FETCH_OBJ);
      						$topicData = json_encode($topicData);	
		
							$db = null;
		
							echo '{"topicData":' .$topicData.'}';
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
}


function postNewTopicReply(){
	$request = \Slim\Slim::getInstance()->request();
  $data = json_decode($request->getBody());

  $topic_id = $data->topic_id;
  $username = $data->username;
  $language = $data->language;
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
  			$sql="INSERT INTO posts(topic_id,username,language,user_post,parent_id,post_date)
  						VALUES (:topic_id,:username,:language,:user_post,:parent_id, :post_date)";
  			$stmt = $db->prepare($sql);

  			$stmt->bindParam("topic_id", $topic_id,PDO::PARAM_INT);
  			$stmt->bindParam("username", $username,PDO::PARAM_STR);
  			$stmt->bindParam("language", $language, PDO::PARAM_STR);
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

function removeTopic(){
	$request = \Slim\Slim::getInstance()->request();
  $data = json_decode($request->getBody());

	$topic_id=$data;
	try {
				$db = getDB();
				$sql="DELETE FROM topics WHERE topic_id=:topic_id";
				$stmt = $db->prepare($sql);
				$stmt->bindParam("topic_id", $topic_id,PDO::PARAM_INT);
				$stmt->execute();
				$sql2 ="DELETE FROM posts WHERE topic_id=:topic_id";
				$stmt2 = $db->prepare($sql2);
				$stmt2->bindParam("topic_id", $topic_id,PDO::PARAM_INT);
				$stmt2->execute();

				$db = null;
				echo '{"success":"Hello Tingting"}';
		}
		catch(PDOException $e) {
				echo '{"error":{"text":'. $e->getMessage() .'}}';
		}
}

function getPostedReply(){
	$request = \Slim\Slim::getInstance()->request();
  	$data = json_decode($request->getBody());
  	$topic_id = $data->topic_id;
  	$parent_id = $data->parent_id;

	try {
      $PostedReplyData = '';
      $db = getDB();
      $sql = "SELECT * FROM posts WHERE parent_id =:parent_id AND topic_id = :topic_id";
      $stmt = $db->prepare($sql);
      $stmt->bindParam("topic_id", $topic_id, PDO::PARAM_INT);
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

/*#######################END FORUM SYSTEM############################*/

/*#######################SETTINGS############################*/
function updateName() {
  $request = \Slim\Slim::getInstance()->request();
  $data = json_decode($request->getBody());
  try {
      // store message into the DB
      $db = getDB();
      $sql = "UPDATE users SET name=:name WHERE user_id=:user_id";
      $stmt = $db->prepare($sql);
      $stmt->bindParam("name", $data->data, PDO::PARAM_STR);
      $stmt->bindParam("user_id", $data->user_id, PDO::PARAM_INT);
      $stmt->execute();

      $db = null;
      $userData = json_encode(internalUserDetails($data->user_id));
      echo '{"userData": ' .$userData. '}';

  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}

function updateSurname() {
  $request = \Slim\Slim::getInstance()->request();
  $data = json_decode($request->getBody());
  try {
      // store message into the DB
      $db = getDB();
      $sql = "UPDATE users SET surname=:surname WHERE user_id=:user_id";
      $stmt = $db->prepare($sql);
      $stmt->bindParam("surname", $data->data, PDO::PARAM_STR);
      $stmt->bindParam("user_id", $data->user_id, PDO::PARAM_INT);
      $stmt->execute();

      $db = null;
      $userData = json_encode(internalUserDetails($data->user_id));
      echo '{"userData": ' .$userData. '}';
      //echo '{"updateSuccess":"Update was successful."}';

  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}

function updateUsername() {
  $request = \Slim\Slim::getInstance()->request();
  $data = json_decode($request->getBody());
  try {
      // store message into the DB
      $db = getDB();
      $sql = "SELECT username FROM users WHERE user_id != $data->user_id AND username=:username";
      $stmt = $db->prepare($sql);
      $stmt->bindParam("username", $data->data,PDO::PARAM_STR);
      $stmt->execute();
      $isValidUsername = $stmt->rowCount();



      if( $isValidUsername==0){
          $sql = "UPDATE users SET username=:username WHERE user_id=:user_id";
          $stmt = $db->prepare($sql);
          $stmt->bindParam("username", $data->data, PDO::PARAM_STR);
          $stmt->bindParam("user_id", $data->user_id, PDO::PARAM_INT);
          $stmt->execute();
          $db = null;
          $userData = json_encode(internalUserDetails($data->user_id));
          echo '{"userData": ' .$userData. '}';
      }
      else {
          echo '{"error":"Username already exists"}';
      }

  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
  }
}

function updatePassword() {
  $request = \Slim\Slim::getInstance()->request();
  $data = json_decode($request->getBody());
  try {
      // store message into the DB
      $db = getDB();


      $sql = "SELECT * FROM users WHERE user_id=:user_id AND password=:oldPassword";
      $stmt = $db->prepare($sql);
      $stmt->bindParam("user_id", $data->user_id, PDO::PARAM_INT);
      $oldPass = hash('sha256', $data->oldPass);
      $stmt->bindParam("oldPassword", $oldPass, PDO::PARAM_STR);
      $stmt->execute();
      $isValidPassword = $stmt->rowCount();

      // check previous password
      if( $isValidPassword ) {

          $sql = "UPDATE users SET password=:newPassword WHERE user_id=:user_id";
          $stmt = $db->prepare($sql);
          $newPass = hash('sha256', $data->newPass);
          $stmt->bindParam("newPassword", $newPass, PDO::PARAM_STR);
          $stmt->bindParam("user_id", $data->user_id, PDO::PARAM_INT);
          $stmt->execute();
          $db = null;


          echo '{"updateSuccess":"Update was successful."}';

      } else {
          $db = null;
          echo '{"error":"Old password is not correct."}';
      }

  } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
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
        $sql = "SELECT user_id, name, surname, email, username, language FROM users WHERE username=:input OR email=:input OR user_id=:input";
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


/****************************REGISTRATION QUERIES*********************************/
/* Check username already exist in database */
function checkUsername ($db, $username){
  $sql = "SELECT user_id FROM users WHERE username=:username";
  $stmt = $db->prepare($sql);
  $stmt->bindParam("username", $username,PDO::PARAM_STR);
  $stmt->execute();
  return $stmt->rowCount();
}

function checkEmail ($db, $email) {
  $sql1 = "SELECT user_id FROM users WHERE email=:email";
  $stmt1 = $db->prepare($sql1);
  $stmt1->bindParam("email", $email,PDO::PARAM_STR);
  $stmt1->execute();
  return $stmt1->rowCount();
}

/*Insert user values into DB*/
function insertUserData ($db, $data){
  $email=$data->email;
  $name=$data->name;
  $surname=$data->surname;
  $username=$data->username;
  $language=$data->language;
  $valCode=$data->valCode;

  $sql2="INSERT INTO users(username,password,email,name, surname, language, user_account_status, user_validation_code)VALUES(:username,:password,:email,:name,:surname,:language, :user_account_status,:user_validation_code)";
  $stmt2 = $db->prepare($sql2);
  $stmt2->bindParam("username", $username,PDO::PARAM_STR);
  $password=hash('sha256',$data->password);
  $stmt2->bindParam("password", $password,PDO::PARAM_STR);
  $stmt2->bindParam("email", $email,PDO::PARAM_STR);
  $stmt2->bindParam("name", $name,PDO::PARAM_STR);
  $stmt2->bindParam("surname", $surname,PDO::PARAM_STR);
  $stmt2->bindParam("language", $language,PDO::PARAM_STR);
  $accountStatus = "registered";
  $stmt2->bindParam("user_account_status", $accountStatus,PDO::PARAM_STR);
  $stmt2->bindParam("user_validation_code", $valCode,PDO::PARAM_INT);
  $stmt2->execute();
}

// get username and password of the user given its id
function getOldUserData ($db, $user_id) {
  $sql = "SELECT username, email, user_validation_code FROM users WHERE user_id=:user_id";
  $stmt = $db->prepare($sql);
  $stmt->bindParam("user_id", $user_id,PDO::PARAM_INT);
  $stmt->execute();

  return $stmt->fetch(PDO::FETCH_OBJ);
}

/* Update user Data */
function updateUserData ($db, $data) {
  $sql2="UPDATE users SET username=:username,password=:password,email=:email,name=:name, surname=:surname, language=:language, user_validation_code=:valCode WHERE user_id=:user_id";
  $stmt2 = $db->prepare($sql2);
  $stmt2->bindParam("username", $data->username,PDO::PARAM_STR);
  $password=hash('sha256',$data->password);
  $stmt2->bindParam("password", $password,PDO::PARAM_STR);
  $stmt2->bindParam("email", $data->email,PDO::PARAM_STR);
  $stmt2->bindParam("name", $data->name,PDO::PARAM_STR);
  $stmt2->bindParam("surname", $data->surname,PDO::PARAM_STR);
  $stmt2->bindParam("language", $data->language,PDO::PARAM_STR);
  $stmt2->bindParam("valCode", $data->valCode,PDO::PARAM_INT);
  $stmt2->bindParam("user_id", $data->user_id,PDO::PARAM_INT);
  $stmt2->execute();
}
/****************************END REGISTRATION QUERIES*********************************/

?>
