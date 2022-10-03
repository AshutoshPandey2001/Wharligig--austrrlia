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

declare var $:any;
var _this;

@Component({
  selector: 'app-form-templates',
  templateUrl: './form-templates.component.html',
  styleUrls: ['./form-templates.component.scss']
})
export class FormTemplatesComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private toastr: ToastrService, private     backendService: BackendService, private loadingService: LoadingService, public userDataService: UserDataService, public commonService: CommonService, private event: EventService) {
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

    let term = "?limit=" + this.limit + "&page=" + this.pageNo + "&q=" + (this.searchTerm != undefined && this.searchTerm != null && this.searchTerm != '' ? this.searchTerm : '');

    this.loadingService.apiStart();
    this.listLoading = true;
    this.backendService.gettemplatelist(term)
    .subscribe(result => {
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
