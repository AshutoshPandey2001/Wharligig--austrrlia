import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Constants } from '../../../../constants/constants';
import { BackendService } from '../../../../services/backend.service'
import { LoadingService } from '../../../../services/loading.service';
import { UserDataService } from '../../../../services/user-data.service';


@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.scss']
})
export class ChaptersComponent implements OnInit {
  constructor(private route: ActivatedRoute, private toastr: ToastrService, public backendService: BackendService, private loadingService: LoadingService, public userDataService: UserDataService) { }

  constants = Constants;
  
  chapters:any = [];

  ngOnInit() {
    this.getchapterslist(); 
  }

  getchapterslist(){
    this.loadingService.apiStart();

    this.backendService.getchapterslist()
    .subscribe(result => {
      this.loadingService.apiStop();
      if(result.code == 200) {
        this.chapters = result.data;
      }
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
      
    });
  }

}
