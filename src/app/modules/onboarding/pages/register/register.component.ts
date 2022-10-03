import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { BackendService } from '../../../../services/backend.service';
import { Constants } from '../../../../constants/constants';
import { LoadingService } from '../../../../services/loading.service';
import { UserDataService } from '../../../../services/user-data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user:any = {
    role: '1'
  };
  isAdmin = true;

  constructor(private backendService: BackendService, private toastr: ToastrService, private loadingService: LoadingService, private userService: UserDataService, private router: Router) { }

  ngOnInit() {
  }

  submit(){
  }

  register(){
    this.loadingService.apiStart();
    this.backendService.register(this.user)
    .subscribe(result => {

      this.loadingService.apiStop();
      
      if(result.code == 200) {
        this.userService.setUserData(result.data);
        this.router.navigate(['dashboard']);
      }else if(result.code == 400){
        this.toastr.error(result.message);
      }
    },
    error => {
      this.loadingService.apiStop();
      this.toastr.error(error);
    });
  }
}
