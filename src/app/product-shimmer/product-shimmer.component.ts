import { Component } from '@angular/core';
import { SHIMMER_CARDS_COUNT } from '../constants/constants';

@Component({
  selector: 'app-product-shimmer',
  templateUrl: './product-shimmer.component.html',
  styleUrl: './product-shimmer.component.scss',
})
export class ProductShimmerComponent {
  shimmerCards = Array(SHIMMER_CARDS_COUNT);
}
