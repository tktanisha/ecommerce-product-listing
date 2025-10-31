import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';

import { PRICE_SLIDER_CONSTANTS } from '../../constants/constants';

@Component({
  selector: 'app-price-slider',
  standalone: true,
  imports: [FormsModule, SliderModule],
  templateUrl: './price-slider.component.html',
  styleUrls: ['./price-slider.component.scss'],
})
export class PriceSliderComponent implements OnChanges {
  @Input() minPrice: number = PRICE_SLIDER_CONSTANTS.SLIDER_CONFIG.DEFAULT_MIN;
  @Input() maxPrice: number = PRICE_SLIDER_CONSTANTS.SLIDER_CONFIG.DEFAULT_MAX;
  @Output() priceRangeChange = new EventEmitter<{ min: number; max: number }>();

  rangeValues: number[] = [
    PRICE_SLIDER_CONSTANTS.SLIDER_CONFIG.DEFAULT_MIN,
    PRICE_SLIDER_CONSTANTS.SLIDER_CONFIG.DEFAULT_MAX,
  ];

  headingText = PRICE_SLIDER_CONSTANTS.UI_TEXT.HEADING;
  step = PRICE_SLIDER_CONSTANTS.SLIDER_CONFIG.STEP;
  isRange = PRICE_SLIDER_CONSTANTS.SLIDER_CONFIG.IS_RANGE;

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
