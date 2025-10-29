import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss'],
})
export class CategoryFilterComponent implements OnInit, OnChanges {
  @Input() resetFilters: boolean = false;
  @Input() initialSelectedCategory: string | null = null;
  @Output() categorySelected = new EventEmitter<string>();

  categories: string[] = [];
  selectedCategory: string | null = null;
  loading = true;

  productService: ProductService = inject(ProductService);

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnChanges(): void {
    if (this.resetFilters) this.selectedCategory = null;
    if (this.initialSelectedCategory !== null) {
      this.selectedCategory = this.initialSelectedCategory;
    }
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data: string[]) => {
        this.categories = data?.slice(0, 10) || [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.categorySelected.emit(category);
  }
}
