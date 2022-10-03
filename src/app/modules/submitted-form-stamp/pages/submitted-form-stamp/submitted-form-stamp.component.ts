import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-submitted-form-stamp',
  templateUrl: './submitted-form-stamp.component.html',
  styleUrls: ['./submitted-form-stamp.component.scss']
})
export class SubmittedFormStampComponent implements OnInit {

  constructor(public commonService: CommonService) { }
  @Input() form:any;
  ngOnInit() {
  }

}
