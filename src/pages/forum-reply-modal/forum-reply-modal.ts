import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { GenericProvider } from '../../providers/generic/generic';
import { ForumItemDetailPage } from '../forum-item-detail/forum-item-detail';


@Component({
  selector: 'page-forum-reply-modal',
  templateUrl: 'forum-reply-modal.html',
})
export class ForumReplyPage {
  responseData: any;
  item: any;

  postTopicReply = { "post_id":"","user_post": "", "username": "", "tag":"", "topic_id": "", "parent_id": "" };
  user_data = JSON.parse(localStorage.getItem('userData')).userData;


  constructor(public navCtrl: NavController, public navParams: NavParams, public GenericProvider: GenericProvider, public toastCtrl: ToastController,private viewCtrl:ViewController) {
    this.item = navParams.get('item');
  }

  ngOnInit() {

  	this.postTopicReply.topic_id = this.item.topic_id;
	this.postTopicReply.username = this.user_data.username;
	this.postTopicReply.parent_id = this.item.parent_id;
	this.postTopicReply.parent_id = this.item.post_id;

	this.GenericProvider.postData(this.user_data.user_id,"userTag").then((result) => {

	 	this.responseData = result;

	 	this.postTopicReply.tag = this.responseData.userTag[0].tag;
    }, (err) => {
      		//error message
    });

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
