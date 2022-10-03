import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Constants } from '../../constants/constants';
import { BackendService } from '../../services/backend.service'
import { LoadingService } from '../../services/loading.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-cookie-policy',
  templateUrl: './cookie-policy.component.html',
  styleUrls: ['./cookie-policy.component.scss']
})
export class CookiePolicyComponent implements OnInit {

  constructor(private toastr: ToastrService, private backendService: BackendService, private loadingService: LoadingService, public commonService: CommonService) { }

  @Output() onCloseCookie = new EventEmitter<any>();
  iPAddress:any;

  ngOnInit() {
    this.getIPAddress();
  }

  closeCookie(){
    this.onCloseCookie.emit();
  }

  getIPAddress(){
    this.backendService.getIPAddress()
    .subscribe(result => {
      this.iPAddress = result.ip;
    },
    error => {
    });
  }

  acceptCookie(){
    let timeStamp = new Date().getTime();
    this.backendService.acceptCookie({
      ip: this.iPAddress,
      timestamp: timeStamp
    })
    .subscribe(result => {
      if(result.code == 200) {
      this.onCloseCookie.emit();
      this.toastr.success('Accepted');
      }
    },
    error => {
    });
  }
}
