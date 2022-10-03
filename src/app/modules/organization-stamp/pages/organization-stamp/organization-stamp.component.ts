import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonService } from '../../../../services/common.service';
import { Constants } from '../../../../constants/constants';
import { BackendService } from '../../../../services/backend.service';
import { UserDataService } from '../../../../services/user-data.service';
import { LoadingService } from '../../../../services/loading.service';

@Component({
  selector: 'app-organization-stamp',
  templateUrl: './organization-stamp.component.html',
  styleUrls: ['./organization-stamp.component.scss']
})
export class OrganizationStampComponent implements OnInit {

  constructor(public commonService: CommonService, private backendService: BackendService, private loadingService: LoadingService, public userData: UserDataService) { }

  @Input() organization:any;
  @Input() isRemove:any;
  @Input() isAction:any;
  @Output() onRemove = new EventEmitter<any>();
  @Output() onClickedOrg = new EventEmitter<any>();

  constants = Constants;

  ngOnInit() {
  }

  onClickeRemoved(item){
  	this.onRemove.emit(item);
  }

  onClickedOrgStamp(item, type){
    this.onClickedOrg.emit({org: item, type: type});
  }
  
}
