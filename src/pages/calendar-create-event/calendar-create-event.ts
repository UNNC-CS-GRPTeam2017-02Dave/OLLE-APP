import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { GenericProvider } from '../../providers/generic/generic';
import * as moment from 'moment';

@Component({
  selector: 'page-calendar-create-event',
  templateUrl: 'calendar-create-event.html',
})
export class CalendarCreateEventPage {
  event = { startTime: new Date().toISOString(), endTime: new Date().toISOString(), title:"", description:"", event_id:"" };
  minDate = new Date().toISOString();
  event_id: any;
  string: any;
  responseData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtrl:ViewController, private genProvider: GenericProvider, private toastCtrl: ToastController) {
    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.string = this.navParams.get('string');
    this.event_id = this.navParams.get('event_id');
    //console.log(preselectedDate);
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;
  }

  /*.toISOString()*/
  save(){
    // Title and Description != null
    if ( this.event.title && this.event.description ) {
      // store information in db
      // change format suitable for SQL TIMESTAMP variable
        let sup = this.event;
        let method = "";
        sup.startTime = moment(this.event.startTime).format("YYYY-MM-DD HH:MM:SS");
        sup.endTime = moment(this.event.endTime).format("YYYY-MM-DD HH:MM:SS");
        sup.event_id = this.event_id;

        method = this.string === "Modify" ? "updateCalendarEvent" : "storeCalendarEvent";

        this.genProvider.postData(sup, method).then((res) => {
          this.responseData = res;

          if( this.responseData.stored ){
            // include the event_id into the created event
            this.event.event_id = this.responseData.stored.event_id;

          } else if( this.responseData.updated ) {
            this.presentToast("Event updated successfully.");
          }


        }, (err) => {

        });
        this.viewCtrl.dismiss(this.event);

    } else {
        this.presentToast("Ensure all input fields are filled-in.");
    }
  }

  back(){
    this.viewCtrl.dismiss();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }


}
