import { Injectable } from '@angular/core';
import { Observable,Subject} from 'rxjs';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private subject = new Subject<any>();

  sendMessage(data: any) {
      this.subject.next(data);
  }

  clearMessage() {
      this.subject.next();
  }

  getMessage(): Observable<any> {
      return this.subject.asObservable();
  }
}
