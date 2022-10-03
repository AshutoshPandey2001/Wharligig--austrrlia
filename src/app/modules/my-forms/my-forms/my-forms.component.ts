import { Component, OnInit, Input, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Constants } from '../../../constants/constants';
import { BackendService } from '../../../services/backend.service'
import { LoadingService } from '../../../services/loading.service';
import { UserDataService } from '../../../services/user-data.service';
import { CommonService } from '../../../services/common.service';

declare var $:any;
var _this;

@Component({
  selector: 'app-my-forms',
  templateUrl: './my-forms.component.html',
  styleUrls: ['./my-forms.component.scss']
})
export class MyFormsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private toastr: ToastrService, private     backendService: BackendService, private loadingService: LoadingService, public userDataService: UserDataService, public commonService: CommonService) {
    _this = this;
  }

  myForms = [];
  constants = Constants;
  filter:any;

  limit = 12;
  pageNo = 1;
  listLoading = false;
  totalCount;

  ngOnInit() {
    this.myFormList();
  }

  myFormList(){
    this.loadingService.apiStart();

    if(this.filter == 0) {
      this.filter = '0';
    }

    let term = "?limit=" + this.limit + "&page=" + this.pageNo + "&q=" + (this.filter != undefined && this.filter != null && this.filter != '' ? this.filter : '');

    this.backendService.myFormList(term)
    .subscribe(result => {
      this.loadingService.apiStop();

      if(this.pageNo == 1) {
        this.myForms = result.data.assignform;
      }else{
        this.myForms = this.myForms.concat(result.data.assignform);
      }
      this.totalCount = result.data.asscount;
      this.pageNo++;
      this.listLoading = false;

    },
    error => {
      this.loadingService.apiStop();
      console.log(error);
      this.listLoading = false;
    });
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
  if((window.innerHeight + window.scrollY) >= document.body.scrollHeight){
      if((_this.totalCount > (_this.pageNo-1)*_this.limit) && !_this.listLoading) {
        _this.listLoading = true;
        _this.myFormList();
      }
    }
  }
}
