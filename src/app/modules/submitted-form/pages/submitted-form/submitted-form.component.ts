import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Constants } from '../../../../constants/constants';
import { BackendService } from '../../../../services/backend.service'
import { LoadingService } from '../../../../services/loading.service';
import { UserDataService } from '../../../../services/user-data.service';
import { CommonService } from '../../../../services/common.service';

declare var $:any;

@Component({
  selector: 'app-submitted-form',
  templateUrl: './submitted-form.component.html',
  styleUrls: ['./submitted-form.component.scss']
})
export class SubmittedFormComponent implements OnInit {

  constructor(private route: ActivatedRoute, private toastr: ToastrService, private     backendService: BackendService, private loadingService: LoadingService, public userDataService: UserDataService, public commonService: CommonService) { }

  submittedForms = [];

  ngOnInit() {
    this.submittedFormList();
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

}
