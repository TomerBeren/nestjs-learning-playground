import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { BaseCard } from './base-card';
import { DEFAULT_CARD_CONFIG } from './card.interfaces';

/**
 * Product Card - Single Responsibility: Display product information
 * Extends BaseCard without modifying it (Open/Closed)
 */
@Component({
  selector: 'product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, // 🎯 Performance optimization
  template: `
    <base-card [config]="config">
      <div card-header class="flex items-center justify-between">
        <h4 class="text-lg font-semibold text-white">{{ product().name }}</h4>
        <span class="text-green-400 font-bold">{{ product().price }}</span>
      </div>

      <div card-body>
        <p class="text-white/80 mb-3">{{ product().description }}</p>
        <div class="flex items-center gap-2 mb-3">
          <span class="text-white/90">Rating:</span>
          <ng-content select="[product-rating]"></ng-content>
        </div>
        <div class="flex flex-wrap gap-2">
          @for (tag of product().tags; track tag) {
            <span class="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm">{{ tag }}</span>
          }
        </div>
      </div>

      <div card-footer class="flex gap-3">
        <ng-content select="[product-actions]"></ng-content>
      </div>
    </base-card>
  `,
  imports: [BaseCard]
})
export class ProductCard {
  product = input.required<{
    name: string;
    price: string;
    description: string;
    tags: string[];
  }>();

  config = DEFAULT_CARD_CONFIG;
}