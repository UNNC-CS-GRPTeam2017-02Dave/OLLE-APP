import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { GenericProvider } from '../../providers/generic/generic';

@Component({
  selector: 'page-account-update-data',
  templateUrl: 'account-update-data.html',
})
export class AccountUpdateDataPage {
  userDetails: any;
  responseData: any;
  userInfo = {"data":"", "user_id":""};

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public genProvider: GenericProvider) {
    this.userDetails = navParams.get('item');
    this.userInfo.user_id = this.userDetails.user_id;
  }

  updateData(){
    console.log(this.userDetails.data);
    this.userInfo.data = this.userDetails.data;

    if( this.userInfo.data ) {

      this.genProvider.postData(this.userInfo, this.userDetails.method).then((result) => {
        this.responseData = result;


        if( this.responseData.userData ) {
// Perhaps I could store them in a global variable files, and call/update them when required (helpful for chat)
            //update variable in local storage
            //localStorage.clear('userData');
            localStorage.setItem('userData', JSON.stringify(this.responseData));
            console.log(localStorage.getItem('userData'));

            this.presentToast("Data modified successfuly.");
            // go to AccountPage
            this.navCtrl.pop();
        } else {
            this.presentToast("Username already exists. Try another one.")
        }

      }, (err) => {
        //Connection failed message
        console.log("Fatal Error! Contact system administrators!");
        //this.showAlert();
      });
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
