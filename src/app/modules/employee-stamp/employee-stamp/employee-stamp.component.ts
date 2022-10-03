import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Constants } from '../../../constants/constants';
import { BackendService } from '../../../services/backend.service';
import { UserDataService } from '../../../services/user-data.service';
import { LoadingService } from '../../../services/loading.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-employee-stamp',
  templateUrl: './employee-stamp.component.html',
  styleUrls: ['./employee-stamp.component.scss']
})
export class EmployeeStampComponent implements OnInit {

  constructor(private route: ActivatedRoute, private toastr: ToastrService, private backendService: BackendService, private loadingService: LoadingService, public userData: UserDataService, private router: Router, public commonService: CommonService) { }

  @Input() employee:any;
  @Input() isAction:any;
  @Output() onRemove = new EventEmitter<any>();
  @Output() onClickedEmpStamp = new EventEmitter<any>();

  constants = Constants;

  ngOnInit() {
  }

  onClickeRemoved(item){
    this.onRemove.emit(item);
  }

  onClickeStamp(item, type){
    this.onClickedEmpStamp.emit({emp: item, type: type});
  }
}
