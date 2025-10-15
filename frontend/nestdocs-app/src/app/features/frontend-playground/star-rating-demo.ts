import { Component, signal } from '@angular/core';
import { StarRating } from '../../shared/components/star-rating';

@Component({
  selector: 'star-rating-demo',
  standalone: true,
  imports: [StarRating],
  template: `
    <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
      <h3 class="text-xl font-semibold text-white mb-4">⭐ Star Rating Component</h3>

      <div class="space-y-4">
        <div>
          <h4 class="text-white/90 mb-2">Product Rating:</h4>
          <star-rating
            [rating]="productRating()"
            (ratingChanged)="updateRating($event)" />
          <p class="text-white/70 mt-2">Current rating: {{ productRating() }} stars</p>
        </div>

        <div>
          <h4 class="text-white/90 mb-2">Movie Rating:</h4>
          <star-rating
            [rating]="movieRating()"
            (ratingChanged)="updateMovieRating($event)" />
          <p class="text-white/70 mt-2">Current rating: {{ movieRating() }} stars</p>
        </div>

        <div>
          <h4 class="text-white/90 mb-2">Service Rating:</h4>
          <star-rating
            [rating]="serviceRating()"
            (ratingChanged)="updateServiceRating($event)" />
          <p class="text-white/70 mt-2">Current rating: {{ serviceRating() }} stars</p>
        </div>
      </div>
    </div>
  `
})
export class StarRatingDemo {
  productRating = signal(3);
  movieRating = signal(4);
  serviceRating = signal(0);

  updateRating(newRating: number) {
    this.productRating.set(newRating);
    console.log('Product rating updated:', newRating);
    // Here you would typically save to backend
  }

  updateMovieRating(newRating: number) {
    this.movieRating.set(newRating);
    console.log('Movie rating updated:', newRating);
  }

  updateServiceRating(newRating: number) {
    this.serviceRating.set(newRating);
    console.log('Service rating updated:', newRating);
  }
}