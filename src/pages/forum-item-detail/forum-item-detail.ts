
import { Component} from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { ForumReplyPage} from '../forum-reply-modal/forum-reply-modal';
import { GenericProvider } from '../../providers/generic/generic';


@IonicPage()
@Component({
  selector: 'page-forum-item-detail',
  templateUrl: 'forum-item-detail.html',
})
export class ItemDetailPage {

	item: any;
  	items: any;	
  	responseData: any;
  	storage: any;
  	item1: any;
  	root_reply:any;
  	posted_reply: any;
  	PostedInfo = {"topic_id": "", "parent_id":"", "user_id":"", "token":""};
  	ReplyData = {"user_id":"", "token":"", "topic_id":""};

  	constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, public GenericProvider:GenericProvider) {
	  
    	this.item = navParams.get('item');

    	this.storage = JSON.parse(localStorage.getItem('userData')).userData;
  
    	this.PostedInfo.user_id = this.storage.user_id;
    	this.PostedInfo.token  = this.storage.token;

    	this.ReplyData.user_id = this.storage.user_id;
    	this.ReplyData.token  = this.storage.token;
    	this.ReplyData.topic_id  = this.item.topic_id;

    	this.getForumReply();
  	}

  	getForumReply(){

  		this.GenericProvider.postData(this.item.topic_id, "getForumReply").then((result) => {
 
	 		this.responseData = result;
	 		this.items = this.responseData.ForumReplyData;
	 		this.root_reply = this.items;
	 		
    	}, (err) => {
      		//error message 
    	});
  	}
 
  	goToNewReply(item){
		
    	let modal = this.modalCtrl.create(ForumReplyPage, {item:item});
  	   
  	modal.onDidDismiss(data => {
  		if(data)
  		{
  			if(!data.parent_id){

  				if(this.root_reply.length==0)
  					this.getForumReply();
  				else
					this.root_reply.push(data);				
  			}	
  		}
    	}); 

    	modal.present();
  	}
  
  	initializeItems() {
    	this.items = this.root_reply;
  	}


  	getPostedReply(parent){
  		this.PostedInfo.topic_id = this.item.topic_id;
  		this.PostedInfo.parent_id = parent.post_id;

  		this.GenericProvider.postData(this.PostedInfo, "getPostedReply").then((result) => {
	 		this.responseData = result;	 		 		
	 		this.posted_reply = this.responseData.PostedReplyData;
    	}, (err) => {
      		//error message 
    	});
  	}

  	
    view_comments(child, parent){	
						
		if(child.parent_id == parent.post_id)
			return true;
		else
			return false;
	}

	
  	getItems(ev: any) {
    	// Reset items back to all of the items
    	this.initializeItems();
    	// set val to the value of the searchbar
    	let val = ev.target.value;
       
  		if(this.items) {

  			if (val && val.trim() != '') {
      
      			this.items = this.items.filter((item) => {
        			return (item.language.toLowerCase().indexOf(val.toLowerCase()) > -1);
      			})  
    		}
  		}    	
  	}

  	isReplyEmpty(){

  		if(this.posted_reply){
  			return true;
  		}
  		else{
  			return false;
  		}
  	} 
}
