import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, App, LoadingController } from 'ionic-angular';
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
	
	 
	constructor(public http:Http, public navCtrl: NavController, public app:App, private loadingCtrl: LoadingController, public ForumService: ForumService) {   
     
		let loadingPopup = this.loadingCtrl.create({
			content: 'Loading posts...'
		});
		
		ForumService.getTopics().subscribe(response => {
			
			this.topicsresponse = response;
	
			this.initializeItems();
			loadingPopup.dismiss();
			
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
	/*
	getItems(ev: any) {
		// Reset items back to all of the items
		this.initializeItems();
		// set val to the value of the searchbar
		let val = ev.target.value;
		// if the value is an empty string don't filter the items
		if (val && val.trim() != '') {
			this.items = this.items.filter((item) => {
			return (item.topic_title.toLowerCase().indexOf(val.toLowerCase()) > -1);
		})
		}
	}
	*/
	viewItemDetail(item){
		
		this.navCtrl.push(ItemDetailPage, {
			item: item
		});
		
	}
	goToNewTopicPage(){
		this.navCtrl.push(NewtopicPage);
	}

	validate_status(){	
		
		if(this.user_Data.username == "SU")
			return true;
		else
			return false;
	}
}
