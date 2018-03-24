import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
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
  index: number = -1;
  isCreated: boolean = false;

  constructor(public navCtrl: NavController, public authService: AuthServiceProvider, private alertCtrl: AlertController, private toastCtrl: ToastController) {
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      this.isAdmin = this.userDetails.user_account_status === "admin" ? true : false;
      console.log(this.isAdmin);
      this.userPostData.user_id = this.userDetails.user_id;

      this.getChats();
  }

  ionViewWillEnter() {
    // case where a chat's topic & description have been modified.
    console.log(this.index);
    if(this.index != -1) {
      // retrieve new data stored locally
      let retrieved = JSON.parse(localStorage.getItem('chatData'));
      console.log(retrieved);
      this.items[this.index].topic = retrieved.topic;
      this.items[this.index].description = retrieved.description;
      this.index = -1;

    // createChat button pressed.
  } else if ( this.isCreated ) {
      let retrieved = JSON.parse(localStorage.getItem('chatData'));
      console.log(retrieved);
      this.items.push(retrieved.fData);
      this.isCreated = false;
    }
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

  edit(item){
    this.index = this.items.indexOf(item);
    console.log(this.index);
    if( item.language ){
      this.navCtrl.push(ChatGenSettingsPage, {
          item: item,
          user_id: this.userPostData.user_id
      });
    }
  }

  delete(item) {
    // get chat_id to be deleted
    this.userPostData.chat_id = item.chat_id;
    this.presentConfirm("Delete "+item.language+" Chat", "You are about to delete this chat. Are you sure you wish to continue?", item);
  }

  createChat() {
    // reminder variable to retrieve data when po
    this.isCreated = true;
    this.navCtrl.push(ChatNewFormPage, {
        user_id: this.userPostData.user_id
    });
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
