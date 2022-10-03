import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CommonService } from '../../../services/common.service';
import { BackendService } from '../../../services/backend.service';
import { Constants } from '../../../constants/constants';
import { LoadingService } from '../../../services/loading.service';
import { UserDataService } from '../../../services/user-data.service';

@Component({
  selector: 'app-chapter-inner-view',
  templateUrl: './chapter-inner-view.component.html',
  styleUrls: ['./chapter-inner-view.component.scss']
})
export class ChapterInnerViewComponent implements OnInit {

  constructor(private route: ActivatedRoute, private backendService: BackendService, private toastr: ToastrService, private loadingService: LoadingService, private userService: UserDataService, public commonService: CommonService) { }

  chapter: any = {
    chapter: {},
    policy: [],
    currentsubchapter: {}
  };
  subChapterId;

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params.subChapterId != undefined) {
        this.getChapterById(params.subChapterId);
        this.subChapterId = params.subChapterId;
      }
    });
  }

  /*Get policy by id*/
  getChapterById(id){
    // this.loadingService.apiStart();

    // this.backendService.getSinglechapter(id)
    // .subscribe(result => {
    //   this.loadingService.apiStop();
    //   if(result.code == 200) {
    //     this.chapter = result.data;
    //   }
    // },
    // error => {
    //   this.loadingService.apiStop();
    //   console.log('Error');
    // });
  }
}
