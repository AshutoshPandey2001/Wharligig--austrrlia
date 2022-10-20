import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProxyService {
  baseurl="/aniruddh/wp-json/gf/v2/forms/"
  auth:any={
    consumer_key:'ck_5cae7c87d75b18cf62d07179e44f906969fd9f30',
    consumer_secret:'cs_6a2d4ae5ff8896f5277f0894a4f2e0990b31fb19'
  
  };

  constructor( private httpclient:HttpClient) { }

  getFormList(): Observable<any[]>{
    return this.httpclient.get<any[]>(this.baseurl , {params:this.auth})
  }

  getFormById(id):Observable<any[]>{
    return this.httpclient.get<any[]>(this.baseurl + id, {params:this.auth})

  }
}
