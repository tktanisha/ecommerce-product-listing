import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadProduct(id);
    } else {
      this.router.navigate(['/product-not-found']);
    }
  }

  loadProduct(id: number): void {
    this.loading = true;

    this.productService.getProductById(id).subscribe({
      next: (data: Product) => {
        this.product = data;
        this.loading = false;
      },
      error: (err) => {
        this.router.navigate(['/product-not-found']);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
