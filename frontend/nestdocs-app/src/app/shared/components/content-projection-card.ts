import { Component } from '@angular/core';

@Component({
  selector: 'content-projection-card',
  standalone: true,
  template: `
    <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/20">
      <!-- Header projection -->
      <div class="mb-4">
        <ng-content select="[card-header]"></ng-content>
      </div>

      <!-- Body projection -->
      <div class="mb-4">
        <ng-content select="[card-body]"></ng-content>
      </div>

      <!-- Footer projection -->
      <div class="border-t border-white/20 pt-4">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `
})
export class ContentProjectionCard {}