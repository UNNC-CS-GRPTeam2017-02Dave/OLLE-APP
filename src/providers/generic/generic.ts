import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

let apiUrl = "http://193.112.162.152/theAppDB/api/";
//let apiUrl = "http://localhost/theAppDB/api/";

@Injectable()
export class GenericProvider {

  constructor(public http: Http) {

  }

  postData(credentials, type){
    //console.log('Hello');
    return new Promise((resolve, reject) => {
      let headers = new Headers();

      this.http.post(apiUrl+type, JSON.stringify(credentials), {headers: headers}).subscribe(res => {
        console.log(res);
        resolve(res.json()); // error
      }, (err) => {
        reject(err);
      });
    });
  }

  getTopics(){
      let headers = new Headers();
      return this.http.get(apiUrl + 'getTopics', { headers: headers }).map(res => res.json());
  }
}
