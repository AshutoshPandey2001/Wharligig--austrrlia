import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { BackendService } from '../../../../services/backend.service';
import { Constants } from '../../../../constants/constants';
import { LoadingService } from '../../../../services/loading.service';
import { UserDataService } from '../../../../services/user-data.service';
import { S3Service } from '../../../../services/s3.service';

var _this;

@Component({
  selector: 'app-profile-completion',
  templateUrl: './profile-completion.component.html',
  styleUrls: ['./profile-completion.component.css']
})
export class ProfileCompletionComponent implements OnInit {

  userData:any = {};

  constructor(private backendService: BackendService, private toastr: ToastrService, private loadingService: LoadingService, private userService: UserDataService, private s3: S3Service) {
    _this = this;
  }

  ngOnInit() {
  }

  submit(){
    this.loadingService.apiStart();
    this.backendService.profileCompletionTwo(this.userData)
    .subscribe(result => {
      this.loadingService.apiStop();
      console.log(result);
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
      this.userData.orgimage = data.Location;
      _this.loadingService.apiStop();
    },
    (error)=>{
    _this.loadingService.apiStop();
      console.log(error);
    });
  }
}
