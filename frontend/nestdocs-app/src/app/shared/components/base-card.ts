import { Component, input, computed } from '@angular/core';
import { CardConfig, DEFAULT_CARD_CONFIG, CardTheme, CardLayout } from './card.interfaces';

/**
 * Base Card Component - Single Responsibility: Render configurable card structure
 * Open/Closed: Extensible through configuration without modification
 * Dependency Inversion: Depends on abstractions (interfaces) not concretions
 */
@Component({
  selector: 'base-card',
  standalone: true,
  template: `
    <div [class]="cardClasses()">
      <!-- Header projection - conditionally rendered -->
      @if (config().showHeader) {
        <div [class]="headerClasses()">
          <ng-content select="[card-header]"></ng-content>
        </div>
      }

      <!-- Body projection - always rendered -->
      <div [class]="bodyClasses()">
        <ng-content select="[card-body]"></ng-content>
      </div>

      <!-- Footer projection - conditionally rendered -->
      @if (config().showFooter) {
        <div [class]="footerClasses()">
          <ng-content select="[card-footer]"></ng-content>
        </div>
      }
    </div>
  `
})
export class BaseCard {
  // Input with default value - Open/Closed principle
  config = input<CardConfig>(DEFAULT_CARD_CONFIG);

  // Computed properties for styling - Single Responsibility
  cardClasses = computed(() => {
    console.log('Card Config:', this.config()); 
    const theme = this.config().theme;
    const layout = this.config().layout;
    return `${theme.background} ${layout.borderRadius} ${layout.padding} ${theme.shadow} ${theme.border}`;
  });

  headerClasses = computed(() => {
    return this.config().layout.headerSpacing;
  });

  bodyClasses = computed(() => {
    return this.config().theme.spacing;
  });

  footerClasses = computed(() => {
    const theme = this.config().theme;
    return `border-t ${theme.border} ${this.config().layout.footerSpacing}`;
  });
}