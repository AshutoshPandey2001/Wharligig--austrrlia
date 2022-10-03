import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-empty-placeholder',
  templateUrl: './empty-placeholder.component.html',
  styleUrls: ['./empty-placeholder.component.scss']
})
export class EmptyPlaceholderComponent implements OnInit {

  @Input() title:any;
  @Input() message:any;

  constructor() { }

  ngOnInit() {
    this.title = this.title == undefined ? "Oops! No results found for that query." : this.title;

    this.message = this.message == undefined ? "Try a simpler query or browse through available forms for the result. Incase you still can't find your result, contact us." : this.message;
  }

  ngOnChanges(changes) {
    this.title = changes.title.currentValue == undefined ? "Oops! No results found for that query." : changes.title.currentValue;

    this.message = changes.message.currentValue == undefined ? "Try a simpler query or browse through available forms for the result. Incase you still can't find your result, contact us." : changes.message.currentValue;
  }

}
