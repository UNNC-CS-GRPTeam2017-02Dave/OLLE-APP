import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-chat-m',
  templateUrl: 'chat-m.html',
})
export class InstantMessagingPage {
  item: any;
  messages: any[];
  newMessages: any[];
  messageInfo: any;
  message: string ="";
  responseData: any;
  userPostData = {"chat_id":"", "user_id":"", "message":""};
  userPostData2 = {"chat_id":"", "message_id":"", "time":""};
  supp: any;
  //message:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider) {
      const data = JSON.parse(localStorage.getItem('userData'));

      this.item = navParams.get('item');


      this.userPostData.chat_id = this.item.chat_id;
      this.userPostData2.chat_id = this.userPostData.chat_id;
      this.userPostData.user_id = data.userData.user_id;
      this.supp = data.userData.username;

      this.getAllMessages();
      this.getNewMessages();
      //this.getNewMessages();
  }

  getAllMessages() {
    // no need to send this.userPostData
    this.authService.postData(this.userPostData, "getAllMessages").then((result) => {

        this.responseData = result;
        // store array of messages
        this.messages = this.responseData.fData;
        //console.log(this.messages[this.messages.length-1].message_id);

        // Get last message Details
        this.userPostData2.message_id = this.messages[this.messages.length-1].message_id;
        this.userPostData2.time = this.messages[this.messages.length-1].time_sent;
        console.log(this.userPostData2);

    }, (err) => {
        //DB Connection failed message
        console.log("Cannot send message");
    });
  }

  getNewMessages() {
    setInterval(() => this.askRequest(), 250);
  }

  askRequest() {
    this.authService.postData(this.userPostData2, "getNewMessages").then((result) => {
        //console.log(result.fData[1]);
        this.responseData = result;

        //console.log(this.responseData.fData[0]);
        if( this.responseData.fData[0] != null ) {
            for( let i = 0; i<this.responseData.fData.length; i++){
              //console.log(this.responseData.length);
              this.messages.push(this.responseData.fData[i]);
            }

            // get last messageID and time_sent
            this.userPostData2.message_id = this.messages[this.messages.length-1].message_id;
            this.userPostData2.time = this.messages[this.messages.length-1].time_sent;
            console.log(this.messages);
        }
    }, (err) => {
        //DB Connection failed message
        console.log("Cannot send message");
    });
  }

  sendMessage() {
    this.userPostData.message = this.message;
    this.authService.postData(this.userPostData, "storeMessage").then((result) => {
        //this.messages = this.responseData.fData;
    }, (err) => {
        //DB Connection failed message
        console.log("Cannot send message");
    });

    this.message ="";
  }

}
