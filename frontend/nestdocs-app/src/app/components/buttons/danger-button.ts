import { Component, input } from '@angular/core';

@Component({
  selector: 'button[app-danger]',
  standalone: true,
  template: `<ng-content />`,
  styles: [
    `
      :host {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      :host:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
      }

      :host:active {
        transform: translateY(0);
      }

      :host:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }
    `,
  ],
})
export class DangerButton {}
