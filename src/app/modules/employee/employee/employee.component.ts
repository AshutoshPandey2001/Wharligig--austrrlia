import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { fromEvent } from 'rxjs';

import { Constants } from '../../../constants/constants';
import { BackendService } from '../../../services/backend.service';
import { UserDataService } from '../../../services/user-data.service';
import { LoadingService } from '../../../services/loading.service';
import { CommonService } from '../../../services/common.service';
import { EventService } from '../../../services/event.service';

declare var $:any;
var _this;

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private toastr: ToastrService, private backendService: BackendService, private loadingService: LoadingService, public userData: UserDataService, private router: Router, public commonService: CommonService, private event: EventService) {

    _this = this;
  }

  employees:any = [];
  constants = Constants;
  empNameInput:any = '';

  selectedEmp:any = {};
  userDetails:any = {};

  members:any = [{
    name: 'Employee',
    id: Constants.EMPLOYEE
  },{
    name: 'Manager',
    id: Constants.MANAGER
  },{
    name: 'Team Leader',
    id: Constants.TEAM_TEAD
  }];

  searchTerm:any = '';

  currentUser:any = {};
  selectedOrgObs:any;

  ngOnInit() {
    this.currentUser = this.userData.getUserData();
    if(this.userData.getSelectedOrg()){
      this.currentUser = this.userData.getSelectedOrg();
    }
    this.selectedOrgObs = this.userData.getSelectedOrgObs().subscribe((org)=>{
      this.currentUser = org ? org : this.userData.getUserData();
      this.initData();
    });

    this.initData();
  }

  initData(){
    this.getUserList(undefined);
    this.onSearchChange();
  }

  onSearchChange(){
    this.empNameInput = document.getElementById("empSearch");
    const subscription = fromEvent(this.empNameInput, 'input')
    .pipe(debounceTime(1000))
    .subscribe((e: KeyboardEvent) => {
      let value = (<HTMLInputElement>e.target).value;
      if((<HTMLInputElement>e.target).value == '') {
        this.searchTerm = '';
        this.getUserList(undefined);
        return;
      }
      this.searchTerm = value;
      this.getUserList(value);
    });
  }

  getUserList(term){
    this.loadingService.apiStart();

    this.backendService.getUserList(term)
    .subscribe(result => {
      this.loadingService.apiStop();
      this.employees = result.data;
      // this.managerList = result.data;
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
      
    });
  }

  /*Delete employee*/
  onRemoveEmployee(data){
    /*Opening confirmation overlay*/
    this.event.sendMessage({
      type: Constants.OPEN_CONFIRMATION_OVERLAY,
      data: {
        heading: 'Delete user?',
        inline: true,
        callback: function(){
          _this.loadingService.apiStart();

          _this.backendService.removeUser({
            id: data.id,
            orgid: _this.userData.getUserData().orgid
          })
          .subscribe(result => {
            _this.loadingService.apiStop();

            /*Removed deleted element from an array*/
            _this.employees = _this.employees.filter((item) => item.id != data.id);
            _this.closeViewEmpOverlay();
            _this.toastr.success("User deleted!");

          },
          error => {
            _this.loadingService.apiStop();
            _this.toastr.error(error);
          });
        }
      }
    });
  }

  /*To suspend user*/
  suspendUser(emp){
    /*Opening confirmation overlay*/
    this.event.sendMessage({
      type: Constants.OPEN_CONFIRMATION_OVERLAY,
      data: {
        heading: 'Suspend user?',
        inline: true,
        callback: function(){
          _this.loadingService.apiStart();

          _this.backendService.suspendUser(emp.id)
          .subscribe(result => {
            _this.loadingService.apiStop();

            /*Set suspend flag to an element from an array*/
            _this.employees.forEach(function(item){
              if(item.id != emp.id) {
                emp['suspend'] = 1;
              }
            });
            _this.closeViewEmpOverlay();
            _this.toastr.success("User suspended!");

          },
          error => {
            _this.loadingService.apiStop();
            _this.toastr.error(error);
          });
        }
      }
    });
  }

  /*To activate suspended user*/
  activateSuspendedUser(emp){
    /*Opening confirmation overlay*/
    this.event.sendMessage({
      type: Constants.OPEN_CONFIRMATION_OVERLAY,
      data: {
        heading: 'Activate user?',
        inline: true,
        callback: function(){
          _this.loadingService.apiStart();

          _this.backendService.activateSuspendUser(emp.id)
          .subscribe(result => {
            _this.loadingService.apiStop();

            /*Set suspend flag to an element from an array*/
            _this.employees.forEach(function(item){
              if(item.id != emp.id) {
                emp['suspend'] = 0;
              }
            });
            _this.closeViewEmpOverlay();
            _this.toastr.success("User activated!");

          },
          error => {
            _this.loadingService.apiStop();
            _this.toastr.error(error);
          });
        }
      }
    });
  }

  /*Event when emp stamp taking any action*/
  onClickedEmpStamp(data){
    this.selectedEmp = JSON.parse(JSON.stringify(data.emp));
    if(data.type == 'edit') {
      // $('#editUserModal').modal("show");
      this.event.sendMessage({
        type: Constants.EDIT_EMP_OVERLAY,
        data: this.selectedEmp,
        userViewType: Constants.EDIT_USER
      });
    }else if(data.type == 'view'){
      this.event.sendMessage({
        type: Constants.EDIT_EMP_OVERLAY,
        data: this.selectedEmp,
        userViewType: Constants.VIEW_USER
      });
    }else if(data.type == 'suspend'){
      this.suspendUser(data.emp);
    }else if(data.type == 'activate'){
      this.activateSuspendedUser(data.emp);
    }
  }

  onClickedEdit(){
    $('#editUserModal').modal("show");
  }

  updateUserRole(){

    let payload = {
      id: this.selectedEmp.id,
      role: this.selectedEmp.role
    };

    this.loadingService.apiStart();

    this.backendService.updateUserRole(payload)
    .subscribe(result => {
      this.loadingService.apiStop();
      $('#editUserModal').modal("hide");
      _this.closeViewEmpOverlay();
      this.toastr.success("Role updated");
      for(let i = 0; i < this.employees.length; i++){
        if(this.employees[i].id == this.selectedEmp.id) {
          this.employees[i].role = this.selectedEmp.role;
          break;
        }
      }
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }


  openOverlay(){
    document.getElementById("addEmp").style.width = "100%";
    $('body').addClass('overlay-open');
  }

  openViewEmpOverlay(){
    this.getSingleUserDetails();
    document.getElementById("viewEmpDtl").style.width = "100%";
    $('body').addClass('overlay-open');
  }

  /*userDetails*/
  getSingleUserDetails(){
    this.loadingService.apiStart();

    this.backendService.getSingleUserDetails(this.selectedEmp.id ,this.selectedEmp.role)
    .subscribe(result => {
      this.loadingService.apiStop();
      this.userDetails = result.data;
      if(this.userDetails.teamleader != undefined && !Array.isArray(this.userDetails.teamleader)) {
        this.userDetails.teamleader = [this.userDetails.teamleader];
      }
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }

  closeViewEmpOverlay() {
    document.getElementById("viewEmpDtl").style.width = "0%";
    $('body').removeClass('overlay-open');
  }

  ngOnDestroy() {
    $('body').removeClass('overlay-open');
    if (this.selectedOrgObs) {
      this.selectedOrgObs.unsubscribe();
    }
  }
}
