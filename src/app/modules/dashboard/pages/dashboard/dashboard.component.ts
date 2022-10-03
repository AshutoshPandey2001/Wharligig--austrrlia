import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Constants } from '../../../../constants/constants';
import { BackendService } from '../../../../services/backend.service'
import { LoadingService } from '../../../../services/loading.service';
import { UserDataService } from '../../../../services/user-data.service';
import { CommonService } from '../../../../services/common.service';
import { EventService } from '../../../../services/event.service';

declare var $:any;
var _this;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private toastr: ToastrService, private     backendService: BackendService, private loadingService: LoadingService, public userDataService: UserDataService, public commonService: CommonService, private event: EventService) {
    _this = this;
  }

  constants = Constants;
  
  templates:any = [];
  organizations:any = [];
  chapters:any = [];
  sopList = [];
  employes = [];
  assignedForms = [];
  submittedForms = [];
  myForms = [];
  selectedTemplate = {};
  currentUser:any = {};

  ngOnInit() {

    this.currentUser = this.userDataService.getUserData();
    if(this.userDataService.getSelectedOrg()){
      this.currentUser = this.userDataService.getSelectedOrg();
    }
    this.userDataService.getSelectedOrgObs().subscribe((org)=>{
      this.currentUser = org ? org : this.userDataService.getUserData();
      this.initData();
    });

    this.initData();
  }

  initData(){

    if (this.currentUser.organization_name == null || this.currentUser.organization_name == undefined || this.currentUser.organization_name == '') {
      this.currentUser.organization_name = 'Super admin'
    }
    this.gettemplatelist();
    this.getchapterslist();
    this.getSOPList();
    this.submittedFormList();
    // this.getAssignedFormList();
    if(this.currentUser.role == Constants.SUPER_ADMIN) {
      this.getOrganizationList(undefined);
      this.getManagerList();
    }else{
      this.getEmpList();
      this.getAdminAssignedFormList();
      this.myFormList();
    }
  }

  submittedFormList(){
    this.loadingService.apiStart();

    this.backendService.submittedFormList()
    .subscribe(result => {
      this.loadingService.apiStop();
      this.submittedForms = result.data;
    },
    error => {
      this.loadingService.apiStop();
      console.log(error);
    });
  }

  myFormList(){
    this.loadingService.apiStart();
    let term = "?limit=4&page=1&q=";
    this.backendService.myFormList(term)
    .subscribe(result => {
      this.loadingService.apiStop();
      this.myForms = result.data.assignform;
    },
    error => {
      this.loadingService.apiStop();
      console.log(error);
    });
  }

  getAdminAssignedFormList(){
    let term = "?limit=4&page=1&q=";
    this.loadingService.apiStart();

    this.backendService.getAdminAssignedFormList(term)
    .subscribe(result => {
      this.loadingService.apiStop();
      this.assignedForms = result.data.assignform;
    },
    error => {
      this.loadingService.apiStop();
      console.log(error);
    });
  }

  getOrganizationList(term){
    this.loadingService.apiStart();

    this.backendService.getOrganizationList(term)
    .subscribe(result => {
      this.loadingService.apiStop();
      for (let i = 0; i < result.data.length; ++i) {
        result.data[i]['accepted'] = true;
      }
      this.organizations = result.data;
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
      
    });
  }

  getManagerList(){
    this.loadingService.apiStart();

    this.backendService.getManagerList(undefined)
    .subscribe(result => {
      this.loadingService.apiStop();
      this.employes = result.data;
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
      this.employes = result.data;
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
      
    });
  }

  gettemplatelist(){

    let term = "?limit=4&page=1&q=";

    this.loadingService.apiStart();

    this.backendService.gettemplatelist(term)
    .subscribe(result => {
      this.loadingService.apiStop();
      if(result.code == 200) {
        this.templates = result.data.form;
      }
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }

  getchapterslist(){
    this.loadingService.apiStart();
    this.backendService.getchapterslist()
    .subscribe(result => {
      this.loadingService.apiStop();
      if(result.code == 200) {
        this.chapters = result.data;
      }
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
      
    });
  }

  /*Get sop list*/
  getSOPList(){
    let term = "?limit=4&page=1&q=";

    this.loadingService.apiStart();

    this.backendService.getSOPList(term)
    .subscribe(result => {
      this.loadingService.apiStop();
      this.sopList = result.data.sop;
    },
    error => {
      this.loadingService.apiStop();
      this.toastr.error(error);
    });
  }

  onDeleteTemplate(data){

    /*Opening confirmation overlay*/
    this.event.sendMessage({
      type: Constants.OPEN_CONFIRMATION_OVERLAY,
      data: {
        heading: 'Delete template?',
        inline: true,
        callback: function(){
          _this.loadingService.apiStart();

          _this.backendService.deleteTemplate(data.id)
          .subscribe(result => {
            _this.loadingService.apiStop();

            if(result.code == 200) {
              /*Removed deleted element from an array*/
              _this.templates = _this.templates.filter((item) => item.id != data.id);
              _this.toastr.success("Template deleted!");
            }

          },
          error => {
            _this.loadingService.apiStop();
            _this.toastr.error(error);
          });
        }
      }
    });
  }

  onDeleteSOP(data){

    /*Opening confirmation overlay*/
    this.event.sendMessage({
      type: Constants.OPEN_CONFIRMATION_OVERLAY,
      data: {
        heading: 'Delete SOP?',
        inline: true,
        callback: function(){
          _this.loadingService.apiStart();

          _this.backendService.deleteSOP(data.id)
          .subscribe(result => {
            _this.loadingService.apiStop();

            if(result.code == 200) {
              /*Removed deleted element from an array*/
              _this.sopList = _this.sopList.filter((item) => item.id != data.id);
              _this.toastr.success("SOP deleted!");
            }

          },
          error => {
            _this.loadingService.apiStop();
            _this.toastr.error(error);
          });
        }
      }
    });
  }

  openOverlay(id, data){
    if(id == 'assignForm') {
      this.selectedTemplate = data;
    }
    document.getElementById(id).style.width = "100%";
    $('body').addClass('overlay-open');
  }

  ngOnDestroy() {
    $('body').removeClass('overlay-open');
  }
}
