import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-chat-m',
  templateUrl: 'chat-m.html',
})
export class InstantMessagingPage {
  @ViewChild(Content) content: Content;
  @ViewChild('head') head: any;
  @ViewChild('footer') footer: any;

  item: any;
  messages: any[];
  newMessages: any[];
  messageInfo: any;
  message: string ="";
  responseData: any;
  postOldMessageData = {"chat_id":"", "message_id":"", "time":"" };
  postNewMessageData = {"chat_id":"", "message_id":"", "time":"" };
  postUserMessage    = {"chat_id":"", "user_id":"", "message":"" };
  supp: any;
  drawerOptions: any;
  displayOnLoad: boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider, public elRef:ElementRef) {
      const data = JSON.parse(localStorage.getItem('userData'));

      this.item = navParams.get('item');

      this.postUserMessage.user_id    = navParams.get('user_id');
      this.postUserMessage.chat_id    = this.item.chat_id;
      this.postNewMessageData.chat_id = this.item.chat_id;
      this.postOldMessageData.chat_id = this.item.chat_id;
      this.supp = data.userData.username;

      this.getFirstBatchMessages();
      this.getNewMessages();
      //this.getNewMessages();
  }


  /* Executed after the constructor / compiling the html code. */
  ngAfterViewInit(){
    let yAxisHeader: number = this.head.nativeElement.clientHeight;
    let yAxisFooter: number = this.footer.nativeElement.clientHeight;
    console.log(yAxisHeader);
    console.log(yAxisFooter);

    /* Generate sliding Component */
    // It is generated after loading the screen (executing the constructor) because height of the header can be obtained ONCE it has been generated. Lifecycle.
    this.drawerOptions = {
        handleHeight: 56,
        thresholdFromBottom: 100,
        thresholdFromTop: 100,
        bounceBack: true,
        // sizeOfHeader & sizeOfFooter
        topContent: yAxisHeader,
        bottomContent: 2*yAxisFooter
    };

    // load the drawer.
    this.displayOnLoad = true;
  }

  getFirstBatchMessages() {
    // no need to send this.postNewMessageData
    this.authService.postData(this.postOldMessageData, "getFirstBatchMessages").then((result) => {

        this.responseData = result;
        // store array of messages
        if( this.responseData.fData[0] != null ) {
            this.messages = this.responseData.fData;

            // Get oldest displayed message details
            this.postOldMessageData.message_id = this.messages[0].message_id;
            this.postOldMessageData.time = this.messages[0].time_sent;

            // Get most recent message Details
            this.postNewMessageData.message_id = this.messages[this.messages.length-1].message_id;
            this.postNewMessageData.time = this.messages[this.messages.length-1].time_sent;
            //console.log(this.postOldMessageData);
        }

        // scroll to bottom message. Timeout required, otherwise messages are not processed appropriately , resulting in 'scrollHeight == contentHeight', see word document and do drawing.
        setTimeout(() => this.scrollToBottom(), 10);

    }, (err) => {
        //DB Connection failed message
        console.log("Cannot send message");
    });
  }

  getNewMessages() {
    setInterval(() => this.askRequest(), /*10000*/250);
  }

  askRequest() {
    this.authService.postData(this.postNewMessageData, "getNewMessages").then((result) => {
        //console.log(result.fData[1]);
        this.responseData = result;

        // there are new messages
        if( this.responseData.fData[0] != null ) {

            for( let i = 0; i<this.responseData.fData.length; i++){
              // add them to the array
              this.messages.push(this.responseData.fData[i]);
            }

            // get new messageID and time_sent
            this.postNewMessageData.message_id = this.messages[this.messages.length-1].message_id;
            this.postNewMessageData.time = this.messages[this.messages.length-1].time_sent;
            //console.log(this.messages);

            // go to bottom message
            this.scrollToBottom();
        }
    }, (err) => {
        //DB Connection failed message
        console.log("Cannot send message");
    });
  }

  sendMessage() {
    this.postUserMessage.message = this.message;
    console.log(this.postUserMessage);
    this.authService.postData(this.postUserMessage, "storeMessage").then((result) => {
        //this.messages = this.responseData.fData;
    }, (err) => {
        //DB Connection failed message
        console.log("Cannot send message");
    });

    this.message ="";
    this.scrollToBottom();
  }

  scrollToBottom() {
    // this.content belongs just to the method related with infinite scroll, and cannot be used elsewhere outside scrollToBottom class
    let dimensions = this.content.getContentDimensions();

    // All content (visible and not visible in the screen) // do a drawing to show the logic
    console.log(dimensions.scrollHeight);

    // Viewable content (screen size)
    console.log(dimensions.contentHeight);

    // Display: AllContent - Sizeof(screen) + 100px ;  100 allow for new message.
    this.content.scrollTo(0, dimensions.scrollHeight-dimensions.contentHeight+100, 100);
  }

  /* Get more messages when scrolled to top */
  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.authService.postData(this.postOldMessageData, "getBatchMessages").then((result) => {

          this.responseData = result;
          // store array of messages
          this.messages = this.responseData.fData.concat(this.messages);

          // Get oldest displayed message details
          this.postOldMessageData.message_id = this.messages[0].message_id;
          this.postOldMessageData.time = this.messages[0].time_sent;

      }, (err) => {
          //DB Connection failed message
          console.log("Cannot send message");
      });
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

}
