import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BackendService } from './backend.service';
import { UserDataService } from './user-data.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private backendService: BackendService, public userDataService: UserDataService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const currentUser = this.backendService.getUserData();

    if(currentUser && currentUser.token) {

      let customPayload = {};
      let term = '';
      let org = this.userDataService.getSelectedOrg();
      if (org) {
        customPayload['saOrgId'] = org.id;
        // customPayload['saOrgAdmName'] = org.organization_name;
        customPayload['saOrgName'] = org.organization_name;

        term = request.url.includes('?') ? '&' : '?';
        term = term + 'saOrgId=' + org.id + '&saOrgName=' + org.organization_name;
      }

      /*Code for upload image*/
      let ignoreUrl = request.url.split('/')[request.url.split('/').length-1];

      request = request.clone({
        setHeaders: {
          Authorization: `${currentUser.token}`
        },
        body: ignoreUrl != 'upload' ? {...request.body, ...customPayload } : request.body,
        url: request.url + term
      });
    }

    return next.handle(request);
  }
}