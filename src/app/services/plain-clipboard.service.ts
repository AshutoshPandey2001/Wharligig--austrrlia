import { Component, OnInit } from '@angular/core';
import * as Quill from 'quill';


const Clipboard = Quill.import('modules/clipboard')
const Delta = Quill.import('delta')

class PlainClipboard extends Clipboard {
  onPaste (e) {

    e.preventDefault();

    const range = this.quill.getSelection();
    var text = e.clipboardData.getData('text/plain');
    text = text.trim();
    
    // return;
    const delta = new Delta()
    .retain(range.index)
    .delete(range.length)
    .insert(text);
    const index = text.length + range.index;
    const length = 0;
    this.quill.updateContents(delta, 'silent');
    this.quill.setSelection(index, length, 'silent');
    this.quill.scrollIntoView(this.quill.scrollingContainer);
    this.quill.updateContents({
    ops: [
       {retain: index},/* Retain means on which position you have to insert/*/
       {insert: ' '}
      ]
    });
    this.addSpace();
    setTimeout(() => {
    },1);

  }

  /*Mover cursor to next */
  addSpace(){
    const range = this.quill.getSelection();
    var text = "";
    range.index += 1;
    const delta = new Delta()
    .retain(range.index)
    .delete(range.length)
    .insert(text);
    const index = text.length + range.index;
    const length = 0;
    this.quill.updateContents(delta, 'silent');
    this.quill.setSelection(index, length, 'silent');
    this.quill.scrollIntoView(this.quill.scrollingContainer);
  }
}

export default PlainClipboard
