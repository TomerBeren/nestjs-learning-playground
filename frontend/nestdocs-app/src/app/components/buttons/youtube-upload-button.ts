import { Component, input, output } from '@angular/core';

@Component({
  selector: 'button[yt-upload]',
  standalone: true,
  template: `
    <span class="icon">📹</span>
    <span class="text"><ng-content /></span>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: #ff0000;
        color: white;
        padding: 0.625rem 1.25rem;
        border-radius: 0.25rem;
        border: none;
        font-weight: 500;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.025em;
      }

      :host:hover {
        background: #cc0000;
      }

      :host:active {
        background: #990000;
      }

      :host:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .icon {
        font-size: 1.125rem;
      }

      .text {
        font-weight: 600;
      }
    `,
  ],
})
export class YouTubeUploadButton {
  size = input<'small' | 'medium' | 'large'>('medium');
  uploading = input<boolean>(false);
}
