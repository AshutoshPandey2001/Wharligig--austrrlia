import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { Constants } from '../../../../constants/constants';
import { BackendService } from '../../../../services/backend.service';
import { UserDataService } from '../../../../services/user-data.service';
import { LoadingService } from '../../../../services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private route: ActivatedRoute, private toastr: ToastrService, private backendService: BackendService, private loadingService: LoadingService, public userData: UserDataService, private router: Router) { }

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
        this.router.navigate(['dashboard']);
      }
    },
    error => {
      this.loadingService.apiStop();
      this.toastr.error(error);
    });
  }

  submit(){
  }
}
