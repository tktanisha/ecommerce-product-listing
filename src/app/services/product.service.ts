import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../models/product.model';
import { ProductFilters } from '../models/productFilter.model';
import { ProductsResponse } from '../models/products-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  getProducts(filters: ProductFilters) {
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params = params.set(key, value);
        }
      });
    }

    return this.http.get<ProductsResponse>(`${this.baseUrl}`, { params });
  }

  getProductById(id: number) {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
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
      `${this.baseUrl}/category/${category}`,
      { params }
    );
  }

  getCategories() {
    return this.http.get<string[]>(`${this.baseUrl}/category-list`);
  }
}
