import { Component, OnInit, Output, EventEmitter } from '@angular/core';

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
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.scss']
})
export class AddNewUserComponent implements OnInit {

  @Output() onAddNewUser = new EventEmitter<any>();

  constants = Constants;
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

  managerList:any = [];
  teamLeaderList:any = [];
  employeeList:any = [];

  selectedTeamLeaders:any = [];
  selectedManagers:any = [];
  selectedEmps:any = [];

  newUserList:any = [{
      role: Constants.EMPLOYEE,
      orgid: this.userData.getUserData().orgid
    }
  ];

  isEditUser = false;
  userViewType = Constants.NEW_USER;
  selectedEmp:any = {};
  selectedEmpBasicDetails:any = {};

  teamLeadEditSelect:any;
  empEditSelect:any;
  mngEditSelect:any;

  constructor(private route: ActivatedRoute, private toastr: ToastrService, private backendService: BackendService, private loadingService: LoadingService, public userData: UserDataService, private router: Router, public commonService: CommonService, private event: EventService) {
    _this = this;
   }

  ngOnInit() {

    this.loadData();
    this.event.getMessage().subscribe(data=>{
      if (data.type == Constants.EDIT_EMP_OVERLAY) {
        this.userViewType = data.userViewType;
        this.getSingleUserDetails(data.data);
      }
    });
  }

  loadData(){
    this.getManagerList();
  }

