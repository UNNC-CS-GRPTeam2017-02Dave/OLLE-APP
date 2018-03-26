
import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, App, } from 'ionic-angular';
import { NewreplypostPage} from '../newreplypost/newreplypost';
import { PostService } from '../../providers/post-service/post-service';

/**
 * Generated class for the ItemDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html',
})
export class ItemDetailPage {

	item: any;
  	items: any;
  		
  	responseData: any;

  	item1: any;
  	root_reply:any;
  	posted_reply: any;
  
  	//drawerOptions: any;
  	//displayOnLoad: boolean = false;


  	constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public PostService: PostService) {
	  
    	this.item = navParams.get('item');
  	}
 
  	goToNewReply(item){
	
   		this.navCtrl.push(NewreplypostPage, {
      		item: item
    	});
  	}
  
  	initializeItems() {
    	this.items = this.root_reply;
  	}

  	ngOnInit() {
   	
    	this.PostService.getForumReply("getForumReply",this.item.topic_id).then((result) => {
 
	 		this.responseData = result;
	 		this.items = this.responseData.ForumReplyData;
	 		this.root_reply = this.items;
    	}, (err) => {
      		//error message 
    	});
  	}

  	getPostedReply(parent){
  	
  		this.PostService.getPostedReply("getPostedReply",parent.post_id).then((result) => {
 		
	 		this.responseData = result;
	 		this.posted_reply = this.responseData.PostedReplyData;

    	}, (err) => {
      		//error message 
    	});
  	}

    view_comments(item, item1){	
		
		if(item.parent_id == item1.post_id)
			return true;
		else
			return false;
	}

	
  	getItems(ev: any) {
    	// Reset items back to all of the items
    	this.initializeItems();
    	// set val to the value of the searchbar
    	let val = ev.target.value;
       
  		if(this.items.length>0) {

  			if (val && val.trim() != '') {
      
      			this.items = this.items.filter((item) => {
        			return (item.user_post.toLowerCase().indexOf(val.toLowerCase()) > -1);
      			})  
    		}
  		}    	
  	} 
}