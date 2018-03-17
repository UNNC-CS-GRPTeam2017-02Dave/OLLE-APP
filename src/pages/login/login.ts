import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
//import { ForumPage } from '../forum/forum';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  responseData : any;
  userData = {"username":"", "password":""};

  constructor(public navCtrl: NavController, public authService: AuthServiceProvider, public toastCtrl: ToastController, public alertCtrl: AlertController){

    // Open TabsPage if a user is already signed-in
    //localStorage.clear();
    //networkinterface.getIPAddress(function (ip) {
    /*alert(ip);
  });*/
    console.log(localStorage.getItem('userData'));
    if(localStorage.getItem('userData')){
      this.navCtrl.push(TabsPage);
      //this.navCtrl.setRoot(TabsPage);
    }
  }

  login(){
    if(this.userData.username && this.userData.password){  // fields are not empty
      //API connections
      this.authService.postData(this.userData, "login").then((result) => {
        this.responseData = result;
        // see what is coming from the api
        console.log( this.responseData );
        // checks if user already exists
        if( this.responseData.userData ){
        // used to redirect to home page if a user is logged-in
          localStorage.setItem('userData', JSON.stringify(this.responseData)  )
          //switch page
          this.navCtrl.push(TabsPage);
        }
        else{
          //console.log("Please give valid username & password.");
          this.presentToast("Invalid Username or Password.");
        }

      }, (err) => {
        //Connection failed message
        //console.log("Fatal Error! Contact system administrators!");
        this.showAlert();
      });
    }
    else{
      //console.log("Please fill-up the required fields.");
      this.presentToast("Please fill-up the required fields.");
    }
  }

  // Diplays bottom error message
  presentToast(string) {
    let toast = this.toastCtrl.create({
      message: string,
      duration: 3000
    });
    toast.present();
  }

  // Database Connection Failure
  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Fatal Error!',
      subTitle: 'Contact system administrators!',
      buttons: ['OK']
    });
    alert.present();
  }

  navToSignupPage(){
    this.navCtrl.push(RegisterPage);
  }

}
