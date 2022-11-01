import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { fromEvent } from 'rxjs';

import { Constants } from '../../../../constants/constants';
import { BackendService } from '../../../../services/backend.service'
import { LoadingService } from '../../../../services/loading.service';
import { UserDataService } from '../../../../services/user-data.service';
import { CommonService } from '../../../../services/common.service';
import { EventService } from '../../../../services/event.service';
import { HttpClient } from '@angular/common/http';
import {ProxyService} from '../../../../proxy.service'

declare var $:any;
var _this;

@Component({
  selector: 'app-form-templates',
  templateUrl: './form-templates.component.html',
  styleUrls: ['./form-templates.component.scss']
})
export class FormTemplatesComponent implements OnInit, OnDestroy {

  constructor( private procyservice: ProxyService, private httpclient:HttpClient ,private route: ActivatedRoute, private toastr: ToastrService, private     backendService: BackendService, private loadingService: LoadingService, public userDataService: UserDataService, public commonService: CommonService, private event: EventService) {
    _this = this;
  }

  constants = Constants;

  templates:any = [];
  selectedTemplate:any = {};
  formNameInput:any = '';

  limit = 12;
  pageNo = 1;
  listLoading = false;
  totalCount;
  searchTerm;



  // baseurl="https://tstageserver.com/aniruddh/wp-json/gf/v2/forms/"
  // auth:any={
  //   consumer_key:'ck_5cae7c87d75b18cf62d07179e44f906969fd9f30',
  //   consumer_secret:'cs_6a2d4ae5ff8896f5277f0894a4f2e0990b31fb19'
  
  // };

  ngOnInit() {
    this.gettemplatelist();
    this.onSearchChange();
  }

  onSearchChange(){
    this.formNameInput = document.getElementById("formSearch");
    const subscription = fromEvent(this.formNameInput, 'input')
    .pipe(debounceTime(1000))
    .subscribe((e: KeyboardEvent) => {
      this.pageNo = 1;
      this.searchTerm = (<HTMLInputElement>e.target).value;
      this.gettemplatelist();
    });
  }

  gettemplatelist(){
    this.loadingService.apiStart();
    // this.procyservice.getFormList().subscribe((res)=>{
    //   console.log( 'result',res)
    //   let pro = Object.values(res)
    //   console.log('http res',pro); 
    //   this.templates = pro;
    // this.loadingService.apiStop();

    //   console.log( 'form array',this.templates);
      
    // } , (err)=>{
    //   console.log('error' , err);
      
    // })    

    let term = "?limit=" + this.limit + "&page=" + this.pageNo + "&q=" + (this.searchTerm != undefined && this.searchTerm != null && this.searchTerm != '' ? this.searchTerm : '');

    this.loadingService.apiStart();
    this.listLoading = true;
    this.backendService.gettemplatelist(term)
    .subscribe(result => {
      console.log( 'whirligig form template result',result);
      
      this.loadingService.apiStop();
      if(result.code == 200) {

        if(this.pageNo == 1) {
          this.templates = [];
          this.templates = result.data.form;
        }else{
          this.templates = this.templates.concat(result.data.form);
        }
        this.totalCount = result.data.countform;
        this.pageNo++;
        this.listLoading = false;
        this.loadingService.apiStop();
      }
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
      
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

  openOverlay(data){
    this.selectedTemplate = data;
    document.getElementById("assignForm").style.width = "100%";
    $('body').addClass('overlay-open');
  }

  ngOnDestroy() {
    $('body').removeClass('overlay-open');
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
  if((window.innerHeight + window.scrollY) >= document.body.scrollHeight){
      if((_this.totalCount > (_this.pageNo-1)*_this.limit) && !_this.listLoading) {
        _this.listLoading = true;
        _this.gettemplatelist();
      }
    }
  }
}
