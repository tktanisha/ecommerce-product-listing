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

type QueryParams = {
  sortBy?: 'price' | null;
  order?: 'asc' | 'desc' | null;
  category?: string | null;
};

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
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit {
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

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.filters = {
        limit: 9,
        skip: 0,
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
      queryParamsHandling: 'merge', //merge the new query parameters with the existing ones
      replaceUrl: true, //not adding the history on every url query change
    });
  }

  loadProducts(): void {
    //showing shimmer on inial load
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

        if (!this.products?.length) {
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
    //this.resetSkip();

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

    //this.resetSkip();
    this.updateQueryParams();
  }

  // resetSkip(): void {
  //   this.filters.skip = 0;
  // }

  updatePriceRange(products: Product[]): void {
    if (!products?.length) {
      return;
    }

    const prices = products.map((product) => product.price);
    this.minPrice = Math.floor(Math.min(...prices));
    this.maxPrice = Math.ceil(Math.max(...prices));
  }
}
