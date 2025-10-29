import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sorting-filter',
  standalone: true,
  imports: [CommonModule, DropdownModule, FormsModule],
  templateUrl: './sorting-filter.component.html',
  styleUrls: ['./sorting-filter.component.scss'],
})
export class SortingFilterComponent {
  @Input() resetFilters: boolean = false;
  @Output() sortChange = new EventEmitter<'asc' | 'desc'>();
  @Input() initialSortOrder: 'asc' | 'desc' | null | undefined = null;

  selectedSort: string = '';
  sortOptions = [
    { label: 'Price: Low to High', value: 'asc' },
    { label: 'Price: High to Low', value: 'desc' },
  ];
  //TODO
  ngOnChanges(): void {
    if (this.resetFilters) {
      this.selectedSort = '';
    }

    if (this.initialSortOrder) {
      this.selectedSort = this.initialSortOrder;
    }
  }

  onSortChange(event: any) {
    this.selectedSort = event.value;
    if (this.selectedSort) {
      this.sortChange.emit(this.selectedSort as 'asc' | 'desc');
    }
  }
}
