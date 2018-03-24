import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

//let apiUrl = "http://www.losaf.cn/theAppDB/api/";
let apiUrl = "http://localhost/theAppDB/api/";

@Injectable()
export class AuthServiceProvider {

  constructor(public http: Http) {
    console.log('Hello AuthServiceProvider Provider');
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

}
