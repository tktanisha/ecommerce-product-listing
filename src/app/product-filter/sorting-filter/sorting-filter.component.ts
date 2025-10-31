import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

import { SORTING_CONSTANTS } from '../../constants/constants';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-sorting-filter',
  standalone: true,
  imports: [SelectModule, FormsModule],
  templateUrl: './sorting-filter.component.html',
  styleUrl: './sorting-filter.component.scss',
})
export class SortingFilterComponent implements OnChanges {
  @Output() sortChange = new EventEmitter<'asc' | 'desc'>();
  @Input() initialSortOrder: 'asc' | 'desc' | null | undefined = null;

  selectedSort: string = '';

  sortOptions = SORTING_CONSTANTS.OPTIONS;
  sortLabel = SORTING_CONSTANTS.UI_TEXT.LABEL;
  sortPlaceholder = SORTING_CONSTANTS.UI_TEXT.PLACEHOLDER;

  ngOnChanges(): void {
    this.selectedSort = this.initialSortOrder ?? '';
  }

  onSortChange(event: DropdownChangeEvent): void {
    const value = event.value as 'asc' | 'desc';
    this.selectedSort = value;
    this.sortChange.emit(value);
  }
}
