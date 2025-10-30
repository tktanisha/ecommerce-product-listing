import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';

@Component({
  selector: 'app-price-slider',
  standalone: true,
  imports: [CommonModule, FormsModule, SliderModule],
  templateUrl: './price-slider.component.html',
  styleUrls: ['./price-slider.component.scss'],
})
export class PriceSliderComponent implements OnChanges {
  @Input() minPrice: number = 0;
  @Input() maxPrice: number = 1000;
  @Output() priceRangeChange = new EventEmitter<{ min: number; max: number }>();

  rangeValues: number[] = [0, 1000];

  ngOnChanges(): void {
      this.rangeValues = [this.minPrice, this.maxPrice];
  }

  onPriceChange(): void {
    this.priceRangeChange.emit({
      min: this.rangeValues[0],
      max: this.rangeValues[1],
    });
  }
}
