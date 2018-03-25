import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-event-modal',
  templateUrl: 'event-modal.html',
})
export class EventModalPage {
  event = { startTime: new Date().toISOString(), endTime: new Date().toISOString(), allDay: false}
  minDate = new Date().toISOString();
  responseData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtrl:ViewController, private authService: AuthServiceProvider) {
    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    //console.log(preselectedDate);
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;
  }

  /*.toISOString()*/
  save(){
  	// store information in db
    // change format suitable for SQL TIMESTAMP variable
    this.event.startTime = moment(this.event.startTime).format("YYYY-MM-DD HH:MM:SS");
    this.event.endTime = moment(this.event.endTime).format("YYYY-MM-DD HH:MM:SS");
    console.log(this.event);
    //console.log(this.event.description);
    this.authService.postData(this.event, "storeCalendarEvent").then((res) => {
      this.responseData = res;
      console.log(this.responseData)

    }, (err) => {

    });

    this.viewCtrl.dismiss(this.event);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventModalPage');
  }

}
