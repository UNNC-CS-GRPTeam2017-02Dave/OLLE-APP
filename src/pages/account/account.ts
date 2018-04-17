import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { AccountUpdateDataPage } from '../account-update-data/account-update-data';
import { AccountUpdatePasswordPage } from '../account-update-password/account-update-password';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  userDetails: any;

  constructor(public navCtrl: NavController, public app: App) {
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;
  }

  /* Allows to update the user information on the screen while the page is loading */
  ionViewWillEnter() {
    let storage = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = storage.userData;
  }

  gotoLoginPage(){
    // Back to main Screen
    //this.navCtrl.setRoot(LoginPage);
    // Esto da error
    const root = this.app.getRootNav();
    root.popToRoot();
  }

  logout(){
    // delete user data stored
    localStorage.clear();
    setTimeout(() => this.gotoLoginPage(), 1500);
    //console.log(localStorage.getItem('userData'));
  }

  changeName() {
    this.navCtrl.push(AccountUpdateDataPage, {
      item: {
        data: this.userDetails.name,
        user_id: this.userDetails.user_id,
        type: "Name",
        //storage: 'userData.name',
        method: "updateName"
      }
    });
  }

  changeSurname() {
    this.navCtrl.push(AccountUpdateDataPage, {
      item: {
        data: this.userDetails.surname,
        user_id: this.userDetails.user_id,
        type: "Surname",
        //storage: "userData.surname",
        method: "updateSurname"
      }
    });
  }

  changeUsername() {
    this.navCtrl.push(AccountUpdateDataPage, {
      item: {
        data: this.userDetails.username,
        user_id: this.userDetails.user_id,
        type: "Username",
        //storage: "userData.username",
        method: "updateUsername"
      }
    });
  }

  changePassword() {
    this.navCtrl.push(AccountUpdatePasswordPage, {
      user_id: this.userDetails.user_id
    });
  }

}
