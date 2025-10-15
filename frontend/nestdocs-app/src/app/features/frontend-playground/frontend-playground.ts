import { Component } from '@angular/core';
import { UserProfile } from '../user-profile/user-profile';
import { ButtonShowcase } from '../../shared/components/button-showcase';
import { StarRatingDemo } from './star-rating-demo';
import { ContentProjectionDemo } from './content-projection-demo';

@Component({
  selector: 'frontend-playground',
  standalone: true,
  imports: [UserProfile, ButtonShowcase, StarRatingDemo, ContentProjectionDemo],
  template: `
    <div class="space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-white mb-2">🎨 Frontend Playground</h2>
        <p class="text-white/80">Angular Components & UI Experiments</p>
      </div>

      <content-projection-demo></content-projection-demo>
      <star-rating-demo></star-rating-demo>
      <button-showcase></button-showcase>
      <user-profile></user-profile>
    </div>
  `
})
export class FrontendPlayground {}
