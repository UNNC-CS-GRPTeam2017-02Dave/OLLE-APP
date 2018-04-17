import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { GenericProvider } from '../../providers/generic/generic';
import { ItemDetailPage } from '../forum-item-detail/forum-item-detail';


@Component({
  selector: 'page-forum-reply-modal',
  templateUrl: 'forum-reply-modal.html',
})
export class ForumReplyPage {
  responseData: any;
  item: any;
  storage: any;
  
  postTopicReply = { "post_id":"","user_post": "", "username": "", "language":"", "topic_id": "", "parent_id": "","user_id":"", "token":"" };
  

  
  constructor(public navCtrl: NavController, public navParams: NavParams, public GenericProvider: GenericProvider, public toastCtrl: ToastController,private viewCtrl:ViewController) {
    this.item = navParams.get('item');
  }

  ngOnInit() {
     
    this.storage = JSON.parse(localStorage.getItem('userData')).userData;

  	this.postTopicReply.topic_id = this.item.topic_id;
	this.postTopicReply.parent_id = this.item.post_id;
	
    this.postTopicReply.user_id = this.storage.user_id;
    this.postTopicReply.token  = this.storage.token;
	this.postTopicReply.language = this.storage.language; 
	this.postTopicReply.username = this.storage.username;  	
  }

  postNewTopicReply() {
    
    this.GenericProvider.postData(this.postTopicReply, "postNewTopicReply").then((result) => {
      this.responseData = result;
      
      if(this.responseData.error1)
	  {
		this.presentToast("Invalid reply");
	  }
	  else
	  {
	  	this.viewCtrl.dismiss(this.postTopicReply);
	  }      
    }, (err) => {
      //error message
    });
  }

  back(){

  	this.viewCtrl.dismiss();
  }

  // Invalid User Input
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  } 
}
