import { Component, input } from '@angular/core';
import { BaseCard } from './base-card';
import { DEFAULT_CARD_CONFIG, CardConfig, CardTheme } from './card.interfaces';

/**
 * Notification Card - Single Responsibility: Display notifications/alerts
 * Extends BaseCard with custom theme (Open/Closed)
 */
@Component({
  selector: 'notification-card',
  standalone: true,
  template: `
    <base-card [config]="config">
      <div card-header class="flex items-center gap-3">
        <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
          <span class="text-white text-sm">{{ notification().icon }}</span>
        </div>
        <h4 class="text-lg font-semibold text-white">{{ notification().title }}</h4>
      </div>

      <div card-body>
        <p class="text-white/80">{{ notification().message }}</p>
        @if (notification().details) {
          <div class="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
            <p class="text-yellow-300 text-sm">
              <strong>{{ notification().details!.title }}:</strong> {{ notification().details!.description }}
            </p>
          </div>
        }
      </div>

      <div card-footer class="flex gap-3">
        <ng-content select="[notification-actions]"></ng-content>
      </div>
    </base-card>
  `,
  imports: [BaseCard]
})
export class NotificationCard {
  notification = input.required<{
    title: string;
    message: string;
    icon: string;
    details?: {
      title: string;
      description: string;
    };
  }>();

  // Custom theme for notifications (Open/Closed - extended without modification)
  config: CardConfig = {
    ...DEFAULT_CARD_CONFIG,
    theme: {
      ...DEFAULT_CARD_CONFIG.theme,
      // Custom notification styling
    }
  };
}