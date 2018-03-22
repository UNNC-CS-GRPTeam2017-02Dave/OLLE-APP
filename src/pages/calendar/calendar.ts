import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})
export class CalendarPage {
  @ViewChild('head') head: any;

  drawerOptions: any;
  displayNow: boolean = false;

  constructor(public navCtrl: NavController) {
  }

  ngAfterViewInit(){
    //var element:HTMLElement = document.getElementById('head');
    //let el = this.elRef.nativeElement;
    //let elInfo = this.head.nativeElement.offsetTop;
    //let elInfo = el.getElementById('head').getBoundingClientRect();
    let y: number = this.head.nativeElement.clientHeight;
    console.log(y);

    console.log("Hello");

    this.drawerOptions = {
        handleHeight: 56,
        thresholdFromBottom: 100,
        thresholdFromTop: 100,
        bounceBack: true,
        // 112 is sizeOfScreen(Android)
        topContent: y,/*dimensions.contentTop,*/
        bottomContent: 112/*dimensions.contentBottom*/
    };


    this.displayNow = true;


    //var positionInfo = element.getBoundingClientRect();
    //console.log(positionInfo);
    /*var height = positionInfo.height;
    var width = positionInfo.width;*/
  }
}
