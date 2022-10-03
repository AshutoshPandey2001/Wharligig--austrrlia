import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CommonService } from '../../../services/common.service';
import { BackendService } from '../../../services/backend.service';
import { Constants } from '../../../constants/constants';
import { LoadingService } from '../../../services/loading.service';
import { UserDataService } from '../../../services/user-data.service';
import { EventService } from '../../../services/event.service';

var _this;

@Component({
  selector: 'app-sub-chapter',
  templateUrl: './sub-chapter.component.html',
  styleUrls: ['./sub-chapter.component.scss']
})
export class SubChapterComponent implements OnInit {

  chapter:any = {};
  chapterId;
  constants = Constants;

  constructor(private route: ActivatedRoute, private backendService: BackendService, private toastr: ToastrService, private loadingService: LoadingService, public userData: UserDataService, public commonService: CommonService, private event: EventService) {
    _this = this;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params.chapterId != undefined) {
        this.getSubchapterOfChapter(params.chapterId);
        this.chapterId = params.chapterId;
      }
    });
  }

  getSubchapterOfChapter(id){
    this.loadingService.apiStart();

    this.backendService.getSubchapterOfChapter(id)
    .subscribe(result => {
      this.loadingService.apiStop();
      this.chapter = result.data;
    },
    error => {
      this.loadingService.apiStop();
      console.log('Error');
      
    });
  }

  onDeleteChapter(data){

    /*Opening confirmation overlay*/
    this.event.sendMessage({
      type: Constants.OPEN_CONFIRMATION_OVERLAY,
      data: {
        heading: 'Delete sub chapter?',
        inline: true,
        callback: function(){
          _this.loadingService.apiStart();

          _this.backendService.deletePolicy(data.id, data.type)
          .subscribe(result => {
            _this.loadingService.apiStop();

            /*Removed deleted element from an array*/
            _this.chapter.subchapter = _this.chapter.subchapter.filter((item) => item.id != data.id);
            _this.toastr.success("Sub chapter deleted!");

          },
          error => {
            _this.loadingService.apiStop();
            _this.toastr.error(error);
          });
        }
      }
    });
  }
}
