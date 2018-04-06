import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
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
  responseData: any;

  calendar = {
  	mode: 'month',                 // specifies the view (week, month, etc.)
  	currentDate: this.selectedDay
  }

  constructor(public navCtrl: NavController,private modalCtrl: ModalController, private alertCtrl:AlertController, private authService: AuthServiceProvider) {
    this.getEvents();
  }

  getEvents() {
    this.authService.postData(null, "getCalendarEvents").then((res) => {
      this.responseData = res;
      console.log(this.responseData.fData[0]);

      for( let i=0; i<this.responseData.fData.length; i++) {
          this.responseData.fData[i].startTime = new Date(this.responseData.fData[i].startTime);
          this.responseData.fData[i].endTime = new Date(this.responseData.fData[i].endTime);
      }
      console.log("Hello World!");

      setTimeout(() => {
        this.eventSource = this.responseData.fData;
      });
      //this.eventSource = this.responseData.fData;

    }, (err) => {

    });
  }

  addEvent() {
  	let modal = this.modalCtrl.create('EventModalPage',{selectedDay:this.selectedDay});
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

  // when swipe the calendar
  onViewTitleChanged(title){
	 console.log("Hello");
  	this.viewTitle = title;
  }

  onTimeSelected(ev){
  	this.selectedDay = ev.selectedTime;
  }

  onEventSelected(event){
  let start = moment(event.startTime).format('LLLL');
  let end = moment(event.endTime).format('LLLL');

  let alert = this.alertCtrl.create({
  	title:''+event.title,
  	subTitle:''+event.description +'<br><br>From:'+start+'<br>To:' + end,
  	buttons:['OK']
  });
  alert.present()
 }
}