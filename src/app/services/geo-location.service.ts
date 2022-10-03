import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable, throwError} from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { ServerConstants } from '../constants/server.constants';
import { RestClient } from './rest-client.service';
import { Constants } from '../constants/constants';

@Injectable({
    providedIn: 'root'
})
export class GEOLocationService {
  constructor(private restClient: RestClient) {}

 getPosition(): Promise<any>{
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resp => {

      resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
    },
      err => {
        reject(err);
      });
    });

  }

}