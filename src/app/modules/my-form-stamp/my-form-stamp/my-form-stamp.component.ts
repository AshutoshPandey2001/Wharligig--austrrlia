import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../services/common.service';

import { BackendService } from '../../../services/backend.service';
import { Constants } from '../../../constants/constants';
import { LoadingService } from '../../../services/loading.service';
import { UserDataService } from '../../../services/user-data.service';
@Component({
  selector: 'app-my-form-stamp',
  templateUrl: './my-form-stamp.component.html',
  styleUrls: ['./my-form-stamp.component.scss']
})
export class MyFormStampComponent implements OnInit {

  constructor(private backendService: BackendService, private loadingService: LoadingService, public userService: UserDataService, public commonService: CommonService) { }

  constants = Constants;
  @Input() form:any;

  ngOnInit() {
  }

  redirection(form){
    if(Constants.ASSIGNED == form.act) {
     return '/fill-form/' + form.formid + '/' + form.id;
    }else if(Constants.SUBMITTED == form.act){
      return '/edit-my-form/' + form.assid;
    }
    else{
      return '/view-my-form/' + form.assid;
    }
  }

}
