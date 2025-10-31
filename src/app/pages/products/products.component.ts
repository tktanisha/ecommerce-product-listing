import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { ButtonModule } from 'primeng/button';

import { CategoryFilterComponent } from '../../product-filter/category-filter/category-filter.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { PriceSliderComponent } from '../../product-filter/price-slider/price-slider.component';
import { ProductCardComponent } from '../../product-card/product-card.component';
import { ProductShimmerComponent } from '../../product-shimmer/product-shimmer.component';
import { SortingFilterComponent } from '../../product-filter/sorting-filter/sorting-filter.component';

import { Product } from '../../models/product.model';
import { ProductFilters } from '../../models/productFilter.model';
import { ProductsResponse } from '../../models/products-response.model';

import { ProductService } from '../../services/product.service';
import {
  PRICE_SLIDER_CONSTANTS,
  PRODUCTS_CONSTANTS,
} from '../../constants/constants';

type QueryParams = {
  sortBy?: 'price' | null;
  order?: 'asc' | 'desc' | null;
  category?: string | null;
};

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    ProductCardComponent,
    ProductShimmerComponent,
    SortingFilterComponent,
    PriceSliderComponent,
    CategoryFilterComponent,
    PaginationComponent,
    ButtonModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  productService: ProductService = inject(ProductService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  totalProducts: number = 0;
  minPrice: number = 0;
  maxPrice: number = 0;

  selectedCategory: string | null = null;
  error: string = '';

  loading: boolean = true;

  products: Product[] = [];
  allProducts: Product[] = [];

  filters: ProductFilters = {
    limit: 9,
    skip: 0,
    sortBy: null,
    order: null,
  };

  readonly CONSTANTS = PRODUCTS_CONSTANTS;
  readonly DEFAULT_MIN_PRICE = PRICE_SLIDER_CONSTANTS.SLIDER_CONFIG.DEFAULT_MIN;

  private routeSub?: Subscription;
  private productSub?: Subscription;

  ngOnInit(): void {
    this.routeSub = this.route.queryParams.subscribe((params): void => {
      this.filters = {
        limit: this.CONSTANTS.DEFAULT_LIMIT,
        skip: this.CONSTANTS.DEFAULT_SKIP,
        sortBy: params['sortBy'] ? 'price' : null,
        order: params['order'] || null,
      };

      this.selectedCategory = params['category'] || null;

      this.loadProducts();
    });
  }

  updateQueryParams(): void {
    const params: QueryParams = {};

    if (this.filters.sortBy) params.sortBy = this.filters.sortBy;
    if (this.filters.order) params.order = this.filters.order;
    if (this.selectedCategory) params.category = this.selectedCategory;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: true, //not adding the history on every url query change
    });
  }

  loadProducts(): void {
    //showing shimmer on initial load only
    if (this.filters.skip === 0) {
      this.loading = true;
    }

    const productRequest = this.selectedCategory
      ? this.productService.getProductsByCategory(
          this.selectedCategory,
          this.filters
        )
      : this.productService.getProducts(this.filters);

    this.productSub = productRequest.subscribe({
      next: (response: ProductsResponse): void => {
        if (this.filters.skip === this.CONSTANTS.DEFAULT_SKIP) {
          this.allProducts = []; //list get cleared when starting fresh
        }

        this.allProducts.push(...response.products);
        this.products = [...this.allProducts];
        this.totalProducts = response.total;
        this.updatePriceRange(this.products);

        this.error = this.products.length
          ? ''
          : this.CONSTANTS.NO_PRODUCTS_FOUND_MSG;
        this.loading = false;
      },
      error: (): void => {
        this.loading = false;
        this.error = this.CONSTANTS.FETCH_ERROR_MSG;
      },
    });
  }

  onLoadMoreProducts(): void {
    this.filters.skip =
      (this.filters.skip ?? this.CONSTANTS.DEFAULT_SKIP) +
      (this.filters.limit ?? this.CONSTANTS.DEFAULT_LIMIT);
    this.loadProducts();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.updateQueryParams();
  }

  onPriceRangeChange(range: { min: number; max: number }): void {
    this.products = this.allProducts.filter(
      (product: Product) =>
        product.price >= range.min && product.price <= range.max
    );
  }

  onSortChange(order: 'asc' | 'desc'): void {
    this.filters.order = order;
    this.filters.sortBy = 'price';
    this.updateQueryParams();
  }

  updatePriceRange(products: Product[]): void {
    if (!products?.length) return;

    const prices = products.map((product: Product) => product.price);
    this.minPrice = Math.floor(Math.min(...prices));
    this.maxPrice = Math.ceil(Math.max(...prices));
  }

  clearFilters(): void {
    this.filters = {
      limit: this.CONSTANTS.DEFAULT_LIMIT,
      skip: this.CONSTANTS.DEFAULT_SKIP,
      sortBy: null,
      order: null,
    };

    this.selectedCategory = null;
    this.minPrice = this.DEFAULT_MIN_PRICE;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true,
    });

    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.productSub?.unsubscribe();
  }
}
