import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { Constants } from '../../../../constants/constants';
import { BackendService } from '../../../../services/backend.service';
import { UserDataService } from '../../../../services/user-data.service';
import { LoadingService } from '../../../../services/loading.service';

var _this;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user:any = {
  };

  isForgotPass = false;
  resendEmail = 0;
  resendTiming = 20;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private backendService: BackendService, private loadingService: LoadingService, public userData: UserDataService) {
    _this = this;
  }

  ngOnInit() {
    this.isForgotPass = this.activatedRoute.snapshot.data.forgotPass ? true : false;
  }

  submit(){
    _this.resendEmail = 0;

    if(this.isForgotPass) {
     this.forgotPass();
    }
  }

  forgotPass(){

    this.loadingService.apiStart();

    this.backendService.forgotPass(this.user)
    .subscribe(result => {
      this.loadingService.apiStop();
      this.toastr.success('We’ve sent instructions for password reset to your registered email address');

      let resendInterval = setInterval(function(){
        _this.resendEmail++;
        if(_this.resendEmail > _this.resendTiming) {
          clearInterval(resendInterval);
        }
      },1000);
    },
    error => {
      this.loadingService.apiStop();
      this.toastr.error(error);
    });
  }
}
