import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() totalProducts = 0;
  @Input() shownProducts = 0;

  @Output() loadMore = new EventEmitter<void>();

  onLoadMore() {
    this.loadMore.emit();
  }
}
