import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, ToastController } from 'ionic-angular';
import { GenericProvider } from '../../providers/generic/generic';

@Component({
  selector: 'page-chat-new-form',
  templateUrl: 'chat-new-form.html',
})
export class ChatNewFormPage {
  chatPostData = {"user_id":"", "language":"", "topic":"", "description":""};
  responseData: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public genProvider: GenericProvider, private toastCtrl: ToastController, private viewCtrl:ViewController) {
    this.chatPostData.user_id = navParams.get("user_id");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatNewFormPage');
  }

  create() {
    if( this.chatPostData.language && this.chatPostData.topic ) {
        this.genProvider.postData(this.chatPostData, "createChat").then((res) => {
            this.responseData = res;

            if(this.responseData.fData) {
              // push into items[] from chat.ts
              this.presentToast("Chat created successfully.");

              /* Go to previous page, pass the new chat data as parameter. */
              this.viewCtrl.dismiss(this.responseData.fData);

            } else {
              console.log("Failure to create chat.");
            }
        }, (err) => {

        });
    }
  }

  // back to previous page in stack
  back(){
    this.viewCtrl.dismiss();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
