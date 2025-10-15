import { Component, input } from '@angular/core';
import { BaseCard } from './base-card';
import { DEFAULT_CARD_CONFIG } from './card.interfaces';

/**
 * User Profile Card - Single Responsibility: Display user profile information
 * Extends BaseCard without modifying it (Open/Closed)
 */
@Component({
  selector: 'user-profile-card',
  standalone: true,
  template: `
    <base-card [config]="config">
      <div card-header class="flex items-center gap-4">
        <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <span class="text-white font-bold text-lg">{{ user().initials }}</span>
        </div>
        <div>
          <h4 class="text-lg font-semibold text-white">{{ user().name }}</h4>
          <p class="text-white/70 text-sm">{{ user().role }}</p>
        </div>
      </div>

      <div card-body>
        <div class="space-y-2">
          @for (stat of user().stats; track stat.label) {
            <div class="flex justify-between">
              <span class="text-white/90">{{ stat.label }}:</span>
              <span class="text-white">{{ stat.value }}</span>
            </div>
          }
        </div>
      </div>

      <div card-footer class="flex gap-3">
        <ng-content select="[profile-actions]"></ng-content>
      </div>
    </base-card>
  `,
  imports: [BaseCard]
})
export class UserProfileCard {
  user = input.required<{
    name: string;
    initials: string;
    role: string;
    stats: Array<{ label: string; value: string }>;
  }>();

  config = DEFAULT_CARD_CONFIG;
}