  /*userDetails*/
  getSingleUserDetails(user){
    this.loadingService.apiStart();

    this.backendService.getSingleUserDetails(user.id ,user.role)
    .subscribe(result => {
      this.loadingService.apiStop();
      this.isEditUser = true;
      this.newUserList = [{
          role: Constants.EMPLOYEE,
          orgid: this.userData.getUserData().orgid
        }
      ];
      let userDetails:any = {};

      this.selectedTeamLeaders = [];
      this.selectedManagers = [];
      this.selectedEmps = [];

      switch (user.role) {
        case Constants.EMPLOYEE:
          userDetails = result.data.emp;
          if (result.data.teamleader && result.data.teamleader.id) {
            this.selectedTeamLeaders.push(result.data.teamleader);
          }
          if (result.data.manager && result.data.manager.id) {
            this.selectedManagers.push(result.data.manager);
          }
          break;
        case Constants.MANAGER:
          userDetails = result.data.manager;
          if (result.data.teamleader.length > 0) {
            this.selectedTeamLeaders = result.data.teamleader;
          }
          if (result.data.emp.length > 0) {
            this.selectedEmps = result.data.emp;
          }
          break;
        case Constants.TEAM_TEAD:
          if (result.data.manager && result.data.manager.id) {
            this.selectedManagers.push(result.data.manager);
          }
          if (result.data.emp.length > 0) {
            this.selectedEmps = result.data.emp;
          }
          userDetails = result.data.teamleader;
      }
      this.selectedEmp = userDetails;
      this.selectedEmpBasicDetails = JSON.parse(JSON.stringify(this.selectedEmp));

      // this.newUserList.push({
      //   id: user.id,
      //   role: user.role,
      //   email: userDetails.email,
      //   name: userDetails.name,
      //   tlid: result.data.teamleader ? result.data.teamleader.id : undefined,
      //   managerid: result.data.manager ? result.data.manager.id : undefined
      // });

      document.getElementById("addEmp").style.width = "100%";
      $('body').addClass('overlay-open');
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }

  addNewUser(){
    this.newUserList.push({role: Constants.EMPLOYEE, orgid: this.userData.getUserData().orgid});
  }

  removeUser(index){
    this.newUserList.splice(index, 1);
  }

  createAccount(){

    if(this.newUserList.length == 0) {
      this.toastr.error('Please add at least one user');
      return;
    }

    if (this.isEditUser) {
      this.editUser();
      return;
    }
    this.loadingService.apiStart();

    this.backendService.addNewUser({users: this.newUserList})
    .subscribe(result => {
      this.loadingService.apiStop();
      this.newUserList = [{
          role: Constants.EMPLOYEE,
          orgid: this.userData.getUserData().orgid
        }
      ];
      this.closeOverlay();
      this.toastr.success('User created successfully!');
      this.onAddNewUser.emit();
      this.loadData();
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }

  editUser(){
    this.loadingService.apiStart();

    this.backendService.editEmp({users: this.newUserList})
    .subscribe(result => {
      this.loadingService.apiStop();
      this.closeOverlay();
      this.toastr.success('User updated!');
      this.loadData();
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }

  closeOverlay() {
    document.getElementById("addEmp").style.width = "0%";
    $('body').removeClass('overlay-open');
    this.isEditUser = false;
    this.userViewType = Constants.NEW_USER;
  }

  onEmailBlurMethod(user, index){

    /*First check if this email already entered*/
    for(let i = 0; i < this.newUserList.length; i++){

      this.newUserList[i].isEmailAllreadyEntered = false;
      
      if(index == i) {
        continue;
      }

      if(this.newUserList[i].email == user.email) {
        user.isEmailAllreadyEntered = true;
        return;
      }
    }

    // if(this.commonService.isEmailValid(user.email)) {
      this.loadingService.apiStart();
      this.backendService.isEmailExist({
        email: user.email
      })
      .subscribe(result => {
        if(result.data) {
          user.isEmailExist = result.data;
        }else{
          user.isEmailExist = false;
        }
        this.loadingService.apiStop();
      },
      error => {
        this.loadingService.apiStop();
        console.log(error);
      });
    // }
  }

  getManagerList(){
    this.loadingService.apiStart();

    this.backendService.getManagerList(undefined)
    .subscribe(result => {
      this.loadingService.apiStop();
      this.managerList = result.data;
      this.teamLeaders();
      this.getEmpList();
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }

  teamLeaders(){
    this.loadingService.apiStart();

    this.backendService.teamLeaders()
    .subscribe(result => {
      this.loadingService.apiStop();
      this.teamLeaderList = result.data;

      /*Check is team leader manager present in manager list if not then added it to manager list*/
      for(let i = 0; i < this.teamLeaderList.length; i++){
        let list = this.managerList.filter(function(value){
          return value.id == _this.teamLeaderList[i].managerid;
        });

        if(list.length == 0 && _this.teamLeaderList[i].managerid) {
          this.managerList.push({
            id: _this.teamLeaderList[i].managerid,
            name: _this.teamLeaderList[i].managername
          });

          this.managerList = JSON.parse(JSON.stringify(this.managerList));
        }
      }
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }

  getEmpList(){
    this.loadingService.apiStart();

    this.backendService.getUserList(undefined)
    .subscribe(result => {
      this.loadingService.apiStop();
      result.data = result.data.filter((item)=>{
        return item.role == Constants.EMPLOYEE
      });

      this.employeeList = result.data;
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }

  onManagerSelect(user){
    user.isAdminSelected = user.managerid != undefined;
  }

  onTeamLeadSelect(user){
    user.managerid = this.getManagerInfoByTeamLeadId(user.tlid).managerid;
    user.isTeamLeadSelected = this.getManagerInfoByTeamLeadId(user.tlid).managerid;
  }

  getManagerInfoByTeamLeadId(id){
    let list = this.teamLeaderList.filter(function(value){
      return value.tlid == id;
    });

    if(list.length > 0) {
      return list[0];
    }
    return {};
  }

  onSelectEditTeamLead(user){

    user['id'] = user['tlid'];
    if (this.selectedEmp.role == Constants.EMPLOYEE) {
      this.selectedTeamLeaders = [];
      this.selectedTeamLeaders.push(user);
      return;
    }

    if (this.selectedTeamLeaders.filter((item)=>{
      return user.id == item.id;
    }).length == 0) {
      this.selectedTeamLeaders.push(user);
    }else{
      this.toastr.warning("Already chosen");
    }

    setTimeout(()=>{
      this.teamLeadEditSelect = undefined;
    },1000);
  }

  onRemoveEditTeamLead(user){

    this.selectedTeamLeaders = this.selectedTeamLeaders.filter((item)=>{
        return user.id != item.id;
      }
    );
  }

  onSelectEditEmp(user){

    if (this.selectedEmps.filter((item)=>{
      return user.id == item.id;
    }).length == 0) {
      this.selectedEmps.push(user);
    }else{
      this.toastr.warning("Already chosen");
    }

    setTimeout(()=>{
      this.empEditSelect = undefined;
    },1000);
  }

  onRemoveEditEmp(user){

    this.selectedEmps = this.selectedEmps.filter((item)=>{
        return user.id != item.id;
      }
    );
  }

  onSelectEditManager(user){

    this.selectedManagers = [];
    this.selectedManagers.push(user);

    setTimeout(()=>{
      this.mngEditSelect = undefined;
    },1000);
  }

  onRemoveEditManager(user){

    this.selectedManagers = this.selectedManagers.filter((item)=>{
        return user.id != item.id;
      }
    );
  }

  onSubmitBasicDetails(){
    this.loadingService.apiStart();
    this.selectedEmpBasicDetails['oldrole'] = this.selectedEmp['role'];
    this.backendService.updateUserBasicDetails({user: [this.selectedEmpBasicDetails]})
    .subscribe(result => {
      this.loadingService.apiStop();
      this.selectedEmp = JSON.parse(JSON.stringify(this.selectedEmpBasicDetails));
      this.toastr.success("Basic details saved!");
      this.loadData();
      this.getSingleUserDetails(this.selectedEmp);
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }

  onSubmitManagerDetails(){
    this.loadingService.apiStart();
    this.backendService.updateUserManager({
      user: [this.selectedEmp],
      managers: this.selectedManagers.map((item)=>{
        return item.id;
      })
    })
    .subscribe(result => {
      this.loadingService.apiStop();
      this.toastr.success("Manager details saved!");
      this.loadData();
      this.getSingleUserDetails(this.selectedEmp);
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }

  onSubmitTeamLeaderDetails(){
    this.loadingService.apiStart();
    this.backendService.updateUserTeamLeader({
      user: [this.selectedEmp],
      teamleads: this.selectedTeamLeaders.map((item)=>{
        return item.id;
      })
    })
    .subscribe(result => {
      this.toastr.success("Team leader details saved!");
      this.loadingService.apiStop();
      this.loadData();
      this.getSingleUserDetails(this.selectedEmp);
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }

  onSubmitEmployeeDetails(){
    this.loadingService.apiStart();
    this.backendService.updateUserEmployee({
      user: [this.selectedEmp],
      emps: this.selectedEmps.map((item)=>{
        return item.id;
      })
    })
    .subscribe(result => {
      this.toastr.success("Employee details saved!");
      this.loadingService.apiStop();
      this.loadData();
      this.getSingleUserDetails(this.selectedEmp);
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }
}
