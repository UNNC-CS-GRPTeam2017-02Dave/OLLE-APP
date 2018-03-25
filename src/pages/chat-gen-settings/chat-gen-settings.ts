import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, ViewController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-chat-gen-settings',
  templateUrl: 'chat-gen-settings.html',
})
export class ChatGenSettingsPage {
  chatDetails: any;
  dataPost = {"chat_id":"", "topic":"","description":"", "user_id":""};
  responseData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private authService: AuthServiceProvider, private toastCtrl: ToastController, private alertCtrl: AlertController, private viewCtrl:ViewController) {
    this.chatDetails = navParams.get('item');

    this.dataPost.user_id = navParams.get('user_id');
    this.dataPost.chat_id = this.chatDetails.chat_id;
    //this.dataPost.topic = this.item.topic;
    //this.dataPost.description = this.item.description;
    console.log(this.chatDetails);
  }

  modify() {
    if( this.dataPost.topic && this.dataPost.description ){
      this.authService.postData(this.dataPost, "updateChat").then((result) => {
        this.responseData = result;

        if( this.responseData.updated ){
          this.presentToast("Chat Information updated successfully!");

          let toStore = {
            topic: this.dataPost.topic,
            description: this.dataPost.description
          };

          /* Go to previous page, pass toStore as a parameter. */
          this.viewCtrl.dismiss(toStore);

        } else {
          console.log("Error Major");
        }

      }, (err) => {
        console.log("Error");
      });

    } else {
      this.presentToast("Some input field is empty. Fill them up!")
    }
  }

  back(){
    this.viewCtrl.dismiss();
  }

  deleteMessages() {
    this.presentConfirm("Delete Messages", "You are about to delete all messages from this chat. It will be empty. Do you still wish to proceed?");
  }

  presentConfirm(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Proceed',
          handler: () => {
            this.authService.postData(this.dataPost, "deleteMessages").then((result) => {
                this.responseData = result;
                if( this.responseData.removed ) {
                  //https://www.tutorialspoint.com/typescript/typescript_arrays.htm
                  // remove item from items at position item
                  this.presentToast("Messages deleted successfully.");

                } else {
                  this.presentToast("Failure to delete messages.");
                }

            }, (err) => {
              console.log("Fatal error! Server is down.");
            });
          }
        }
      ]
    });
    alert.present();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }


}
