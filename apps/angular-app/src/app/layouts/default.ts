import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-default-layout',
  imports: [RouterOutlet],
  templateUrl: './default.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DefaultLayout {
  /** Show the full year in copyright line */
  protected year = new Date().getFullYear();
  protected currentDateTime = new Date().toISOString();
}
