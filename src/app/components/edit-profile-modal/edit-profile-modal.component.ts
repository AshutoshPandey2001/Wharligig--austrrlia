import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { CommonService } from '../../services/common.service';
import { BackendService } from '../../services/backend.service';
import { Constants } from '../../constants/constants';
import { LoadingService } from '../../services/loading.service';
import { UserDataService } from '../../services/user-data.service';
import { S3Service } from '../../services/s3.service';
import { EventService } from '../../services/event.service';
var _this;
declare var $:any;

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.scss']
})
export class EditProfileModalComponent implements OnInit {

  constructor(private route: ActivatedRoute, private backendService: BackendService, private toastr: ToastrService, private loadingService: LoadingService, private userService: UserDataService, public commonService: CommonService, private router: Router, public s3: S3Service, private event: EventService) {
    _this = this;
  }

  profileData:any = {};
  isOrgEdit = false;
  orgData:any = {};

  ngOnInit() {
    this.profileData = JSON.parse(JSON.stringify(this.userService.getUserData()));

    this.event.getMessage().subscribe(
      (data)=>{
        if (Constants.EDIT_ORG_MODAL == data.type) {
          this.orgData = data.data;
          this.isOrgEdit = true;
          $('#editProfileModal').modal('show');
        }
      }
    );

    $('#editProfileModal').on('hidden.bs.modal', function () {
      this.isOrgEdit = false;
    })
  }

  onClickedImageReplace(){
    const Imageinput = document.createElement('input');
    Imageinput.setAttribute('type', 'file');
    Imageinput.setAttribute('multiple', 'true');
    Imageinput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
    Imageinput.classList.add('ql-image');

    Imageinput.addEventListener('change', () =>  {
      const file = Imageinput.files;
      _this.imageUploadOnS3(file);
    });
    Imageinput.click();
  }

  imageUploadOnS3(files): void {

    for(var i=0; i < files.length; i++){
      _this.loadingService.apiStart();
      let key = this.isOrgEdit ? 'organization-image' : 'profile-image'
      _this.s3.uploadS3(files[i], key,
      (data)=>{
        _this.loadingService.apiStop();
        this.isOrgEdit ? _this.orgData.organization_logo = data.Location : _this.profileData.userimage = data.Location;
      },
      (error)=>{
        _this.loadingService.apiStop();
        _this.toastr.error(error);
      });
    }
  }

  OnClickedRemoveImage(){
    _this.profileData.userimage = undefined;
  }

  submitProfile(){

    this.loadingService.apiStart();

    if (this.isOrgEdit) {
      this.backendService.editOrganizationProfile(this.orgData)
      .subscribe(result => {
        this.loadingService.apiStop();
        $('#editProfileModal').modal('hide');
        this.toastr.success("Organisation updated successfully!!");
      },
      error => {
        this.loadingService.apiStop();
        console.log(error);
      });
    }else{
      this.backendService.updateUser(this.profileData)
      .subscribe(result => {
        this.loadingService.apiStop();
        this.userService.setUserData(this.profileData);
        $('#editProfileModal').modal('hide');
        this.toastr.success("Profile updated successfully!!");
      },
      error => {
        this.loadingService.apiStop();
        console.log(error);
      });
    }
  }
}
