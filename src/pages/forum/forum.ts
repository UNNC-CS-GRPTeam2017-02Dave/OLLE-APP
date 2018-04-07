import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, App } from 'ionic-angular';
import { GenericProvider } from '../../providers/generic/generic';
import { ForumNewtopicPage} from '../forum-newtopic/forum-newtopic';
import { ForumItemDetailPage} from '../forum-item-detail/forum-item-detail';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-forum',
  templateUrl: 'forum.html'
})
export class ForumPage {

	items: any;
	responseData:any;
	userPostData = {"user_id":"", "token":""};
 	storage: any;
 	isAdmin: boolean = false;
 	isMaster: boolean = false;


	constructor(public http:Http, public navCtrl: NavController, public app:App, public GenericProvider: GenericProvider) {

	}

	ngOnInit(){
		this.storage = JSON.parse(localStorage.getItem('userData')).userData;
    	console.log(this.storage);

    	this.userPostData.user_id = this.storage.user_id;
    	this.userPostData.token  = this.storage.token;

		this.GenericProvider.getTopics().subscribe(response => {
			this.responseData = response;
			this.items = this.responseData.TopicsData;
      console.log("Hello World");
		});

		this.getAdmin();
	}

	/*
	initializeItems() {
		this.items = this.responseData.TopicsData;
	}
	*/
	viewItemDetail(item){

		this.navCtrl.push(ForumItemDetailPage, {
			item: item
		});
	}

	goToNewTopicPage(){
		this.navCtrl.push(ForumNewtopicPage);
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

		});
  }

	removeTopic(item){
		this.GenericProvider.postData(item.topic_id, "removeTopic").then((result) => {
      		this.responseData = result;
      		this.items.splice(this.items.indexOf(item), 1);
    	}, (err) => {
      		//error message
    	});
	}

	editTopic(item){
		this.navCtrl.push(ForumNewtopicPage, {
			item: item
		});
	}
}
