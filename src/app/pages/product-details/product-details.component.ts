import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { CapitalizePipe } from '../../shared/pipes/capitalize.pipe';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

import { PRODUCT_DETAILS_CONSTANTS } from '../../constants/constants';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CapitalizePipe],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  loading: boolean = true;

  private productSub?: Subscription;

  readonly constants = PRODUCT_DETAILS_CONSTANTS;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productService: ProductService
  ) {}

  ngOnInit(): void {
    const idParam: string | null = this.route.snapshot.paramMap.get('id');
    const id: number | null = idParam ? Number(idParam) : null;

    if (id) {
      this.loadProduct(id);
    } else {
      this.router.navigate([this.constants.ROUTES.PRODUCT_NOT_FOUND]);
    }
  }

  ngOnDestroy(): void {
    this.productSub?.unsubscribe();
  }

  private loadProduct(id: number): void {
    this.loading = true;

    this.productSub = this.productService.getProductById(id).subscribe({
      next: (data: Product): void => {
        this.product = data;
        this.loading = false;
      },
      error: (): void => {
        this.router.navigate([this.constants.ROUTES.PRODUCT_NOT_FOUND]);
      },
    });
  }

  goBack(): void {
    this.router.navigate([this.constants.ROUTES.PRODUCTS]);
  }
}
