import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { fromEvent } from 'rxjs';

import { Constants } from '../../../constants/constants';
import { BackendService } from '../../../services/backend.service'
import { LoadingService } from '../../../services/loading.service';
import { UserDataService } from '../../../services/user-data.service';
import { CommonService } from '../../../services/common.service';
import { DatepickerOptions } from 'ng2-datepicker';

declare var $:any;

@Component({
  selector: 'app-assign-new-form',
  templateUrl: './assign-new-form.component.html',
  styleUrls: ['./assign-new-form.component.scss']
})
export class AssignNewFormComponent implements OnInit {

  constructor(private route: ActivatedRoute, private toastr: ToastrService, private     backendService: BackendService, private loadingService: LoadingService, public userDataService: UserDataService, public commonService: CommonService) { }

  selectedUsers:any = [];
  @Input() selectedTemplate:any = {};

  options: DatepickerOptions = {
    displayFormat: 'DD/MM/YYYY',
    barTitleFormat: 'MMMM YYYY',
  };

  date:any;
  userList:any = [];
  userSelectionDrop:any;

  ngOnInit() {
    this.getUserList();
    this.date = new Date();
  }

  getUserList(){
    this.loadingService.apiStart();

    this.backendService.getUserList(undefined)
    .subscribe(result => {
      this.loadingService.apiStop();
      result.data = result.data.filter((item)=>{
        return item.role != Constants.ADMIN;
      });

      let org = this.userDataService.getSelectedOrg();
      if (org) {
        org['name'] = org['admin'];
        result.data.push(org);
      }else if(this.userDataService.getUserData().role == Constants.ADMIN){
        result.data.push(this.userDataService.getUserData());
      }

      this.userList = result.data;
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }

  onUserSelect(item){
    if(item == undefined) {
      return;
    }
    for(let user of this.selectedUsers){
      if(user.id == item.id) {
        this.toastr.error("User already selected, Please choose another!");
        return;
      }
    }
    this.selectedUsers.push(item);
  }

  removePolicy(user){
    this.selectedUsers = this.selectedUsers.filter(function( obj ) {
      return obj.id !== user.id;
    });
  }

  onClickedAssignForm(){

    if(this.selectedUsers.length == 0) {
      this.toastr.error("Please select user!");
        return;
    }

    let selectedUsersId = this.selectedUsers.map(function(item) {
      return item.id;
    });

    this.loadingService.apiStart();

    this.backendService.assignNewForm({
      empid: selectedUsersId,
      formid: this.selectedTemplate.id,
      expiretime: new Date(this.date).getTime()
    })
    .subscribe(result => {
      this.loadingService.apiStop();
      this.toastr.success("Assigned successfully!");
      this.closeOverlay('assignForm')
    },
    error => {
      this.loadingService.apiStop();
      this.toastr.error(error);
    });
  }

  closeOverlay(id) {
    document.getElementById(id).style.width = "0%";
    $('body').removeClass('overlay-open');
    this.selectedUsers = [];
    this.date = new Date();
    this.userSelectionDrop = null;
  }
}
