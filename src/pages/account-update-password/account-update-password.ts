import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { GenericProvider } from '../../providers/generic/generic';

@Component({
  selector: 'page-account-update-password',
  templateUrl: 'account-update-password.html',
})
export class AccountUpdatePasswordPage {
  userInfo: any;
  userDetails = {"oldPass":"", "newPass":"", "user_id":""};
  confirmPass: string;
  responseData:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public genProvider: GenericProvider) {
      this.userDetails.user_id = navParams.get('user_id');
  }

  updatePassword() {
      // input fields filled
      if( this.userDetails.oldPass && this.userDetails.newPass ) {
          // new password matches in both input fields
          if( this.userDetails.newPass === this.confirmPass ){

              this.genProvider.postData(this.userDetails, "updatePassword").then((result) => {
                  this.responseData = result;

                  if( this.responseData.updateSuccess ) {
                      this.presentToast("Password modified successfuly.");
                      // go to AccountPage
                      this.navCtrl.pop();
                  } else {
                      this.presentToast("Old password is incorrect. Please try again.");
                  }
              }, (err) => {
                  console.log("Cannot connect to DB");
              });
          } else {
             this.presentToast("New password does not match with Confirm password.");
          }

      } else {
          this.presentToast("Please complete all input fields.");
      }
  }

  presentToast(string) {
    let toast = this.toastCtrl.create({
      message: string,
      duration: 3000
    });
    toast.present();
  }



}
