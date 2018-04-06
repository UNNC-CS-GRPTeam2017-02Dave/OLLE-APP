import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as papa from 'papaparse';
import {Http} from '@angular/http';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})
export class CalendarPage {
  csvData: any[]=[];
  headerRow: any[]=[];

  constructor(public navCtrl: NavController, private http:Http) {
  	this.readCsvData();

  }

  private readCsvData(){

  	this.http.get('assets/Data.csv').subscribe(
  		data => this.extractData(data),
  		err =>this.handleError(err)
  	);
  }

  private extractData(res){
  	let csvData = res['_body'] || '';
  	let parsedData = papa.parse(csvData).data;

  	this.headerRow = parsedData[0];

  	parsedData.splice(0,1);
  	this.csvData = parsedData;
  }

  downloadCSV(){

  }


  handleError(err) {

  }
}
