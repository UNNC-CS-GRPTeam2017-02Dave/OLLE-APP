import { Component } from '@angular/core';
import { NavController, NavParams, App, ToastController } from 'ionic-angular';
import { GenericProvider } from '../../providers/generic/generic';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-forum-newtopic',
  templateUrl: 'forum-newtopic.html'
})
export class ForumNewtopicPage {

	item : any;
	responseData : any;
	topicData = {"topic_id":"","topic_title": "", "topic_detail": "", "topic_date": "", "topic_week": "", "user_id": "", "post_username" :""};

	user_info = JSON.parse(localStorage.getItem('userData')).userData;

	constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public GenericProvider: GenericProvider, public toastCtrl: ToastController) {

    	this.item = navParams.get('item');
    }

  	ngOnInit() {

    	this.topicData.user_id = this.user_info.user_id;
      	this.topicData.post_username = this.user_info.username;
  	}


  	postNewTopic() {
  		if(this.item)
  		{
  			this.topicData.topic_id = this.item.topic_id;
  		}

		this.GenericProvider.postData(this.topicData, "postNewTopic").then((result) => {

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
				this.navCtrl.push(TabsPage);
	 		}
    	}, (err) => {
      		//error message
	  		this.navCtrl.push(TabsPage);
   		});
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
