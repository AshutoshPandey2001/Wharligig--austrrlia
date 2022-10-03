import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRouteSnapshot, ActivatedRoute, NavigationEnd} from "@angular/router";

import { ToastrService } from 'ngx-toastr';

import { Constants } from '../../../../constants/constants';
import { BackendService } from '../../../../services/backend.service';
import { UserDataService } from '../../../../services/user-data.service';
import { LoadingService } from '../../../../services/loading.service';

var _this;

@Component({
  selector: 'app-new-pass',
  templateUrl: './new-pass.component.html',
  styleUrls: ['./new-pass.component.scss']
})
export class NewPassComponent implements OnInit {

  user:any = {
  };
  isPasswordConfirm = true;
  isPasswordSet = false;
  token;
  forgetPass = true;

  constructor(private toastr: ToastrService, private backendService: BackendService, private loadingService: LoadingService, public userData: UserDataService, private route: ActivatedRoute) {
    _this = this;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.authorization) {
        this.token = params.authorization;
        this.forgetPass = false;
      }
      if (params.token) {
        this.token = params.token;
        this.forgetPass = true;
      }
    });
  }

  checkConfirmPassword(form){
    if(form.controls.confirmPassword.value == form.controls.password.value) {
     this.isPasswordConfirm = true;
    } else{
    this.isPasswordConfirm = false;
    }
  }

  submit(){

    if(!this.isPasswordConfirm) {
      return;
    }

    if (this.forgetPass) {
      this.resetPass();
      return;
    }

    _this.loadingService.apiStart();
    _this.backendService.generatePassword({
      token: this.token,
      password: this.user.password
    })
    .subscribe(result => {
      _this.loadingService.apiStop();
      _this.isPasswordSet = true;
      console.log(result);
    },
    error => {
      _this.loadingService.apiStop();
    });
  }


  resetPass(){

    _this.loadingService.apiStart();
    _this.backendService.setNewPassword({
      token: this.token,
      password: this.user.password
    })
    .subscribe(result => {
      _this.loadingService.apiStop();
      _this.isPasswordSet = true;
      console.log(result);
    },
    error => {
      _this.loadingService.apiStop();
    });
  }

}
