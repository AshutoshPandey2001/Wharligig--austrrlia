import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaData {

  constructor(private meta: Meta, private title: Title) {
  }
}
