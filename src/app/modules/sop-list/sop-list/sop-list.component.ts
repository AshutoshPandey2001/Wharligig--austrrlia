import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {FormControl, FormGroup} from '@angular/forms';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

import { Constants } from '../../../constants/constants';
import { BackendService } from '../../../services/backend.service';
import { UserDataService } from '../../../services/user-data.service';
import { LoadingService } from '../../../services/loading.service';
import { CommonService } from '../../../services/common.service';
import { S3Service } from '../../../services/s3.service';
import { EventService } from '../../../services/event.service';

var _this;
declare var $:any;

@Component({
  selector: 'app-sop-list',
  templateUrl: './sop-list.component.html',
  styleUrls: ['./sop-list.component.scss']
})
export class SopListComponent implements OnInit {

  constructor(private route: ActivatedRoute, private toastr: ToastrService, private backendService: BackendService, private loadingService: LoadingService, private router: Router, public userData: UserDataService, public s3: S3Service, protected sanitizer: DomSanitizer, public commonService: CommonService, public userDataService: UserDataService, private event: EventService) {
    _this = this;
  }

  sopList:any = [];
  constants = Constants;
  limit = 12;
  pageNo = 1;
  listLoading = false;
  totalCount;

  ngOnInit() {
    this.getSOPList();
  }

  /*Get sop list*/
  getSOPList(){

    let term = "?limit=" + this.limit + "&page=" + this.pageNo + "&q=";

    this.loadingService.apiStart();
    this.listLoading = true;

    this.backendService.getSOPList(term)
    .subscribe(result => {

      if(this.pageNo == 1) {
        this.sopList = [];
        this.sopList = result.data.sop;
      }else{
        this.sopList = this.sopList.concat(result.data.sop);
      }
      this.totalCount = result.data.countsop;
      this.pageNo++;
      this.listLoading = false;
      this.loadingService.apiStop();
    },
    error => {
      this.loadingService.apiStop();
      this.toastr.error(error);
      this.listLoading = false;
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

  @HostListener("window:scroll", [])
  onScroll(): void {
  if((window.innerHeight + window.scrollY) >= document.body.scrollHeight){
      if((_this.totalCount > (_this.pageNo-1)*_this.limit) && !_this.listLoading) {
        _this.listLoading = true;
        _this.getSOPList();
      }
    }
  }
}
