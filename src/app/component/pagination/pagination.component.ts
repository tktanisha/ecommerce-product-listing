import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input() totalProducts: number = 0;
  @Input() shownProducts: number = 0;

  @Output() loadMore = new EventEmitter<void>();

  onLoadMore() {
    this.loadMore.emit();
  }
}
