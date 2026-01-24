import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';

@Component({
  selector: 'app-start-page',
  imports: [],
  templateUrl: './start.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StartPage {
  protected currentTitle = '';

  ngOnInit() {
    // set document.title for this page
    this.currentTitle = 'Title by start.ts';
  }
}
