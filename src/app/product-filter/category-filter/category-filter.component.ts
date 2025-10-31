import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  Output,
  inject,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';

import { ProductService } from '../../services/product.service';
import { CapitalizePipe } from '../../shared/pipes/capitalize.pipe';

import { CATEGORY_FILTER_CONSTANTS } from '../../constants/constants';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [FormsModule, CapitalizePipe],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.scss',
})
export class CategoryFilterComponent implements OnInit, OnChanges, OnDestroy {
  @Input() initialSelectedCategory: string | null = null;
  @Output() categorySelected = new EventEmitter<string>();

  categories: string[] = [];
  selectedCategory: string | null = null;
  loading: boolean = true;

  readonly titleText = CATEGORY_FILTER_CONSTANTS.UI_TEXT.TITLE;
  readonly limit = CATEGORY_FILTER_CONSTANTS.LIMIT;

  private readonly productService = inject(ProductService);
  private categorySub?: Subscription;

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('initialSelectedCategory' in changes) {
      this.selectedCategory = this.initialSelectedCategory;
    }
  }

  ngOnDestroy(): void {
    this.categorySub?.unsubscribe();
  }

  private loadCategories(): void {
    this.loading = true;

    this.categorySub = this.productService.getCategories().subscribe({
      next: (data: string[]): void => {
        this.categories = data?.slice(0, this.limit) || [];
        this.loading = false;
      },
      error: (): void => {
        this.loading = false;
      },
    });
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.categorySelected.emit(category);
  }
}
