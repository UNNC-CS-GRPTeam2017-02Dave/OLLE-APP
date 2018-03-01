# Database mysql code

CREATE TABLE `slla`. ( `user_id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(50) NULL DEFAULT NULL , `surname` VARCHAR(50) NULL DEFAULT NULL , `username` VARCHAR(50) NULL DEFAULT NULL , `email` VARCHAR(150) NULL DEFAULT NULL , `password` VARCHAR(150) NULL DEFAULT NULL , `user_account_status` ENUM('master','admin','validated','not validated') NOT NULL DEFAULT 'not validated' , `user_validation_code` INT NOT NULL , PRIMARY KEY (`user_id`)) ENGINE = MyISAM;
