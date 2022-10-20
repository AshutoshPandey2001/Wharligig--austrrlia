import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { UserDataService } from '../../../../services/user-data.service';
import { CommonService } from '../../../../services/common.service';
import { Constants } from '../../../../constants/constants';
import { BackendService } from '../../../../services/backend.service'
import { LoadingService } from '../../../../services/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-stamp',
  templateUrl: './form-stamp.component.html',
  styleUrls: ['./form-stamp.component.scss']
})
export class FormStampComponent implements OnInit {
 	
  constructor(public userDataService: UserDataService, public commonService: CommonService, private backendService: BackendService, private loadingService: LoadingService, private toastr: ToastrService, private router: Router) { }
 @Input() formtemplate:any;

  @Output()
  notify:EventEmitter<string> = new EventEmitter<string>();

  @Output()
  onDelete:EventEmitter<any> = new EventEmitter<any>();

  constants = Constants;
  userDetails:any = {};

  ngOnInit() {
  }

  openOverlay(value){
    console.log(value)
   	this.notify.emit(value);
  }

  onDeleteClicked(value){
   this.onDelete.emit(value);
  }

  getUserDetailsById(form){
    this.loadingService.apiStart();
    this.backendService.getUserById(this.userDataService.getUserData().id)
    .subscribe(result => {
      this.loadingService.apiStop();
      this.userDetails = result.data;
      if (this.userDetails.tlid) {
        this.onSubmitForm(this.userDetails.tlid, form);
      }else if(this.userDetails.managerid){
        this.onSubmitForm(this.userDetails.managerid, form);
      }else{
        this.onSubmitForm(this.userDataService.getUserData().orgid, form);
      }
    },
    error => {
      this.loadingService.apiStop();
      this.toastr.error(error);
    });
  }

  onSubmitForm(superiorId, form){
    this.loadingService.apiStart();
    let selectedUsersId = [];
    selectedUsersId.push(this.userDataService.getUserData().id);
    this.backendService.assignNewForm({
      empid: selectedUsersId,
      formid: form.id,
      superiorid: superiorId,
      expiretime: new Date().getTime()
    })
    .subscribe(result => {
      this.loadingService.apiStop();
      this.router.navigate(["/fill-form/" + form.id + '/' + result.data]);
    },
    error => {
      this.loadingService.apiStop();
      this.toastr.error(error);
    });
  }
}
