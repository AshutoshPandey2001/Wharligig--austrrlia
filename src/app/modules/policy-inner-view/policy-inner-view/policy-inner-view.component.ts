import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

import { CommonService } from '../../../services/common.service';
import { BackendService } from '../../../services/backend.service';
import { Constants } from '../../../constants/constants';
import { LoadingService } from '../../../services/loading.service';
import { UserDataService } from '../../../services/user-data.service';
import { EventService } from '../../../services/event.service';

declare var $:any;

var _this;

@Component({
  selector: 'app-policy-inner-view',
  templateUrl: './policy-inner-view.component.html',
  styleUrls: ['./policy-inner-view.component.scss']
})
export class PolicyInnerViewComponent implements OnInit {

  postData: any = {
    policyid: '',
    document_type: '',
    policyname: '',
    chapterid: {},
    subchapterid: {},
    tags: [],
    legislation: [],
    form: [],
    sop: [],
    subsubchapter: [],
    policy: {}
  };

  policyEndPoint;
  htmlContent:any = '';
  constants = Constants;
  subChapterList = [];
  otherChapterList = [];
  selectedTemplate = {};
  userData:any={};

  constructor(private route: ActivatedRoute, private backendService: BackendService, private toastr: ToastrService, private loadingService: LoadingService, public userService: UserDataService, public commonService: CommonService, protected sanitizer: DomSanitizer, private event: EventService) {
    _this = this;
  }

  ngOnInit() {
    this.userData = this.userService.getUserData();
    this.route.params.subscribe(params => {

      if (this.userService.getSelectedOrg()) {
        this.userData.organization_name = this.userService.getSelectedOrg().organization_name
      }

      if(params.endpoint) {
        this.getPolicyById(params.endpoint);
        this.policyEndPoint = params.endpoint;
      }
    });
  }

  /*Get policy by id*/
  getPolicyById(endpoint){
    this.loadingService.apiStart();

    this.backendService.getSinglePolicy(endpoint)
    .subscribe(result => {
      this.loadingService.apiStop();

      this.postData = result.data;

      if(this.postData.type == 1) {
        this.subChapterList = this.postData.subsubchapter || [];
        this.otherChapterList = this.postData.othersubchpter || [];
      }else{
        this.subChapterList = this.postData.policylist || [];
        this.otherChapterList = this.postData.othersubsubchapter || [];
      }

      while(this.postData.content != undefined && this.postData.content.includes(Constants.ORGANISATION_EMPTY_PLACEHOLDER)  && this.userData.organization_name){
        this.postData.content = this.postData.content.replace(Constants.ORGANISATION_EMPTY_PLACEHOLDER, this.userData.organization_name.trim());
        }
      this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(this.postData.content || '');

    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }

  /*Delete policy*/
  onDeletePolicy(data, source){

    let overlayHeading = "Sub chapter";
    switch(data.type){
      case 1: overlayHeading = "Sub chapter";
      break;
      case 2: overlayHeading = "Section";
      break;
      case 3: overlayHeading = "Element";
      break;
    }

    /*Opening confirmation overlay*/
    this.event.sendMessage({
      type: Constants.OPEN_CONFIRMATION_OVERLAY,
      data: {
        heading: 'Delete ' + overlayHeading + ' ?',
        inline: true,
        callback: function(){
          _this.loadingService.apiStart();

          _this.backendService.deletePolicy(data.id, data.type)
          .subscribe(result => {
            _this.loadingService.apiStop();

            /*Removed deleted element from an array*/
            if(source == 'sub') {
              _this.subChapterList = _this.subChapterList.filter((item) => item.id != data.id);
            }else{
              _this.otherChapterList = _this.otherChapterList.filter((item) => item.id != data.id);
            }
            _this.toastr.success( overlayHeading + " deleted!");

          },
          error => {
            _this.loadingService.apiStop();
            _this.toastr.error(error);
          });
        }
      }
    });
  }

  onClickedAssociatedForm(form){
    this.selectedTemplate = form;
    document.getElementById('assignForm').style.width = "100%";
    $('body').addClass('overlay-open');
  }

  ngOnDestroy() {
    $('body').removeClass('overlay-open');
  }
}
