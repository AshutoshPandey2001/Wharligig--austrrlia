import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {FormControl, FormGroup} from '@angular/forms';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import PlainClipboard from '../../../services/plain-clipboard.service';
import { Constants } from '../../../constants/constants';
import { BackendService } from '../../../services/backend.service';
import { UserDataService } from '../../../services/user-data.service';
import { LoadingService } from '../../../services/loading.service';
import { S3Service } from '../../../services/s3.service';
import * as Quill from 'quill';
import { environment } from '../../../../environments/environment';

Quill.register('modules/clipboard', PlainClipboard, true)

var _this;
declare var $:any;

@Component({
  selector: 'app-sop-uploader',
  templateUrl: './sop-uploader.component.html',
  styleUrls: ['./sop-uploader.component.scss']
})
export class SopUploaderComponent implements OnInit {

  constructor(private route: ActivatedRoute, private toastr: ToastrService, private backendService: BackendService, private loadingService: LoadingService, private router: Router, public userData: UserDataService, public s3: S3Service, protected sanitizer: DomSanitizer) { }

  userRole = 1;
  sopData:any = {};
  constants = Constants;
  policies = [];
  sopId;
  htmlContent:any = '';
  env = environment;
  tagList:any = [];

  quill: any;
  editorOptions = {
    theme: 'bubble',
    placeholder: "Start from here…",
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

  ngOnInit() {
    _this = this;

    if(this.userData.getUserData().role == Constants.SUPER_ADMIN) {
      this.getPolicyList(undefined);
      this.getTagList();
    }

    this.route.params.subscribe(params => {
      if(params.sopId != undefined) {
        this.getSOPById(params.sopId);
        this.sopId = params.sopId;
      }
    });

    this.onSearchChange();
  }

  /*Policy look up*/
  onSearchChange(){

    let policyInput = document.getElementById("associatedPolicySelect");
    const subscription = fromEvent(policyInput, 'input')
    .pipe(debounceTime(1000))
    .subscribe((e: KeyboardEvent) => {
      let value = (<HTMLInputElement>e.target).value;
      this.getPolicyList(value);
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

  /*Get sop by id*/
  getSOPById(id){
    this.loadingService.apiStart();

    this.backendService.getSOPById(id)
    .subscribe(result => {
      this.loadingService.apiStop();
      if(result.code == 200) {
        this.sopData = result.data;
        // while(this.sopData.content.includes(Constants.ORGANISATION_EMPTY_PLACEHOLDER)){
        //   this.sopData.content = this.sopData.content.replace(Constants.ORGANISATION_EMPTY_PLACEHOLDER, this.userData.getUserData().organization_name.trim());
        //   }
        this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(this.sopData.content);
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

  createSOP(form){
    if(this.sopData.title == undefined || this.sopData.title == null || this.sopData.title == '') {
      this.toastr.error('Please enter title');
      return;
    }
    if(this.sopData.content == undefined || this.sopData.content == null || this.sopData.content == '') {
      this.toastr.error('Please enter content');
      return;
    }

    this.sopData['endpoint'] = this.sopData.policy == undefined ? [] : this.sopData.policy.map(value => value.endpoint);

    this.sopData['tags'] = this.sopData.tags == undefined ? [] : this.sopData.tags.map(value => value.id);

    this.loadingService.apiStart();
    this.sopData['description'] = 'test';
    this.backendService.createSOP(this.sopData)
    .subscribe(result => {
      this.loadingService.apiStop();
      if(result.code == 200) {
        this.sopData = {};
        form.submitted = false;
        this.toastr.success('SOP submitted successfully!!');
        window.history.back();
      }
    },
    error => {
      this.loadingService.apiStop();
    });
  }

  autogrow(id){
    let  textArea = document.getElementById(id);
    textArea.style.overflow = 'hidden';
    textArea.style.height = '0px';
    textArea.style.height = textArea.scrollHeight + 'px';
  }

  editSOP(){
    if(this.sopData.title == undefined || this.sopData.title == null || this.sopData.title == '') {
      this.toastr.error('Please enter title');
      return;
    }
    if(this.sopData.content == undefined || this.sopData.content == null || this.sopData.content == '') {
      this.toastr.error('Please enter content');
      return;
    }

    this.sopData['endpoint'] = this.sopData.policy == undefined ? [] : this.sopData.policy.map(value => value.endpoint || value.id);

    this.sopData['tags'] = this.sopData.tags == undefined ? [] : this.sopData.tags.map(value => value.endpoint || value.id);

    this.loadingService.apiStart();
    this.sopData['description'] = 'test';
    this.backendService.editSOP(this.sopData)
    .subscribe(result => {
      this.loadingService.apiStop();
      this.toastr.success('SOP updated successfully!!');
      window.history.back();
    },
    error => {
      this.loadingService.apiStop();
    });
  }

  addMagicTag(){
    const range = this.quill.getSelection(true);
    const index = range.index + range.length;
    this.quill.insertText(index, Constants.ORGANISATION_EMPTY_PLACEHOLDER);
  }

  cancel(){
    this.router.navigate(['form-templates']);
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

  AddFeaturedImage(event){}

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

  customSearchFnPolicy(term, item) {

    term = term.toLowerCase();
    return item.title.toLowerCase().indexOf(term) > -1 || item.endpoint.toLowerCase().indexOf(term) > -1 || item.suid.toLowerCase().indexOf(term) > -1 || item.id == term || item.type == term;
  }

  /*Get policy list*/
  getPolicyList(value){

    let term = '?limit=100&' + (value != undefined && value != '' ? 'q=' + value : 'q=');

    this.loadingService.apiStart();

    this.backendService.getPolicyList(term)
    .subscribe(result => {
      this.loadingService.apiStop();
      this.policies = result.data;
    },
    error => {
      this.loadingService.apiStop();
      this.toastr.error(error);
    });
  }
}
