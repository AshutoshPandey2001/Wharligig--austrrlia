import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { RestClient } from './rest-client.service';
import { BackendService } from './backend.service';
import { S3Service } from './s3.service';
import { JwtInterceptor } from './jwt.interceptor';
import { ErrorInterceptor } from './error.interceptor';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule
  ],
  declarations: [],
  providers: [
  	RestClient,
  	BackendService,
    S3Service,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
})
export class ServicesModule { }
