import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController } from 'ionic-angular';
import { GenericProvider } from '../../providers/generic/generic';
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
  userPostData1 = {"user_id":"", "chat_id":""};
  userPostData2 = {"user_id":"", "token":""};
  isAdmin: boolean = false;
  index: number;

  constructor(public navCtrl: NavController, public genProvider: GenericProvider, private modalCtrl: ModalController, private alertCtrl: AlertController, private toastCtrl: ToastController) {
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;

      this.userPostData2.user_id = this.userDetails.user_id;
      this.userPostData2.token   = this.userDetails.token;

      this.getAdmin();
      //this.isAdmin = this.userDetails.user_account_status === "admin" ? true : false;
      this.userPostData1.user_id = this.userDetails.user_id;

      this.getChats();
  }

  getAdmin(){
    this.genProvider.postData(this.userPostData2, "isAdminUser").then((res) => {
      this.responseData = res;

      if( this.responseData.true || this.responseData.isMaster) {
        this.isAdmin = true;
      }
    }, (err) => {
      // missing code
    });
  }

  getChats(){
      // why am I passing userPostData1 if no parameters are required?
      this.genProvider.postData(this.userPostData1, "chat").then((result) => {
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
          user_id: this.userPostData1.user_id
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
        user_id: this.userPostData1.user_id
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
      user_id: this.userPostData1.user_id
    });

    /* Show the page */
    modal.present();

    /* Update changes in this page passed via the variable 'data' */
    modal.onDidDismiss(data => {
      console.log(data);
      if( data ) {
        this.items.push(data);
      }
    });
  }

  delete(item) {
    // get chat_id to be deleted
    this.userPostData1.chat_id = item.chat_id;
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
            this.genProvider.postData(this.userPostData1, "deleteChat").then((result) => {
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
