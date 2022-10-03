import { Component, OnInit,Input} from '@angular/core';

@Component({
	selector: 'app-chapter-stamp',
	templateUrl: './chapter-stamp.component.html',
	styleUrls: ['./chapter-stamp.component.scss']
})
export class ChapterStampComponent implements OnInit {

	constructor() { }
	@Input() chapter:any;

	ngOnInit() {
	}

}
