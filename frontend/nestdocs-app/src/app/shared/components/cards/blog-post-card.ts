import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { BaseCard } from './base-card';
import { DEFAULT_CARD_CONFIG } from './card.interfaces';

/**
 * Blog Post Card - Single Responsibility: Display blog post preview
 * Extends BaseCard without modifying it (Open/Closed)
 */
@Component({
  selector: 'blog-post-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, // 🎯 Performance optimization
  template: `
    <base-card [config]="config">
      <div card-header>
        <h4 class="text-lg font-semibold text-white">{{ post().title }}</h4>
        <div class="flex items-center gap-2 mt-2">
          <span class="text-white/70 text-sm">By {{ post().author }}</span>
          <span class="text-white/50">•</span>
          <span class="text-white/70 text-sm">{{ post().readTime }}</span>
        </div>
      </div>

      <div card-body>
        <p class="text-white/80 mb-3">{{ post().excerpt }}</p>
        <div class="flex flex-wrap gap-2">
          @for (tag of post().tags; track tag) {
            <span class="bg-orange-500/20 text-orange-300 px-2 py-1 rounded text-sm">{{ tag }}</span>
          }
        </div>
      </div>

      <div card-footer class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <button class="text-blue-400 hover:text-blue-300 transition-colors">
            👍 {{ post().likes }}
          </button>
          <button class="text-green-400 hover:text-green-300 transition-colors">
            💬 {{ post().comments }}
          </button>
        </div>
        <ng-content select="[post-actions]"></ng-content>
      </div>
    </base-card>
  `,
  imports: [BaseCard]
})
export class BlogPostCard {
  post = input.required<{
    title: string;
    author: string;
    readTime: string;
    excerpt: string;
    tags: string[];
    likes: number;
    comments: number;
  }>();

  config = DEFAULT_CARD_CONFIG;
}