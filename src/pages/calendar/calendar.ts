import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController } from 'ionic-angular';
import { GenericProvider } from '../../providers/generic/generic';
import * as moment from 'moment';


//npm install ionic2-calendar moment intl@1.2.5 -- save
@Component({
  selector: 'pages-Calendar',
  templateUrl: 'calendar.html'
})

export class CalendarPage {
  eventSource = [];   // list of events
  viewTitle:string;
  selectedDay = new Date();
  userPostData = {"user_id":"", "token":""};
  eventPostData = {"user_id":"", "token":"", "event_id":""};
  responseData: any;
  storage: any;
  isAdmin: boolean = false;
  isMaster: boolean = false;

  calendar = {
  	mode: 'month',                 // specifies the view (week, month, etc.)
  	currentDate: this.selectedDay
  }

  constructor(public navCtrl: NavController,private modalCtrl: ModalController, private alertCtrl:AlertController, private genProvider: GenericProvider, private toastCtrl: ToastController) {
    this.storage = JSON.parse(localStorage.getItem('userData')).userData;
    console.log(this.storage);

    this.userPostData.user_id = this.storage.user_id;
    this.userPostData.token   = this.storage.token;
    this.eventPostData.user_id = this.storage.user_id;
    this.eventPostData.token   = this.storage.token;
    //this.isAdmin = this.storage.user_account_status === "admin" ? true : false;
    this.getAdmin();
    this.getEvents();
  }

  /* Query for user_account_status */
  getAdmin(){
    this.genProvider.postData(this.userPostData, "isAdminUser").then((res) => {
      this.responseData = res;

      // isAdmin
      if( this.responseData.true ) {
        this.isAdmin = true;

      } else if ( this.responseData.isMaster ) {
        this.isMaster = true;
        //console.log("Hello");
      }

    }, (err) => {
      // missing code
    });
  }

  getEvents() {
    this.genProvider.postData(null, "getCalendarEvents").then((res) => {
      this.responseData = res;
      console.log(this.responseData.fData[0]);

      for( let i=0; i<this.responseData.fData.length; i++) {
          this.responseData.fData[i].startTime = new Date(this.responseData.fData[i].startTime);
          this.responseData.fData[i].endTime = new Date(this.responseData.fData[i].endTime);
      }
      //console.log("Hello World!");

      setTimeout(() => {
        this.eventSource = this.responseData.fData;
      });
      //this.eventSource = this.responseData.fData;

    }, (err) => {

    });
  }

  /* Generates the page to addEvent(), retrieves info from 'data' variable */
  addEvent() {
  	let modal = this.modalCtrl.create('EventModalPage',{
      selectedDay:this.selectedDay,
      string: "Add Event"
    });
  	modal.present();

	   // when modal/event page is closed
  	modal.onDidDismiss(data => {
	   //console.log(data);
    	if(data) {
    		let eventData = data;

    		eventData.startTime = new Date(data.startTime);
    		eventData.endTime = new Date(data.endTime);

    		let events = this.eventSource;
    		events.push(eventData);
    		this.eventSource = [];
    		setTimeout(() => {
    			this.eventSource = events;
    		});
      }
    });
  }

  removeOld(){
    this.genProvider.postData(null, "removeOutdatedCalendarEvents").then((res) => {
      this.responseData = res;

      if( this.responseData.deleted ){
        this.presentToast("Outdated events deleted successfully.");

      } else {
        this.presentToast("Contact developers, error in DB code.")
      }
    }, (err) => {
      // Fatal error.
    });
  }

  // when swiping the calendar
  onViewTitleChanged(title){
  	this.viewTitle = title;
  }

  onTimeSelected(ev){
  	this.selectedDay = ev.selectedTime;
  }

  onEventSelected(event){
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');

    if ( this.isAdmin || this.isMaster ) {

      let alert = this.alertCtrl.create({
      	title:''+event.title,
      	subTitle:''+event.description +'<br><br>From:'+start+'<br>To:' + end,
      	//buttons:['OK']
        buttons:[
            {
                text: 'Delete',
                handler: () => {
                  /* Event is not deleted dynamically. Requires to reload page. */
                  this.eventPostData.event_id = event.event_id;

                  this.genProvider.postData(this.eventPostData, "deleteCalendarEvent").then((res) => {
                      this.responseData = res;

                      if( this.responseData.deleted ){
                        // remove event from array
                        // this.eventSource.splice(this.eventSource.indexOf(event), 1);

                        let events = this.eventSource;
                        events.splice(events.indexOf(event), 1);
                    		this.eventSource = [];
                    		setTimeout(() => {
                    			this.eventSource = events;
                    		});

                        this.presentToast("Event deleted successfully.")
                      }
                      else if ( this.responseData.LogoutError ) {
                        // Logout + Warning
                      }
                  });
                }
            },
            {
                text: 'Edit',
                handler: () => {
                  let modal = this.modalCtrl.create('EventModalPage',{
                    selectedDay:this.selectedDay,
                    event_id: event.event_id,
                    string: "Modify"
                  });
                	modal.present();

              	   // when modal/event page is closed
                	modal.onDidDismiss(data => {
              	   //console.log(data);
                  	if(data) {
                  		let eventData = data;

                  		eventData.startTime = new Date(data.startTime);
                  		eventData.endTime = new Date(data.endTime);

                      //this.eventSource[this.eventSource.indexOf(event)] = eventData;
                  		let events = this.eventSource;
                  		events[events.indexOf(event)] = eventData;
                  		this.eventSource = [];
                  		setTimeout(() => {
                  			this.eventSource = events;
                  		});
                    }
                  });
                }
            },
            {
                text: 'OK'
            }
        ]
      });

    } else{

      let alert = this.alertCtrl.create({
      	title:''+event.title,
      	subTitle:''+event.description +'<br><br>From:'+start+'<br>To:' + end,
      	buttons:['OK']
      });

    }
    alert.present()
   }

 presentToast(message) {
   let toast = this.toastCtrl.create({
     message: message,
     duration: 3000
   });
   toast.present();
 }
}
