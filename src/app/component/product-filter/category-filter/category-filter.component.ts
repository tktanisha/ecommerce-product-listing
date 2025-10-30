import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../../services/product.service';
import { CapitalizePipe } from '../../../shared/pipes/capitalize.pipe';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, CapitalizePipe],
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss'],
})
export class CategoryFilterComponent implements OnInit, OnChanges {
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
