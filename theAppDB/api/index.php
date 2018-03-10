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
$app->post('/generateNewValidationCode', 'generateNewValidationCode');
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
                            echo  '{"dataStored":' .$userData .'}';
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
                    echo  '{"dataStored":' .$userData .'}';
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
  //echo '{"dataStored":{"text":"Email sent successfuly."}}';
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
      echo  '{"dataStored":' .$userData .'}';

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
  $valCode=$data->valCode;

  $sql2="INSERT INTO users(username,password,email,name, surname, user_account_status, user_validation_code)VALUES(:username,:password,:email,:name,:surname,:user_account_status,:user_validation_code)";
  $stmt2 = $db->prepare($sql2);
  $stmt2->bindParam("username", $username,PDO::PARAM_STR);
  $password=hash('sha256',$data->password);
  $stmt2->bindParam("password", $password,PDO::PARAM_STR);
  $stmt2->bindParam("email", $email,PDO::PARAM_STR);
  $stmt2->bindParam("name", $name,PDO::PARAM_STR);
  $stmt2->bindParam("surname", $surname,PDO::PARAM_STR);
  $accountStatus = "registered";
  $stmt2->bindParam("user_account_status", $accountStatus,PDO::PARAM_STR);
  $stmt2->bindParam("user_validation_code", $valCode,PDO::PARAM_STR);
  $stmt2->execute();
}

// get username and password of the user given its id
function getOldUserData ($db, $user_id) {
  $sql = "SELECT username, email, user_validation_code FROM users WHERE user_id=:user_id";
  $stmt = $db->prepare($sql);
  $stmt->bindParam("user_id", $user_id,PDO::PARAM_STR);
  $stmt->execute();

  return $stmt->fetch(PDO::FETCH_OBJ);
}

/* Update user Data */
function updateUserData ($db, $data) {
  $sql2="UPDATE users SET username=:username,password=:password,email=:email,name=:name, surname=:surname, user_validation_code=:valCode WHERE user_id=:user_id";
  $stmt2 = $db->prepare($sql2);
  $stmt2->bindParam("username", $data->username,PDO::PARAM_STR);
  $password=hash('sha256',$data->password);
  $stmt2->bindParam("password", $password,PDO::PARAM_STR);
  $stmt2->bindParam("email", $data->email,PDO::PARAM_STR);
  $stmt2->bindParam("name", $data->name,PDO::PARAM_STR);
  $stmt2->bindParam("surname", $data->surname,PDO::PARAM_STR);
  $stmt2->bindParam("valCode", $data->valCode,PDO::PARAM_STR);
  $stmt2->bindParam("user_id", $data->user_id,PDO::PARAM_STR);
  $stmt2->execute();
}
/****************************END REGISTRATION QUERIES*********************************/

?>
