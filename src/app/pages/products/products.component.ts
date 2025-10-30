import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';

import { CategoryFilterComponent } from '../../component/product-filter/category-filter/category-filter.component';
import { PaginationComponent } from '../../component/pagination/pagination.component';
import { PriceSliderComponent } from '../../component/product-filter/price-slider/price-slider.component';
import { ProductCardComponent } from '../../component/product-card/product-card.component';
import { ProductShimmerComponent } from '../../component/product-shimmer/product-shimmer.component';
import { SortingFilterComponent } from '../../component/product-filter/sorting-filter/sorting-filter.component';

import { Product } from '../../models/product.model';
import { ProductFilters } from '../../models/productFilter.model';
import { ProductsResponse } from '../../models/products-response.model';

import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    ProductShimmerComponent,
    SortingFilterComponent,
    PriceSliderComponent,
    CategoryFilterComponent,
    PaginationComponent,
    ButtonModule,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  productService: ProductService = inject(ProductService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  error = '';

  totalProducts = 0;
  minPrice = 0;
  maxPrice = 0;

  loading = true;
  selectedCategory: string | null = null;

  products: Product[] = [];
  allProducts: Product[] = [];

  filters: ProductFilters = {
    limit: 9,
    skip: 0,
    sortBy: null,
    order: null,
  };

  // Why it's different: The snapshot provides a static, one-time read of the route's parameters. If a user changes query parameters while staying on the same component (e.g., by clicking a filter), the component will not be notified of the change and will not update. This would break your filter functionality.
  // When to use it: This approach is suitable for cases where you only need the initial values of the query parameters and don't expect them to change while the component is active.
  ngOnInit(): void {
    // The code subscribes to the queryParams observable, which is a stream of values representing the query parameters in the URL (e.g., ?category=electronics&order=asc). The code inside the subscription block will execute every time the query parameters change.
    this.route.queryParams.subscribe((params) => {
      this.filters = {
        limit: 9,
        skip: 0,
        sortBy: params['sortBy'] ? 'price' : null, //params['sortBy'] ? 'price' : null: This line checks if the sortBy query parameter exists. If it does, it explicitly sets filters.sortBy to 'price'. This is likely because the sorting logic in the onSortChange method only handles price-based sorting
        order: params['order'] || null,
      };

      this.selectedCategory = params['category'] || null;

      this.loadProducts();
    });
  }

  private updateQueryParams(): void {
    const params: any = {};

    if (this.filters.sortBy) params.sortBy = this.filters.sortBy;
    if (this.filters.order) params.order = this.filters.order;
    if (this.selectedCategory) params.category = this.selectedCategory;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  loadProducts(): void {
    // shimmer on inital load only
    if (this.filters.skip === 0) {
      this.loading = true;
    }

    (this.selectedCategory
      ? this.productService.getProductsByCategory(
          this.selectedCategory,
          this.filters
        )
      : this.productService.getProducts(this.filters)
    ).subscribe({
      next: (response: ProductsResponse) => {
        if (this.filters.skip === 0) {
          this.allProducts = [];
        }

        this.allProducts.push(...response.products);
        this.products = [...this.allProducts];
        this.totalProducts = response.total;
        this.updatePriceRange(this.products);

        if (!this.products.length) {
          this.error = 'No products found.';
        }

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Error occurred while fetching products.';
      },
    });
  }

  onLoadMoreProducts(): void {
    this.filters.skip = (this.filters.skip ?? 0) + (this.filters.limit ?? 9);
    this.loadProducts();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.resetSkip();

    this.updateQueryParams();
  }

  onPriceRangeChange(range: { min: number; max: number }): void {
    this.products = this.allProducts.filter(
      (p) => p.price >= range.min && p.price <= range.max
    );
  }

  onSortChange(order: 'asc' | 'desc'): void {
    this.filters.order = order;
    this.filters.sortBy = 'price';

    this.resetSkip();
    this.updateQueryParams();
  }

  private resetSkip(): void {
    this.filters.skip = 0;
  }

  private updatePriceRange(products: Product[]): void {
    if (!products.length) {
      return;
    }

    const prices = products.map((p) => p.price);
    this.minPrice = Math.floor(Math.min(...prices));
    this.maxPrice = Math.ceil(Math.max(...prices));
  }
}
