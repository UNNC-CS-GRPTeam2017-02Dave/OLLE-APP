import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController,ModalController } from 'ionic-angular';
import { GenericProvider } from '../../providers/generic/generic';
import { NewtopicPage} from '../forum-newtopic-modal/forum-newtopic-modal';
import { ForumTopicSettingsPage} from '../forum-topic-settings/forum-topic-settings';
import { ItemDetailPage} from '../forum-item-detail/forum-item-detail';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-forum',
  templateUrl: 'forum.html'
})
export class ForumPage {

	items: any;
	responseData:any;
	userPostData = {"user_id":"", "token":""};
	removeData = {"user_id":"", "token":"", "topic_id":""}
 	storage: any;
 	isAdmin: boolean = false;
 	isMaster: boolean = false;
 	index: number;

	constructor(public http:Http, public navCtrl: NavController,private modalCtrl: ModalController, public GenericProvider: GenericProvider) { 

		this.storage = JSON.parse(localStorage.getItem('userData')).userData;

    	this.userPostData.user_id = this.storage.user_id;
    	this.userPostData.token  = this.storage.token;	
		
		this.getTopics();
		this.getAdmin();  	
	}
	
	getTopics(){
		this.GenericProvider.getTopics().subscribe(response => {
			this.responseData = response;
			this.items = this.responseData.TopicsData;
		});
	}

	/*
	initializeItems() {
		this.items = this.responseData.TopicsData;		
	}
	*/
	viewItemDetail(item){
		
		this.navCtrl.push(ItemDetailPage, {
			item: item
		});	
	}

	goToNewTopicPage(){
		
		let modal = this.modalCtrl.create(NewtopicPage);
		modal.present();
  	   
  		modal.onDidDismiss(data => {
  			if(this.items.length ==0){
  					
  				this.getTopics();
  			}
  			else{
  				this.items.unshift(data);
  			}
    	}); 	
	}

	getAdmin(){

    	this.GenericProvider.postData(this.userPostData, "isAdminUser").then((res) => {
      		this.responseData = res;

      		// isAdmin
      		if( this.responseData.true ) {
       		 this.isAdmin = true;

      		} else if ( this.responseData.isMaster ) {
        		this.isMaster = true;     
      		}

    		}, (err) => {
      			//error message
    	});
    }

	removeTopic(item)
	{	
		this.removeData.user_id = this.storage.user_id;
    	this.removeData.token  = this.storage.token;
    	this.removeData.topic_id = item.topic_id;

		this.GenericProvider.postData(this.removeData, "removeTopic").then((result) => {
      		this.responseData = result; 
      		this.items.splice(this.items.indexOf(item), 1);   		   
    	}, (err) => {
      		//error message
    	});	
	}

	editTopic(item)	
	{
		this.index = this.items.indexOf(item);
		console.log(this.index);

		let modal = this.modalCtrl.create(ForumTopicSettingsPage,{
			item: item
		});
		modal.present();
  	   
  		modal.onDidDismiss(data => {
  			
  			if(data){
  				console.log(data);
  				this.items[this.index].topic_title = data.topic_title;
  				this.items[this.index].topic_date = data.topic_date;
  				this.items[this.index].topic_detail = data.topic_detail;
  				this.items[this.index].topic_week = data.topic_week;
  			}
    	}); 
	}
}
