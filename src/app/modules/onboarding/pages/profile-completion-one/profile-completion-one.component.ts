import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { BackendService } from '../../../../services/backend.service';
import { Constants } from '../../../../constants/constants';
import { LoadingService } from '../../../../services/loading.service';
import { UserDataService } from '../../../../services/user-data.service';
import { S3Service } from '../../../../services/s3.service';

var _this;

@Component({
  selector: 'app-profile-completion-one',
  templateUrl: './profile-completion-one.component.html',
  styleUrls: ['./profile-completion-one.component.scss']
})
export class ProfileCompletionOneComponent implements OnInit {

  userData:any = {};

  constructor(private backendService: BackendService, private toastr: ToastrService, private loadingService: LoadingService, private userService: UserDataService, private s3: S3Service, private router: Router) {
    _this = this;
  }

  ngOnInit() {

  }

  submit(){
    this.loadingService.apiStart();

    this.backendService.profileCompletionOne(this.userData)
    .subscribe(result => {
      this.loadingService.apiStop();
      this.router.navigate(['profile-completion-2']);
    },
    error => {
      this.loadingService.apiStop();
      this.toastr.error(error);
    });
  }

  fileChangeEvent(event: any, key): void {
    _this.loadingService.apiStart();
    _this.s3.uploadS3(event.target.files[0], key,
    (data)=>{
      this.userData.userimage = data.Location;
      _this.loadingService.apiStop();
    },
    (error)=>{
    _this.loadingService.apiStop();
      console.log(error);
    });
  }
}
