import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-chat-gen-settings',
  templateUrl: 'chat-gen-settings.html',
})
export class ChatGenSettingsPage {
  item: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthServiceProvider) {
    this.item = navParams.get('item');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatGenSettingsPage');
  }

  modify() {

  }

  deleteMessages() {
    
  }

}
