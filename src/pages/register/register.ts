import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  responseData : any;
  userData = {"name":"", "surname":"", "username":"", "email":"","password":""};

  constructor(public navCtrl: NavController, public authService: AuthServiceProvider, public toastCtrl: ToastController, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  signup(){

    // Check if user Inputfields filled.
    if(this.userData.name && this.userData.surname && this.userData.username && this.userData.email && this.userData.password){
      //API connections
      // Process user input, pass it to the API ("signup")
      this.authService.postData(this.userData, "signup").then((result) => {
        this.responseData = result;
        console.log(this.responseData );   // see what is coming from the api
        // checks if user already exists
        if( this.responseData.userData ){
          localStorage.setItem('userData', JSON.stringify(this.responseData)  )
          //switch page
          this.navCtrl.push(TabsPage);
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
        this.showAlert();
      });
    }
    else{
      //console.log("Please fill-up the required fields.");
      this.presentToast("Please fill-up the required fields.");
    }
  }

  presentToast(string) {
    let toast = this.toastCtrl.create({
      message: string,
      duration: 3000
    });
    toast.present();
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Fatal Error!',
      subTitle: 'Contact system administrators!',
      buttons: ['OK']
    });
    alert.present();
  }

}
