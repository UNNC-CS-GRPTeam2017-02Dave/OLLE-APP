import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { GenericProvider } from '../../providers/generic/generic';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  responseData : any;
  verificationResponse: any;
  userData = {"user_id":"", "name":"", "surname":"", "username":"", "language":"", "email":"","password":"" };
  verifyCode = {"valCode":"", "email":"", "name":""};
  alertTitle: string;
  alertMessage: string;
  timer = 180;
  isEmailSent: boolean = false;

  constructor(public navCtrl: NavController, public genProvider: GenericProvider, public toastCtrl: ToastController, public alertCtrl: AlertController) {

  }

  signup(){

    // Check if user Inputfields filled.
    if(this.userData.name && this.userData.surname && this.userData.username && this.userData.email && this.userData.password && this.userData.language ){
      //console.log('Hello.');
      //API connections
      // Process user input, pass it to the API ("signup")
        this.genProvider.postData(this.userData, "signup").then((result) => {
            this.responseData = result;
            console.log( this.responseData );   // see what is coming from the api
            // checks if user already exists
            if( this.responseData.userData ){

                // Habria que quitar user input al registrarse.
              console.log(this.responseData.userData.user_id);
              this.userData.user_id = this.responseData.userData.user_id;
              this.showPrompt("Email verification", "Registration completed. Check your email to validate your account!");
              //localStorage.setItem('userData', JSON.stringify(this.responseData)  )
              //switch page
              //this.navCtrl.push(TabsPage);
            }
            // Not a nottingham email
            else if ( this.responseData.error1 )
            {
              // Error1, not nottingham email.
              this.presentToast("Access denied. Only nottingham university students can access this feature!.");
            }
            else if ( this.responseData.error2 )
            {
              // Error2, username already in use
              this.presentToast("Username already exists.");
            }
            else
            {
              // Error3, email already in use
              this.presentToast("Email already registered.");
            }
        }, (err) => {
          //DB Connection failed message
            this.showAlert("Fatal Error!", "Contact system administrators!");
        });
    }
    else{
      //console.log("Please fill-up the required fields.");
      this.presentToast("Please fill-up the required fields.");
    }
  }


  // Invalid User Input
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  // Code verification
  showPrompt(message1, message2) {
    this.startTimer()
    let prompt = this.alertCtrl.create({
      title: message1,
      message: message2,//' ( ${this.timer} )',
      inputs: [
        {
          name: 'valCode',
          placeholder: 'Validation Code',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          // Should have time-stamp here.
          text: 'Resend',
          handler: data => {
            console.log('Resend clicked');

            this.genProvider.postData(this.userData.email, "generateNewValidationCode").then((res) => {

                // email sent
                if( res ) {
                    console.log("Email sent.");
                    this.showPrompt("Email verification", "Email has been sent to your account!");
                }
                // failure to send email
                else {
                    console.log("Email not sent.");
                    this.presentToast("Email could not be sent.");
                }
            })
          }
        },
        {
          text: 'Submit',
          handler: data => {
            console.log('Submit clicked');
            this.verifyCode.valCode = data.valCode;
            this.verifyCode.email = this.userData.email;
            //console.log( this.verifyCode.valCode );
            // Process user validation code input, pass it to the API ("signup")
            this.genProvider.postData(this.verifyCode, "verifyAccount").then((res) => {
                this.verificationResponse = res;

                // User successfuly validated
                if( this.verificationResponse.success ) {
                    localStorage.setItem('userData', JSON.stringify(this.responseData) );
                    //switch page (check alert extended documentation to be sure)
                    this.navCtrl.push(TabsPage);
                }
                else {
                    // Code does not match.
                    this.presentToast("Invalid Code. Try again.")
                }
            });

          }
        }
      ]
    });
    prompt.present();

  }


  startTimer() {
    setInterval(function() {
      this.timer--;
      //console.log(this.timer);
    }.bind(this), 1000)
  }

  // Unable to connect to DB
  showAlert(message1, message2) {
    let alert = this.alertCtrl.create({
      title: message1,
      subTitle: message2,
      buttons: ['OK']
    });
    alert.present();
  }

}
