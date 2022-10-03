import { Component, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { fromEvent } from 'rxjs';

import { Constants } from '../../../../constants/constants';
import { BackendService } from '../../../../services/backend.service'
import { LoadingService } from '../../../../services/loading.service';
import { CommonService } from '../../../../services/common.service';
import { UserDataService } from '../../../../services/user-data.service';
import { EventService } from '../../../../services/event.service';
import { S3Service } from '../../../../services/s3.service';

declare var $:any;
var _this;

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss']
})
export class OrganizationsComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private toastr: ToastrService, private backendService: BackendService, private loadingService: LoadingService, public commonService: CommonService, public userDataService: UserDataService, private event: EventService, public s3: S3Service, private router: Router) {
    _this = this;
  }

  constants = Constants;
  listLoading = false;
  organizations:any = [];
  policyList:any = [];
  assignedPolicy:any = [];
  newOrganization:any = {
    location: []
  };
  selectedOrg:any = {};
  regionList = [];
  newAdmin:any = {};
  orgNameInput:any = '';

  selectedChapter:any = {};
  selectedSubChapter:any = {};
  selectedSection:any = {};
  selectedElement:any = {};

  selectedChapters:any = [];
  selectedSubChapters:any = [];
  selectedSections:any = [];
  selectedElements:any = [];

  chapters = [];
  subChapters = [];
  sectionList = [];
  elementList = [];
  isEditOrg = false;

  selectedSuperAdminOrg:any;

  allTemplates:any = [];
  selectedTemplates:any = [];

  sopList:any = [];
  selectedSOPs:any = [];
  newAddedPolicies:any = [];

  @ViewChild('stepper', {static: true}) stepper:any;

  ngOnInit() {
    this.getOrganizationList(undefined);
    this.getPolicyList(undefined);
    this.getRegionList();
    this.onSearchChange();
    this.gettemplatelist();
    this.getSOPList();

    /*observable for organisation selection*/
    this.userDataService.getSelectedOrgObs().subscribe((data)=>{
      this.selectedSuperAdminOrg = data;
    });
  }

  onSearchChange(){
    this.orgNameInput = document.getElementById("orgSearch");
    const subscription = fromEvent(this.orgNameInput, 'input')
    .pipe(debounceTime(1000))
    .subscribe((e: KeyboardEvent) => {
      let value = (<HTMLInputElement>e.target).value;
      if((<HTMLInputElement>e.target).value == '') {
        this.getOrganizationList(undefined);
        return;
      }
      this.getOrganizationList(value);
    });

    // let policyInput = document.getElementById("policy");
    // const subscriptionPolicy = fromEvent(policyInput, 'input')
    // .pipe(debounceTime(1000))
    // .subscribe((e: KeyboardEvent) => {
    //   let value = (<HTMLInputElement>e.target).value;
    //   this.getPolicyList(value);
    // });
  }

  onClickedSelectChapter(chapter){
    if(this.selectedChapters.includes(chapter.id)) {
      this.selectedChapters = this.selectedChapters.filter(function(id){
       return id != chapter.id;
      });
    }else{
      this.selectedChapters.push(chapter.id);
    }
  }

  isChapterSelected(chapter){
    return this.selectedChapters.includes(chapter.id);
  }

  onClickedSelectSubChapter(subChapter){

    if(this.selectedSubChapters.includes(subChapter.suid)) {
      this.selectedSubChapters = this.selectedSubChapters.filter(function(id){
       return id != subChapter.suid;
      });
    }else{
      this.selectedSubChapters.push(subChapter.suid);
    }
  }

  isSubChapterSelected(subChapter){
    return !this.selectedSubChapters.includes(subChapter.suid);
  }

  onClickedSelectSection(section){
    if(this.selectedSections.includes(section.ssuid)) {
      this.selectedSections = this.selectedSections.filter(function(id){
       return id != section.ssuid;
      });
    }else{
      this.selectedSections.push(section.ssuid);
    }
  }

  isSectionSelected(section){
    return !this.selectedSections.includes(section.ssuid);
  }

  onClickedSelectElement(element){
    if(this.selectedElements.includes(element.policyid)) {
      this.selectedElements = this.selectedElements.filter(function(id){
       return id != element.policyid;
      });
    }else{
      this.selectedElements.push(element.policyid);
    }
  }

  isElementSelected(element){
    return !this.selectedElements.includes(element.policyid);
  }

  errorToSelectParent(type){
    let message = "";

    switch (type) {
      case 1:
        message = "Please select parent chapter first.";
        break;
      case 2:
        message = "Please select parent sub-chapter first.";
        break;
      case 3:
        message = "Please select parent section first.";
        break;
    }
    this.toastr.error(message);
  }

  getSubchapterOfChapter(id){

    if(this.selectedChapter.id == id) {
      return;
    }

    this.loadingService.apiStart();

    this.backendService.getSubchapterOfChapter(id)
    .subscribe(result => {
      this.loadingService.apiStop();
      this.subChapters = result.data.subchapter;
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }

  getSectionOfChapter(policy){
    if(this.selectedSubChapter.id == policy.id || this.selectedSection.endpoint == policy.endpoint || this.selectedElement.endpoint == policy.endpoint) {
      return;
    }

    this.loadingService.apiStart();

    this.backendService.getSinglePolicy(policy.endpoint)
    .subscribe(result => {
      this.loadingService.apiStop();

      if(result.data.type == 1) {
        this.sectionList = result.data.subsubchapter || [];
      }else{
        this.elementList = result.data.policylist || [];
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

  getOrganizationList(term){
    if(this.listLoading) {
      return;
    }
    this.listLoading = true;
    this.loadingService.apiStart();

    this.backendService.getOrganizationList(term)
    .subscribe(result => {
      this.loadingService.apiStop();
      this.organizations = result.data;
      this.listLoading = false;
    },
    error => {
      this.listLoading = false;
      this.loadingService.apiStop();
      console.log('Error');
    });
  }

  getRegionList(){
    this.loadingService.apiStart();

    this.backendService.getRegionList()
    .subscribe(result => {
      this.loadingService.apiStop();
      if(result.code == 200) {
        this.regionList = result.data;
      }
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
      
    });
  }

  onRemovestamp(data){
    for(var i=0; i<this.organizations.length; i++){
      if(data.name == this.organizations[i].name){
      this.organizations.splice(i,1);
        break;      
      }
    }  
  }

  onClickedOrganization(data){

    if(data.type == 'view') {
      this.openViewOrgOverlay(data.org);
    }else if(data.type == 'suspend'){
      this.suspendOrg(data.org);
    }else if(data.type == 'delete'){
      this.deleteOrg(data.org);
    }else if(data.type == 'active'){
      this.activateSuspendedOrg(data.org);
    }
    else if(data.type == 'edit'){
      this.event.sendMessage({
        type: Constants.EDIT_ORG_MODAL,
        data: data.org
      })
    }
    else if(data.type == 'open'){
      this.openOrgEditOverlay(data.org);
    }

  }

  editOrgDetails(){
    this.selectedOrg['name'] = this.selectedOrg['admin'];
    this.event.sendMessage({
      type: Constants.EDIT_ORG_MODAL,
      data: this.selectedOrg
    })
  }

  suspendOrg(data){
    /*Opening confirmation overlay*/
    this.event.sendMessage({
      type: Constants.OPEN_CONFIRMATION_OVERLAY,
      data: {
        heading: 'Suspend Organisation?',
        inline: true,
        callback: function(){
          _this.loadingService.apiStart();

          _this.backendService.suspendOrg(data.id)
          .subscribe(result => {
            _this.loadingService.apiStop();

            /*Set suspend flag to an element from an array*/
            _this.organizations.forEach(function(item){
              if(item.id != data.id) {
                data['suspend'] = 1;
              }
            });

            _this.toastr.success("Organisation suspended");

          },
          error => {
            _this.loadingService.apiStop();
            _this.toastr.error(error);
          });
        }
      }
    });
  }


  activateSuspendedOrg(data){
    /*Opening confirmation overlay*/
    this.event.sendMessage({
      type: Constants.OPEN_CONFIRMATION_OVERLAY,
      data: {
        heading: 'Activate Organisation?',
        inline: true,
        callback: function(){
          _this.loadingService.apiStart();

          _this.backendService.activateSuspendedOrg(data.id)
          .subscribe(result => {
            _this.loadingService.apiStop();

            /*Set suspend flag to an element from an array*/
            _this.organizations.forEach(function(item){
              if(item.id != data.id) {
                data['suspend'] = 0;
              }
            });

            _this.toastr.success("Organisation activated");

          },
          error => {
            _this.loadingService.apiStop();
            _this.toastr.error(error);
          });
        }
      }
    });
  }

  deleteOrg(data){
    /*Opening confirmation overlay*/
    this.event.sendMessage({
      type: Constants.OPEN_CONFIRMATION_OVERLAY,
      data: {
        heading: 'Delete Organisation?',
        inline: true,
        callback: function(){
          _this.loadingService.apiStart();

          _this.backendService.deleteOrg(data.id)
          .subscribe(result => {
            _this.loadingService.apiStop();
            /*Removed deleted element from an array*/
            _this.organizations = _this.organizations.filter((item) => item.id != data.id);
            _this.toastr.success("Organisation deleted");

          },
          error => {
            _this.loadingService.apiStop();
            _this.toastr.error(error);
          });
        }
      }
    });
  }

  openOrgEditOverlay(organization){
    this.loadingService.apiStart();

    this.backendService.getSingleOrganization(organization.id)
    .subscribe(result => {
      this.loadingService.apiStop();
      // this.selectedOrg = result.data;

      this.userDataService.setSelectedOrg(result.data);
      // document.getElementById("editOrg").style.width = "100%";
      // $('body').addClass('overlay-open');
      this.router.navigate(['/dashboard']);
    },
    error => {
      this.loadingService.apiStop();
      this.toastr.error(error);
    });
  }

  openViewOrgOverlay(organization){

    this.loadingService.apiStart();

    this.backendService.getSingleOrganization(organization.id)
    .subscribe(result => {
      this.loadingService.apiStop();
      this.selectedOrg = result.data;

      // result.data.policy.forEach(p=>{
      //   if (p.suid != undefined) {
      //     this.selectedChapters.push(parseInt((p.suid + "").split('.')[0]));
      //   }
      // });

      // this.selectedChapters = result.data.policy;
      this.stepper.selectedIndex = Constants.ORG_VIEW_INFO;
      document.getElementById("createOrg").style.width = "100%";
      $('body').addClass('overlay-open');
    },
    error => {
      this.loadingService.apiStop();
      this.toastr.error(error);
    });
  }

  openOverlay(){
    this.stepper.selectedIndex = Constants.ORG_NEW_INFO;
    document.getElementById("createOrg").style.width = "100%";
    $('body').addClass('overlay-open');
    this.getchapterslist();
  }

  closeOverlay(id) {
    document.getElementById(id).style.width = "0%";
    $('body').removeClass('overlay-open');
  }

  createAccount(stepper){
    this.loadingService.apiStart();

    this.backendService.isEmailExist({
      email: this.newOrganization.email
    })
    .subscribe(result => {
      if(result.data) {
        this.toastr.error('Email is already exist!');
      }else{
        stepper.next();
      }
      this.loadingService.apiStop();
    },
    error => {
      this.loadingService.apiStop();
      console.log(error);
    });
  }

  onClikedEditPolicies(){
    this.getchapterslist();
    this.stepper.selectedIndex = Constants.ORG_POLICY_INFO;
    this.isEditOrg = true;
    if (this.selectedOrg.extraData != undefined && this.selectedOrg.extraData != null) {
      let extraData = JSON.parse(this.selectedOrg.extraData);
      this.selectedChapters = extraData['chid'] || [];
      this.selectedSubChapters = extraData['suid'] || [];
      this.selectedSections = extraData['ssuid'] || [];
      this.selectedElements = extraData['policyid'] || [];
    }
  }

  assignAdmin(stepper){
    stepper.next();
    this.newAdmin.organization_name = this.selectedOrg.organization_name;
    this.newAdmin.organization_logo = this.selectedOrg.organization_logo;
  }

  createOrganization(stepper){

    let extraData = {
      chid: this.selectedChapters,
      suid: this.selectedSubChapters,
      ssuid: this.selectedSections,
      policyid: this.selectedElements
    }

    this.newOrganization.chid = this.selectedChapters;
    /*Sending unselected field to remove. Sending sub policies id which we don't want*/
    this.newOrganization.suid = this.selectedSubChapters;
    this.newOrganization.ssuid = this.selectedSections;
    this.newOrganization.policyid = this.selectedElements;
    this.newOrganization.extraData = JSON.stringify(extraData);

    this.loadingService.apiStart();

    let payload = JSON.parse(JSON.stringify(this.newOrganization));
    payload.location = payload.location.map((item)=>{
      return item.id
    });
    payload['formid'] = this.selectedTemplates.map((item)=>{
      return item.id
    });
    payload['sopid'] = this.selectedSOPs.map((item)=>{
      return item.id
    });
    this.backendService.createOrganization(payload)
    .subscribe(result => {
      this.loadingService.apiStop();
      stepper.next();
    },
    error => {
      this.loadingService.apiStop();
      this.toastr.error(error);
    });
  }

  reAssignAdmin(stepper){
    this.loadingService.apiStart();
    this.newAdmin['id'] = this.selectedOrg.id;
    this.backendService.reAssignAdmin(this.newAdmin)
    .subscribe(result => {
      this.loadingService.apiStop();
      this.toastr.success("Admin reassigned successfully!");
      this.closeOverlay('createOrg');
      this.selectedOrg.organization_name = this.newAdmin.name;
    },
    error => {
      this.loadingService.apiStop();
      this.toastr.error(error);
    });
  }

  assignPolicy(stepper){
    if(this.selectedChapters.length == 0 ) {
      this.toastr.error('Please select policy');
      return;
    }

    /*Go to the next step*/
    if (!this.isEditOrg) {

      this.loadingService.apiStart();
      let payload = {
        chid: this.selectedChapters,
        suid: this.selectedSubChapters,
        ssuid: this.selectedSections,
        policyid: this.selectedElements
      }
      this.backendService.templatesAccordingToPolicy(payload)
      .subscribe(result => {
        this.loadingService.apiStop();
        // if (result.code == 200) {

          result.data = result.data.map((item)=>{
            return item.formid;
          });

          this.selectedTemplates = this.allTemplates.filter((item)=>{
            return result.data.includes(item.id);
          });
          stepper.next();
        // }
      },
      error => {
        this.loadingService.apiStop();
        this.toastr.error(error);
      });

    }else{
      /*Save updated policies*/

      let payload:any = {
        id: this.selectedOrg.id
      };

      let extraData = {
        chid: this.selectedChapters,
        suid: this.selectedSubChapters,
        ssuid: this.selectedSections,
        policyid: this.selectedElements
      }

      payload.chid = this.selectedChapters;
      /*Sending unselected field to remove. Sending sub policies id which we don't want*/
      payload.suid = this.selectedSubChapters;
      payload.ssuid = this.selectedSections;
      payload.policyid = this.selectedElements;
      payload.extraData = JSON.stringify(extraData);

      this.backendService.editOrganizationPolicy(payload)
      .subscribe(result => {
        this.loadingService.apiStop();
        this.toastr.success("Policy updated");
        this.closeOverlay('createOrg');
        this.isEditOrg = false;
      },
      error => {
        this.loadingService.apiStop();
        this.toastr.error(error);
      });
    }
  }

  cancel(stepper){
    stepper.previous();
  }

  removePolicy(policy){
    this.assignedPolicy = this.assignedPolicy.filter(function( obj ) {
      return obj.id !== policy.id;
    });
  }

  getPolicyList(value){

    let term = (value != undefined && value != '') ? ('?q=' + value) : '?q='
    this.loadingService.apiStart();

    this.backendService.getPolicyList(term)
    .subscribe(result => {
      this.loadingService.apiStop();
      this.policyList = result.data;
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }

  onPolicySelect(item){
    if(item == undefined) {
      return;
    }
    for(let policy of this.assignedPolicy){
      if(policy.id == item.id) {
        this.toastr.error("Policy already selected, Please choose another!");
        return;
      }
    }
    this.assignedPolicy.push(item);
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
      let key = 'organization-image';
      _this.s3.uploadS3(files[i], key,
      (data)=>{
        _this.loadingService.apiStop();
        _this.newOrganization.organization_logo = data.Location;
      },
      (error)=>{
        _this.loadingService.apiStop();
        _this.toastr.error(error);
      });
    }
  }

  /* Form Templates start*/
  gettemplatelist(){
    this.loadingService.apiStart();
    this.backendService.gettemplatelist('?q=&allform=true')
    .subscribe(result => {
      this.loadingService.apiStop();
      if(result.code == 200) {
        this.allTemplates = result.data.form;
      }
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }

  onClickedSelectForm(element){
    if(this.selectedTemplates.filter(function(item){
       return item.id == element.id;
      }).length != 0) {
      this.selectedTemplates = this.selectedTemplates.filter(function(item){
       return item.id != element.id;
      });
    }else{
      this.selectedTemplates.push(element);
    }
  }

  isFormSelected(form){
    return this.selectedTemplates.filter(function(item){
       return item.id == form.id;
      }).length != 0
  }

  removeSelectedForm(form){
    this.selectedTemplates = this.selectedTemplates.filter(function(item){
      return item.id != form.id;
    });
  }

  assignForms(stepper){
    if(this.selectedTemplates.length == 0 ) {
      this.toastr.error('Please select templates');
      return;
    }

    /*Go to the next step*/
    if (!this.isEditOrg) {

      this.loadingService.apiStart();
      let payload = {
        chid: this.selectedChapters,
        suid: this.selectedSubChapters,
        ssuid: this.selectedSections,
        policyid: this.selectedElements
      }
      this.backendService.sopsAccordingToPolicy(payload)
      .subscribe(result => {
        this.loadingService.apiStop();
        // if (result.code == 200) {

          result.data = result.data.map((item)=>{
            return item.formid;
          });

          this.selectedSOPs = this.sopList.filter((item)=>{
            return result.data.includes(item.id);
          });
          stepper.next();
        // }
      },
      error => {
        this.loadingService.apiStop();
        this.toastr.error(error);
      });

    }else{
      /*Save updated forms*/

      let payload:any = {
        orgId: this.selectedOrg.id,
        formids: this.selectedTemplates.map((item)=>{
          return item.id
        })
      };

      this.backendService.editOrganizationForms(payload)
      .subscribe(result => {
        this.loadingService.apiStop();
        this.toastr.success("Forms updated");
        this.closeOverlay('createOrg');
        this.isEditOrg = false;
      },
      error => {
        this.loadingService.apiStop();
        this.toastr.error(error);
      });
    }
  }

  onClikedEditTemplates(){
    this.stepper.selectedIndex = Constants.ORG_FORM_INFO;
    this.isEditOrg = true;
    this.selectedTemplates = this.selectedOrg.forms;
  }
  /* Form Templates end*/

  /* SOP start*/
  getSOPList(){
    let term = "?q=&allsop=true";

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

  onClickedSelectSOP(element){
    if(this.selectedSOPs.filter(function(item){
       return item.id == element.id;
      }).length != 0) {
      this.selectedSOPs = this.selectedSOPs.filter(function(item){
       return item.id != element.id;
      });
    }else{
      this.selectedSOPs.push(element);
    }
  }

  isSOPSelected(sop){
    return this.selectedSOPs.filter(function(item){
       return item.id == sop.id;
      }).length != 0
  }

  removeSelectedSOP(sop){
    this.selectedSOPs = this.selectedSOPs.filter(function(item){
      return item.id != sop.id;
    });
  }

  assignSOPs(stepper){
    if(this.selectedSOPs.length == 0 ) {
      this.toastr.error('Please select SOP');
      return;
    }

    /*Go to the next step*/
    if (!this.isEditOrg) {
      stepper.next();
      this.policiesAccordingToPolicy();
    }else{
      /*Save updated SOPs*/

      let payload:any = {
        orgId: this.selectedOrg.id,
        formIds: this.selectedSOPs.map((item)=>{
          return item.id
        })
      };

      this.backendService.editOrganizationSOPs(payload)
      .subscribe(result => {
        this.loadingService.apiStop();
        this.toastr.success("SOPs updated");
        this.closeOverlay('createOrg');
        this.isEditOrg = false;
      },
      error => {
        this.loadingService.apiStop();
        this.toastr.error(error);
      });
    }
  }

  onClikedEditSOPs(){
    this.stepper.selectedIndex = Constants.ORG_SOP_INFO;
    this.isEditOrg = true;
    this.selectedSOPs = this.selectedOrg.sops;
  }
  /* Form Templates end*/

  policiesAccordingToPolicy(){
    this.loadingService.apiStart();
    let payload = {
      chid: this.selectedChapters,
      suid: this.selectedSubChapters,
      ssuid: this.selectedSections,
      policyid: this.selectedElements
    }
    this.backendService.policiesAccordingToPolicy(payload)
    .subscribe(result => {
      this.loadingService.apiStop();
      // if (result.code == 200) {
        this.newAddedPolicies = result.data;
      // }
    },
    error => {
      this.loadingService.apiStop();
      this.toastr.error(error);
    });
  }

  ngOnDestroy() {
    $('body').removeClass('overlay-open');
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
  if((window.innerHeight + window.scrollY) >= document.body.scrollHeight){
      // this.getOrganizationList(undefined);
    }
  }
}
