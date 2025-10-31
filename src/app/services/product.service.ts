import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Product } from '../models/product.model';
import { ProductFilters } from '../models/productFilter.model';
import { ProductsResponse } from '../models/products-response.model';

import { API_BASE_URL, API_ENDPOINTS } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = API_BASE_URL;

  private http: HttpClient = inject(HttpClient);

  getProducts(filters: ProductFilters) {
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, value);
        }
      });
    }

    return this.http.get<ProductsResponse>(
      `${this.baseUrl}${API_ENDPOINTS.PRODUCTS}`,
      { params }
    );
  }

  getProductById(id: number) {
    return this.http.get<Product>(
      `${this.baseUrl}${API_ENDPOINTS.PRODUCT_BY_ID(id)}` //`${this.baseUrl}/${id}`
    );
  }

  getProductsByCategory(category: string, filters: ProductFilters) {
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, value);
        }
      });
    }

    return this.http.get<ProductsResponse>(
      `${this.baseUrl}${API_ENDPOINTS.PRODUCTS_BY_CATEGORY(category)}`, //`/category/${category}`
      { params }
    );
  }

  getCategories() {
    return this.http.get<string[]>(
      `${this.baseUrl}${API_ENDPOINTS.CATEGORY_LIST}` //'/category-list'
    );
  }
}
