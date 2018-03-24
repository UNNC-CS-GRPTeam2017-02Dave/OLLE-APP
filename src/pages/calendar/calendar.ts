import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
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
  
  calendar = {
  	mode: 'month',                 // specifies the view (week, month, etc.)
  	currentDate: this.selectedDay
  }
  
  constructor(public navCtrl: NavController,private modalCtrl: ModalController, private alertCtrl:AlertController) {

  }
  
  addEvent(){
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
  })
  }
  
  onViewTitleChanged(title){
	 console.log("Hello");
  	this.viewTitle = title
  }
  
  onTimeSelected(ev){
  	this.selectedDay = ev.selectedTime
  }
  
  onEventSelected(event){
  let start = moment(event.startTime).format('LLLL');
  let end = moment(event.endTime).format('LLLL');
  
  let alert = this.alertCtrl.create({
  	title:''+event.title,
  	subTitle:'From:'+start+'<br>To:' + end,
  	buttons:['OK']
  });
  alert.present()
 }
}