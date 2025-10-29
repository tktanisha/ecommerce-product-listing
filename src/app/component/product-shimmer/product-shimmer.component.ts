import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-product-shimmer',
  imports: [CommonModule],
  templateUrl: './product-shimmer.component.html',
  styleUrl: './product-shimmer.component.scss',
})
export class ProductShimmerComponent {
  shimmerCards = Array(9); //to see
}
