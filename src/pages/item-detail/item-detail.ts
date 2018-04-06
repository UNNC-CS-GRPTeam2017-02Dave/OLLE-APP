import { Component, ViewChild, ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams, App, } from 'ionic-angular';
import { NewreplypostPage} from '../newreplypost/newreplypost';
import { PostService } from '../../providers/post-service/post-service';

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html',
})
export class ItemDetailPage {

  @ViewChild('head') head: any;
  //@ViewChild('footer') footer: any;

  item: any;
  items: any;
  private replysresponse: any;
  itemsreply: any;
  public userDatail: any;
  responseData: any;
  item1: any;
  posted_reply: any;

  drawerOptions: any;
  displayOnLoad: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App, public PostService: PostService) {

    this.item = navParams.get('item');
    PostService.getForumReply("getForumReply",this.item.topic_id).then((result) => {
 		this.responseData = result;
	 	this.items = this.responseData.ForumReplyData;
    }, (err) => {
      //error message
    });

  }

  ngAfterViewInit(){
  	let yAxisHeader: number = this.head.nativeElement.clientHeight;

  	console.log(yAxisHeader);

  	//let yAxisFooter: number = this.footer.nativeElement.clientHeight;

  	this.drawerOptions = {

  		handleHeight: 56,
  		thresholdFromBottom:100,
  		thresholdFromTop: 100,
  		bounceBack: true,
  		topContent: yAxisHeader,
  		bottomContent: 56
  	};

  	this.displayOnLoad = true;
  }

  goToNewReply(item){

    this.navCtrl.push(NewreplypostPage, {
      item: item
    });
  }

  initializeItems() {
    this.items = this.replysresponse;
  }

  ngOnInit() {

    this.PostService.getForumReply("getForumReply",this.item.topic_id).then((result) => {

	 	this.responseData = result;
	 	this.items = this.responseData.ForumReplyData;
    }, (err) => {
      //error message
    });
  }

  getPostedReply(parent){

  	this.PostService.getPostedReply("getPostedReply",parent.post_id).then((result) => {

	 	this.responseData = result;
	 	this.items = this.responseData.ForumReplyData;
    }, (err) => {
      //error message
    });
  }

    comments_count(item, item1){

		if(item.parent_id == item1.post_id)
			return true;
		else
			return false;
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
        return (item.user_post.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  */
}
