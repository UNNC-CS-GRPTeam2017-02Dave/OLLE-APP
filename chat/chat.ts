import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { InstantMessagingPage } from '../chat-m/chat-m';
import { ChatGenSettingsPage } from '../chat-gen-settings/chat-gen-settings';
import { ChatNewFormPage } from '../chat-new-form/chat-new-form';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  items: any[];
  userDetails: any;
  responseData: any;
  userPostData = {"user_id":"", "chat_id":""};
  isAdmin: boolean = false;
  // variables to check changes (update or creation) in chats.
  index: number;

  constructor(public navCtrl: NavController, public authService: AuthServiceProvider, private modalCtrl: ModalController, private alertCtrl: AlertController, private toastCtrl: ToastController) {
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      this.isAdmin = this.userDetails.user_account_status === "admin" ? true : false;
      console.log(this.isAdmin);
      this.userPostData.user_id = this.userDetails.user_id;

      this.getChats();
  }

  getChats(){
      // why am I passing userPostData if no parameters are required?
      this.authService.postData(this.userPostData, "chat").then((result) => {
          this.responseData = result;
          this.items = this.responseData.fData;
      }, (err) => {
          //DB Connection failed message
          console.log("Cannot obtain chat Languages");
      });
  }

  itemSelected(item){
    // Get position of object 'item' in the array.
    console.log(item);
    if( item.language ){
      this.navCtrl.push(InstantMessagingPage, {
          item: item,
          user_id: this.userPostData.user_id
      });
    }
  }

  edit(item) {
    this.index = this.items.indexOf(item);
    console.log(this.index);

    if( item.language ){
      /* Prepare General Chat Settings page */
      let modal = this.modalCtrl.create(ChatGenSettingsPage, {
        item: item,
        user_id: this.userPostData.user_id
      });

      /* Show the page */
    	modal.present();

      /* Update changes in this page passed via the variable 'data' */
      modal.onDidDismiss(data => {

        if( data ) {

          this.items[this.index].topic = data.topic;
          this.items[this.index].description = data.description;
        }
      });
    }
  }

  createChat() {
    /* Prepare Create Chat page */
    let modal = this.modalCtrl.create(ChatNewFormPage, {
      user_id: this.userPostData.user_id
    });

    /* Show the page */
    modal.present();

    /* Update changes in this page passed via the variable 'data' */
    modal.onDidDismiss(data => {
      console.log(data);
      if( data ) {
        this.items.push(data);
        //this.items[this.index].topic = data.topic;
        //this.items[this.index].description = data.description;
      }
    });
    /*this.navCtrl.push(ChatNewFormPage, {
        user_id: this.userPostData.user_id
    });*/
  }

  delete(item) {
    // get chat_id to be deleted
    this.userPostData.chat_id = item.chat_id;
    this.presentConfirm("Delete "+item.language+" Chat", "You are about to delete this chat. Are you sure you wish to continue?", item);
  }

  presentConfirm(title, message, item) {
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
            this.authService.postData(this.userPostData, "deleteChat").then((result) => {
                this.responseData = result;
                if( this.responseData.removed ) {
                  //https://www.tutorialspoint.com/typescript/typescript_arrays.htm
                  // remove item from items at position item
                  let removed = this.items.splice(this.items.indexOf(item), 1);
                  this.presentToast("Chat removed successfully.");

                } else {
                  this.presentToast("Failure to remove the chat.");
                }

            }, (err) => {

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
