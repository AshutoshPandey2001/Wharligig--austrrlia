import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Constants } from '../../constants/constants';
import { BackendService } from '../../services/backend.service';
import { UserDataService } from '../../services/user-data.service';
import { LoadingService } from '../../services/loading.service';

declare var $:any;

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {

  constructor(private toastr: ToastrService, private backendService: BackendService, private loadingService: LoadingService, public userData: UserDataService) { }

  user:any = {};

  ngOnInit() {
  }

  login(){
    this.loadingService.apiStart();
    this.backendService.login(this.user)
    .subscribe(result => {
      this.loadingService.apiStop();
      if(result.code == 200) {
        this.userData.setUserData(result.data);
        $('#loginModal').modal('hide');
      }
    },
    error => {
      this.loadingService.apiStop();
      this.toastr.error(error);
    });
  }
}
