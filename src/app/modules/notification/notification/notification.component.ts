import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Constants } from '../../../constants/constants';
import { BackendService } from '../../../services/backend.service'
import { LoadingService } from '../../../services/loading.service';
import { UserDataService } from '../../../services/user-data.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(private route: ActivatedRoute, private toastr: ToastrService, private     backendService: BackendService, private loadingService: LoadingService, public userDataService: UserDataService, public commonService: CommonService) { }

  notifications = [0,1,2,3,4,5,6,7,8,9];
  ngOnInit() {
  }

  deleteNotification(index){
    this.notifications.splice(index, 1);
  }
}
