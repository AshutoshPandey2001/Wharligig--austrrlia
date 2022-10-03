import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Router} from "@angular/router";

import { BackendService } from './backend.service';
import { UserDataService } from './user-data.service';
import { EventService } from './event.service';
import { Constants } from '../constants/constants';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private backendService: BackendService, public userData: UserDataService, private event: EventService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        /*Opening confirmation overlay*/
        this.event.sendMessage({
          type: Constants.OPEN_LOGIN_MODAL
        });

        this.userData.silentLogout();
      }
      if (err.status === 404) {
        // if 404 code return redirect to page not found
        this.router.navigate(['not-found']);
      }

      const error = err.error.errors || err.statusText;
      return throwError(error);
    }))
  }
}