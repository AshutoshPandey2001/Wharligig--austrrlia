import { Component, OnInit } from '@angular/core';
import * as Quill from 'quill';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { CommonService } from '../../../../services/common.service';
import { BackendService } from '../../../../services/backend.service';
import { Constants } from '../../../../constants/constants';
import { LoadingService } from '../../../../services/loading.service';
import { UserDataService } from '../../../../services/user-data.service';
import { S3Service } from '../../../../services/s3.service';
import { EventService } from '../../../../services/event.service';
import { environment } from '../../../../../environments/environment';
import PlainClipboard from '../../../../services/plain-clipboard.service';
Quill.register('modules/clipboard', PlainClipboard, true)

var _this;

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

  constructor(private route: ActivatedRoute, private backendService: BackendService, private toastr: ToastrService, private loadingService: LoadingService, private userService: UserDataService, public commonService: CommonService, private router: Router, public s3: S3Service, private event: EventService) { }

  postData: any = {
    description: "",
    /*chapterid: {},
    subchapterid: {},
    documentid: {},
    regioncodes: {}*/
  };
  postdate: any;
  isAdmin = false;
  env = environment;
  quill: any;
  editorOptions = {
    theme: 'bubble',
    placeholder: "Start your project here…",
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        ['blockquote'/*, 'code-block'*/],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        // [{ 'header': 1 }, { 'header': 2 }],
         [{ 'header': [1, 3, false] }],
        [{ 'color': [] }, { 'background': [] }],
        // [{ 'font': [] }],
        [{ 'align': [] }],
        ['link']
        // ['clean']
      ],
      clipboard: {
        matchVisual: false
      }
    },
    scrollingContainer: 'html',
  };

  chapters:any = [];
  subChapters = [];
  documentsType = [];
  tagList = [];
  regionList = [];
  associatedFormList = [];
  categoryList = []; 
  sopList = [];
  policyEndPoint;
  formSearchTerm = '';

  ngOnInit() {
    _this = this;

    this.isAdmin = this.route.snapshot.data.admin;
    this.route.params.subscribe(params => {
      if(params.endpoint) {
        this.getPolicyById(params.endpoint);
        this.policyEndPoint = params.endpoint;
      }
    });

    this.getchapterslist();
    this.getTagList();
    // this.getRegionList();
    this.gettemplatelist();
    this.getCategoryList();
    this.getSOPList();
    this.selectTextChangedEvent();
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
    let term = "?limit=100&page=1&q=";

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

  getDocumentTypeList(){
    this.loadingService.apiStart();

    this.backendService.getDocumentTypeList()
    .subscribe(result => {
      this.loadingService.apiStop();
      if(result.code == 200) {
        this.documentsType = result.data;
      }
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }

  getTagList(){
    this.loadingService.apiStart();

    this.backendService.getTagList()
    .subscribe(result => {
      this.loadingService.apiStop();
      if(result.code == 200) {
        this.tagList = result.data;
      }
    },
    error => {
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

  selectTextChangedEvent(){
    let formInput = document.getElementById("associatedForms");

    const subscription = fromEvent(formInput, 'input')
    .pipe(debounceTime(1000))
    .subscribe((e: KeyboardEvent) => {
      _this.formSearchTerm = (<HTMLInputElement>e.target).value;
      _this.gettemplatelist();
    });
  }

  gettemplatelist(){

    let term = "?limit=100&page=1&q=" + (this.formSearchTerm != undefined && this.formSearchTerm != null && this.formSearchTerm != '' ? this.formSearchTerm : '');

    this.loadingService.apiStart();

    this.backendService.gettemplatelist(term)
    .subscribe(result => {
      this.loadingService.apiStop();
      if(result.code == 200) {
        this.associatedFormList = result.data.form;
      }
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
      
    });
  }

  onChapterSelect(item){
    this.getSubchapterOfChapter(item.id);
    this.postData.subchapterid = null;
  }

  getSubchapterOfChapter(id){
    this.loadingService.apiStart();

    this.backendService.getSubchapterOfChapter(id)
    .subscribe(result => {
      this.loadingService.apiStop();
      if(result.code == 200) {
        this.subChapters = result.data.subchapter;
      }
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
      
    });
  }

  getCategoryList(){
    this.loadingService.apiStart();

    this.backendService.getCategoryList()
    .subscribe(result => {
      this.loadingService.apiStop();
      if(result.code == 200) {
        this.categoryList = result.data;
      }
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
      
    });
  }

  onEditorCreated(quill:any) {
    var toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', this.editorImageHandler);
    this.quill = quill;
  }

  addMagicTag(){
    const range = this.quill.getSelection(true);
    const index = range.index + range.length;
    this.quill.insertText(index, Constants.ORGANISATION_EMPTY_PLACEHOLDER);
  }

  AddFeaturedImage(event){}

  cancel(){
    /*Opening confirmation overlay*/
    this.event.sendMessage({
      type: Constants.OPEN_CONFIRMATION_OVERLAY,
      data: {
        heading: 'Cancel policy?',
        inline: true,
        callback: function(){
          _this.router.navigate(['form-templates']);
        }
      }
    });
  }

  videoHandler(){
    this.quill.theme.tooltip.edit('video');
  }

  editorImageHandler() {

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

    var successImg = 0;
    for(var i=0; i < files.length; i++){
      // _this.imageLoading = true;
      _this.loadingService.apiStart();

      _this.s3.uploadS3(files[i], 'post',
      (data)=>{
        _this.loadingService.apiStop();
        _this.pushImageToEditor(data.Location);
        successImg = successImg + 1;
        if(successImg == files.length) {
          // _this.imageLoading = false;
        }

      },
      (error)=>{
        _this.imageLoading = false;
        console.log(error);
        _this.loadingService.apiStop();
        _this.toastr.error(error);
      });
    }
  }

  pushImageToEditor(url) {
    const range = this.quill.getSelection(true);
    const index = range.index + range.length;
    this.quill.insertEmbed(range.index, 'image', url);
    this.quill.setSelection(index + 1);
    this.quill.updateContents({
    ops: [
       {retain: index},
       {insert: '\n'}
      ]
    });
    this.quill.setSelection(index + 2);
  }

  /*Get policy by id*/
  getPolicyById(endpoint){
    this.loadingService.apiStart();

    this.backendService.getSinglePolicy(endpoint)
    .subscribe(result => {
      this.loadingService.apiStop();

      let postData = result.data;
      this.postData.description = postData.description;
      this.postData.id = postData.id;
      this.postData.title = postData.title;
      this.postData.content = postData.content;
      this.postData.subchapterid = (postData.suid + '').split(".").pop();
      this.postData.ssuid = postData.ssuid != undefined ? (postData.ssuid + '').split(".").pop() : '';
      this.postData.policyid = postData.policyid != undefined ? (postData.policyid + '').split(".").pop() : '';
      this.postData.chapterid = {id: postData.chapter.chid,
        chapter_name: postData.chapter.chapter_name};
      this.postData.tags = postData.tags;
      this.postData.formids = postData.form;
      this.postData.sopids = postData.sop;
      this.postData.category = postData.category;
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
    });
  }

  createPolicy(){

    if(this.postData.title == undefined || this.postData.title == null || this.postData.title == '') {
      this.toastr.error('Please enter title');
      return;
    }
    if(this.postData.content == undefined || this.postData.content == null || this.postData.content == '') {
      this.toastr.error('Please enter content');
      return;
    }

    /*Calculate the type of document*/
    if(this.postData.ssuid != undefined && this.postData.ssuid != null && this.postData.ssuid != '' && this.postData.policyid != undefined && this.postData.policyid != '' && this.postData.policyid != null) {
        this.postData.type = 3;
    }else if(this.postData.ssuid != undefined && this.postData.ssuid != null && this.postData.ssuid != ''){
      this.postData.type = 2;
    }else{
      this.postData.type = 1;
    }


    let payload = JSON.parse(JSON.stringify(this.postData));

    this.loadingService.apiStart();

    payload.formids = payload.formids == undefined ? [] : payload.formids.map(value => value.id);
    payload.tags = payload.tags.map(value => value.id);
    payload.category = payload.category.map(value => value.categoryid || value.id);
    payload.sopids = payload.sopids == undefined ? [] : payload.sopids.map(value => value.id);

    payload.chapterid = payload.chapterid.id;

    this.backendService.createPolicy(payload)
    .subscribe(result => {

      this.loadingService.apiStop();
      if(result.code == 200) {
        this.toastr.success("Policy created successfully!");
        window.history.back();
      }
    },
    error => {
      this.loadingService.apiStop();
      this.toastr.error(error);
    });
  }

  editPolicy(){

    if(this.postData.title == undefined || this.postData.title == null || this.postData.title == '') {
      this.toastr.error('Please enter title');
      return;
    }
    if(this.postData.content == undefined || this.postData.content == null || this.postData.content == '') {
      this.toastr.error('Please enter content');
      return;
    }

    /*Calculate the type of document*/
    if(this.postData.ssuid != undefined && this.postData.ssuid != null && this.postData.ssuid != '' && this.postData.policyid != undefined && this.postData.policyid != '' && this.postData.policyid != null) {
        this.postData.type = 3;
    }else if(this.postData.ssuid != undefined && this.postData.ssuid != null && this.postData.ssuid != ''){
      this.postData.type = 2;
    }else{
      this.postData.type = 1;
    }

    let payload = JSON.parse(JSON.stringify(this.postData));
    this.loadingService.apiStart();

    payload.formids = payload.formids == undefined ? [] : payload.formids.map(value => value.id || value.formid);
    payload.tags = payload.tags.map(value => value.id || value.tagid);
    payload.category = payload.category.map(value => value.categoryid || value.id);
    payload.sopids = payload.sopids == undefined ? [] : payload.sopids.map(value => value.id || value.sopid);

    payload.chapterid = payload.chapterid.id;

    this.backendService.editPolicy(payload)
    .subscribe(result => {
      this.toastr.success("Policy updated successfully!");
      this.loadingService.apiStop();
      window.history.back();
    },
    error => {
      this.loadingService.apiStop();
      this.toastr.error(error);
    });
  }

  autogrow(id){
    let  textArea = document.getElementById(id);
    textArea.style.overflow = 'hidden';
    textArea.style.height = '0px';
    textArea.style.height = textArea.scrollHeight + 'px';
  }
}
