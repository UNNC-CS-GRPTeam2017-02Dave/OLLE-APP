import { Component } from '@angular/core';
import { NavController, NavParams, App, ToastController } from 'ionic-angular';
import { GenericProvider } from '../../providers/generic/generic';
import { TabsPage } from '../tabs/tabs';
/**
 * Generated class for the NewtopicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forum-newtopic',
  templateUrl: 'forum-newtopic.html'
})
export class NewtopicPage {
	storage:any;
	item : any;
	responseData : any;
	topicData = {"topic_id":"","topic_title": "", "topic_detail": "", "topic_date": "", "topic_week": "", "user_id": "", "post_username" :"", "token": ""};
	
	
	constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public GenericProvider: GenericProvider, public toastCtrl: ToastController) {

    	this.item = navParams.get('item');
    }
  
  	ngOnInit() {
	  	this.storage = JSON.parse(localStorage.getItem('userData')).userData;

    	
      	this.topicData.post_username = this.storage.username;       	  
    	this.topicData.user_id = this.storage.user_id;
    	this.topicData.token  = this.storage.token;
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
