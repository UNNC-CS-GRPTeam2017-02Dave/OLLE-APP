import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

let apiUrl = "http://localhost/theAppDB/api/";

@Injectable()
export class ForumService {
	
    constructor(public http: Http){
        
    } 
	
	getTopics(){
        let headers = new Headers();
        return this.http.get(apiUrl + 'getTopics', { headers: headers }).map(res => res.json());
    }
	
	 postNewForumTopic(topicdata, type) {
		 
        return new Promise((resolve, reject) => {
			
            let headers = new Headers();
			
            this.http.post(apiUrl+type, JSON.stringify(topicdata), { headers: headers }).subscribe(res => {
                
				//console.log(res);
				resolve(res.json());
            }, (err) => {
			
                reject(err);
            });
			
        });
		
    }


    removeTopic(topic_id, type){

    	return new Promise((resolve, reject) => {
			
            let headers = new Headers();
			
            this.http.post(apiUrl+type, JSON.stringify(topic_id), { headers: headers }).subscribe(res => {
                
				//console.log(res);
				resolve(res.json());
            }, (err) => {
			
                reject(err);
            });
			
        });

    }

    get_user_info(user_id, type) {

    	return new Promise((resolve, reject) => {
			
            let headers = new Headers();
			
            this.http.post(apiUrl+type, JSON.stringify(user_id), { headers: headers }).subscribe(res => {
                
				//console.log(res);
				resolve(res.json());
            }, (err) => {
			
                reject(err);
            });
			
        });
    }
}