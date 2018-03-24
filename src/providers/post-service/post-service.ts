import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

let apiUrl = "http://localhost/theAppDB/api/";

@Injectable()
export class PostService {
  
    constructor(public http: Http) {
        
    }
	
    getForumReply(type, topic_id) {
        return new Promise((resolve, reject) => {
            let headers = new Headers();
           
            this.http.post(apiUrl + type, JSON.stringify(topic_id), { headers: headers }).subscribe(res => {
                resolve(res.json());
            }, (err) => {
                reject(err);
            });
        });
    }
	
	
    getPostedReply(type, post_id) {
        return new Promise((resolve, reject) => {
            let headers = new Headers();
           
            this.http.post(apiUrl + type, JSON.stringify(post_id), { headers: headers }).subscribe(res => {
                resolve(res.json());
            }, (err) => {
                reject(err);
            });
        });      
    }

    newPostService(postdata, type) {
        return new Promise((resolve, reject) => {
            let headers = new Headers();
           
            this.http.post(apiUrl + type, JSON.stringify(postdata), { headers: headers }).subscribe(res => {
                resolve(res.json());
            }, (err) => {
                reject(err);

            });
        });
    }

}
