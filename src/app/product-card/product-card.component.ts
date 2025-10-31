import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';

import { CapitalizePipe } from '../shared/pipes/capitalize.pipe';
import { Product } from '../models/product.model';

import { PRODUCT_CARD_CONSTANTS } from '../constants/constants';

@Component({
  selector: 'app-product-card',
  imports: [CapitalizePipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: Product;

  router: Router = inject(Router);

  viewDetails(): void {
    this.router.navigate([PRODUCT_CARD_CONSTANTS.ON_VIEW_ROUTE, this.product.id]);
  }
}
