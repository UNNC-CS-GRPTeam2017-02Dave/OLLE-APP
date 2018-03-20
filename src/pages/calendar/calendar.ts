import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})
export class CalendarPage {

  drawerOptions: any;

  constructor(public navCtrl: NavController) {
    this.drawerOptions = {
        handleHeight: 50,
        thresholdFromBottom: 100,
        thresholdFromTop: 100,
        bounceBack: true
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Calendar');
  }

}
