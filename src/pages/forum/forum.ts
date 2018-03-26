import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, App } from 'ionic-angular';
import { ForumService } from '../../providers/forum-service/forum-service';
import { NewtopicPage} from '../newtopic/newtopic';
import { ItemDetailPage} from '../item-detail/item-detail';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-forum',
  templateUrl: 'forum.html'
})
export class ForumPage {

	private topicsresponse: any;
	items: any;
	user_Data: any;
	user_status: any;
	responseData:any;
	
	 
	constructor(public http:Http, public navCtrl: NavController, public app:App, public ForumService: ForumService) {   
		this.ForumService.getTopics().subscribe(response => {
			this.items = response.TopicsData;
		});

		this.user_Data = JSON.parse(localStorage.getItem('userData')).userData;

		this.ForumService.get_user_status(this.user_Data.user_id, "get_user_status").then((result) => {
      		this.responseData = result; 
      		this.user_status = this.responseData.userInfo[0].user_account_status;

    	}, (err) => {
      	//error message
    	});
	}
	
	ngOnInit(){
		
		this.ForumService.getTopics().subscribe(response => {
			this.items = response.TopicsData;
		});

		this.user_Data = JSON.parse(localStorage.getItem('userData')).userData;
	}

	initializeItems() {
		this.items = this.topicsresponse.TopicsData;		
	}
	
	viewItemDetail(item){
		
		this.navCtrl.push(ItemDetailPage, {
			item: item
		});
		
	}
	goToNewTopicPage(){
		this.navCtrl.push(NewtopicPage);
	}

	validate_status(){	

		if(this.user_status == "admin")
			return true;
		else
			return false;
	}

	removeTopic(item)
	{
		this.ForumService.removeTopic(item.topic_id, "removeTopic").then((result) => {
      		this.responseData = result; 
      		this.items.splice(this.items.indexOf(item), 1);
      		   
    	}, (err) => {
      	//error message
    	});
	}
}