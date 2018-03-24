import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController } from 'ionic-angular';
import { PostService } from '../../providers/post-service/post-service';
import { ItemDetailPage } from '../item-detail/item-detail';
import { Http, Headers } from '@angular/http';

/**
 * Generated class for the NewreplypostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-newreplypost',
  templateUrl: 'newreplypost.html',
})
export class NewreplypostPage {
  responseData: any;
  public userDatail: any;
  item1: any;
  item: any;
  topicTitle: any;
  itemFromTopic:any;
  
 
  public userDataPK: String;
  
  postTopicReply = { "post_id":"","user_post": "", "username": "", "topic_id": "", "parent_id": "" };
  user_info = JSON.parse(localStorage.getItem('userData')).userData;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public app: App, public PostService: PostService, public toastCtrl: ToastController) {
    this.item = navParams.get('item');
  }
  ngOnInit() {
     
  	this.postTopicReply.topic_id = this.item.topic_id;
	this.postTopicReply.username = this.user_info.username;
	this.postTopicReply.parent_id = this.item.parent_id;
	this.postTopicReply.parent_id = this.item.post_id;
  }

  postNewTopicReply() {
    
    this.PostService.newPostService(this.postTopicReply, "postNewTopicReply").then((result) => {
      this.responseData = result;
      
      if(this.responseData.error1)
	  {
		this.presentToast("Invalid reply");
	  }
	  else{
	  	this.viewItemDetail(this.item);
	  }      
    }, (err) => {
      //error message
    });
	
  }
	
  viewItemDetail(item) {
    this.navCtrl.push(ItemDetailPage, {
      item: item
    });
  }
	
  ionViewDidLoad() {
    //console.log('ionViewDidLoad NewreplypostPage');
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
