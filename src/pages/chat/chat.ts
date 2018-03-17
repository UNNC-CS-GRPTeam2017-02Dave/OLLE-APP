import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { InstantMessagingPage } from '../chat-m/chat-m';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  items: any[];
  userDetails: any;
  responseData: any;
  userPostData = {"user_id":""}

  constructor(public navCtrl: NavController, public authService: AuthServiceProvider) {
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      console.log(this.userDetails);
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
      console.log(item);
      if( item.language ){
        this.navCtrl.push(InstantMessagingPage, {
            item: item,
            user_id: this.userPostData.user_id
        });
      }

  }
}
