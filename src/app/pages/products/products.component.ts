import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../component/product-card/product-card.component';
import { Product } from '../../models/product.model';
import { ProductFilters } from '../../models/productFilter.model';
import { ProductShimmerComponent } from '../../component/product-shimmer/product-shimmer.component';
import { SortingFilterComponent } from '../../component/product-filter/sorting-filter/sorting-filter.component';
import { PriceSliderComponent } from '../../component/product-filter/price-slider/price-slider.component';
import { CategoryFilterComponent } from '../../component/product-filter/category-filter/category-filter.component';
import { PaginationComponent } from '../../component/pagination/pagination.component';
import { ProductsResponse } from '../../models/products-response.model';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';

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
  products: Product[] = [];
  allProducts: Product[] = [];
  loading = true;
  error = '';
  totalProducts = 0;
  minPrice = 0;
  maxPrice = 0;
  selectedCategory: string | null = null;
  resetFilters = false;
  clearButtonDisabled = true;

  filters: ProductFilters = {
    limit: 9,
    skip: 0,
    sortBy: null,
    order: null,
  };

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    this.filters = {
      limit: 9,
      skip: 0,
      sortBy: params['sortBy'] ? 'price' : null,
      order: params['order'] || null
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
    queryParamsHandling: 'merge'
  });
}

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    const request$ = this.selectedCategory
      ? this.productService.getProductsByCategory(
          this.selectedCategory,
          this.filters
        )
      : this.productService.getProducts(this.filters);

    request$.subscribe({
      next: (response: ProductsResponse) => {
        if (this.filters.skip === 0) {
          this.allProducts = [];
        }

        this.allProducts = [...this.allProducts, ...response.products];
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
    this.clearButtonDisabled = false;
    this.resetSkip();

    this.updateQueryParams();
  }

  onPriceRangeChange(range: { min: number; max: number }): void {
    this.products = this.allProducts.filter(
      (p) => p.price >= range.min && p.price <= range.max
    );
    this.clearButtonDisabled = false;
  }

  onSortChange(order: 'asc' | 'desc'): void {
    this.filters.order = order;
    this.filters.sortBy = 'price';
    this.clearButtonDisabled = false;

    this.resetSkip();
    this.updateQueryParams();
  }

  clearFilters(): void {
    this.selectedCategory = null;
    this.resetFilters = true;

    this.filters = {
      limit: 9,
      skip: 0,
      sortBy: null,
      order: null,
    };

    this.clearButtonDisabled = true;
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
