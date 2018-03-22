import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-chat-new-form',
  templateUrl: 'chat-new-form.html',
})
export class ChatNewFormPage {
  chatPostData = {"user_id":"", "language":"", "topic":"", "description":""};


  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider, private toastCtrl: ToastController) {
    this.chatPostData.user_id = navParams.get("user_id");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatNewFormPage');
  }

  create() {

    if( this.chatPostData.language && this.chatPostData.topic ) {
        this.authService.postData(this.chatPostData, "createChat").then((res) => {

            if(this.res.added) {
              // push into items[] from chat.ts
              this.presentToast("Chat created successfully.");

              // go to chat.ts, add into items[] array

            } else {
              console.log("Failure to create chat.");
            }
        }, (err) => {

        });
    }
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
