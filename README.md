# OLLE-APP
Online language learning app

## Instructions

 Hi guys. I will be leaving on the 14th to travel across China and won't be comming back until the start of the second term. I have uploaded a fully working login/registration page that connects to the database using **Ionic**. I urge to download it and try out yourselves play around with it, and, should you have time, work on the project while I am away. The following are instructions to set up the development environment in your computers.
 
 ### 1. Setting up the Environment
  1. **Download git bash** (windows users only). Ionic is purely run through the command line only. Windows cmd is extremely inneficient, you will be grateful to have this.
  2. **Download Nodejs** (https://nodejs.org/en/).
  3. **Install Ionic and Cordova**. Just enter in git bash: *npm install -g cordova ionic*
  3. **Create a new ionic project**. In the folder where you want to store the ionic project enter on git: *ionic start theApp blank*.
  4. **Test/Run the project**. In the new project folder, type on git: *ionic serve*. Congratulations! You can will now see your app on the browser.
  
 ### 2. Downloading files
  1. Download the **src** folder, and replace it by the one with the same name in the ionic project you created. If you run again the project (*ionic serve*), you will see that the main screen has changed. This is a good sign.
  2. Download the **theAppDB** folder and root it in your *localhost*. You must have installed and running an apache server, either from *XAMPP*, *WAMPSERVER* or any other that appeals you.
  
 ### 3. Tables in PHPmyAdmin
  1. Create a new database and name it how you wish in *PHPmyAdmin* (I set it to: social_language_learning_app.
  2. Create a new table named "*users*" with 7 fields, being these: user_id, username, password, name, surname, email, UserType
 
  
 ### 4. Errors you might encounter
 If you have made it so far, it implies that your app is fully running, and you either are able to create an account and navigate through the app (*logout* button is in the *MyOLLE* tab) and thereby should ignore this section, or you are getting an error 500/403 when you click in signup (if you see the source code of the page, and the move to *console*, it will specify the error type). It should be a **CORS** error, that occurs because you are trying to access information from an external domain (Ionic uses its own localhost:8100 port, which is different from the one from appache). To solve this:
 
 - Whenever you "cause" the error by clicking on the sign-up button, a new error description will appear in a file inside apache called *Apache error log*, probably claiming that it doesn't understand a term in **.htaccess** file in *theAppDB*. I cannot remember exactly what I did, but I enabled the modules that were dissabled in the apache's **httpd.conf** file. Save a copy of the file before making any changes, just in case you screw everything up, and try solve it until you get rid of all errors.
 
 Should you completely overcome this, you will have a running app that processes user authentication. At this stage you should, either try to understand the code or learn online
 
 ### 5. TODO
  1. I have authenticated users, yet I still do not distinguish between *admin* and *standard* users. I have been reading online and have come to with **Role Based Authentication (RBAC)**, which perhaps using two more tables we could get rid of *UserType* column in the table you created at the start.
  
  2. To make the front-end to understand the role of the current user, and display different content according to the user role. For this, I would reccommend first to look at how the fron-end and back-end communicate, looking at the *signup()* (register.ts file), *login()* (logint.ts file), and *postData(X,Y)* (auth-service.ts file).
  
 Othen than that, best of luck in your exams and I hope you have a great time during your holidays! See ya ;-)
 
