import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  constructor(public navCtrl: NavController, public app: App) {

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

}
