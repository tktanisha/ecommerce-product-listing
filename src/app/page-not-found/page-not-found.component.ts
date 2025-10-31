import { Component } from '@angular/core';
import { PAGE_NOT_FOUND_CONSTANTS } from '../constants/constants';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {
  readonly constants = PAGE_NOT_FOUND_CONSTANTS;
}
