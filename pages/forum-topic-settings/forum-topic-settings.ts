import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { GenericProvider } from '../../providers/generic/generic';

@Component({
  selector: 'page-forum-topic-settings',
  templateUrl: 'forum-topic-settings.html',
})
export class ForumTopicSettingsPage {
  topicData: any;
  storage: any;
  dataPost = {"topic_id":"","topic_title": "", "topic_detail": "", "topic_date": "", "topic_week": "", "user_id": "", "post_username" :"", "token": ""};
  responseData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private GenericProvider: GenericProvider, private toastCtrl: ToastController, private viewCtrl:ViewController) {
    
    this.topicData = navParams.get('item');
    
    this.storage = JSON.parse(localStorage.getItem('userData')).userData;	
    this.dataPost.post_username = this.storage.username;       	  
    this.dataPost.user_id = this.storage.user_id;
    this.dataPost.token  = this.storage.token;
    this.dataPost.topic_id = this.topicData.topic_id;
  }

  modify() {

      this.GenericProvider.postData(this.dataPost, "updateTopic").then((result) => {
 
	 		this.responseData = result;

	 		if(this.responseData.error1)
	 		{
				this.presentToast("Invalid week number");
	 		}
	 		else if(this.responseData.error2)
	 		{
				this.presentToast("Invalid title.");
	 		}
	 		else if(this.responseData.error3)
	 		{
				this.presentToast("Invalid detail.");
	 		}
     		else
	 		{	 
				this.presentToast("Topic Information updated successfully!");
				
          		let toStore = {
            		
            		topic_title: this.dataPost.topic_title,
            		topic_detail: this.dataPost.topic_detail,
            		topic_date: this.dataPost.topic_date,
            		topic_week: this.dataPost.topic_week
            	
          		};

          		this.viewCtrl.dismiss(toStore);	
	 		}
    	}, (err) => {
      		//error message
	  		
   		});	
  }

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
