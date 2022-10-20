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
  selector: 'app-assign-forms',
  templateUrl: './assign-forms.component.html',
  styleUrls: ['./assign-forms.component.scss']
})
export class AssignFormsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private toastr: ToastrService, private     backendService: BackendService, private loadingService: LoadingService, public userDataService: UserDataService, public commonService: CommonService) {
    _this = this;
  }

  assignedForms = [];
  filter:any;
  constants = Constants;

  limit = 12;
  pageNo = 1;
  listLoading = false;
  totalCount;

  ngOnInit() {
    this.getAdminAssignedFormList();
  }

  getAdminAssignedFormList(){
    if(this.filter == 0) {
      this.filter = '0';
    }
    let term = "?limit=" + this.limit + "&page=" + this.pageNo + "&q=" + (this.filter != undefined && this.filter != null && this.filter != '' ? this.filter : '');

    this.loadingService.apiStart();

    this.backendService.getAdminAssignedFormList(term)
    .subscribe(result => {
      this.loadingService.apiStop();
console.log('all assign form', result)
      if(this.pageNo == 1) {
        this.assignedForms = result.data.assignform;
      }else{
        this.assignedForms = this.assignedForms.concat(result.data.assignform);
      }
      this.totalCount = result.data.asscount;
      this.pageNo++;
      this.listLoading = false;
    },
    error => {
      this.loadingService.apiStop();
      this.listLoading = false;
      console.log(error);
    });
  }

  @HostListener("window:scroll", [])
  onScroll(): void {
  if((window.innerHeight + window.scrollY) >= document.body.scrollHeight){
      if((_this.totalCount > (_this.pageNo-1)*_this.limit) && !_this.listLoading) {
        _this.listLoading = true;
        _this.getAdminAssignedFormList();
      }
    }
  }
}
