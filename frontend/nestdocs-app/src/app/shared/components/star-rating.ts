import { Component, input, output, signal, OnInit } from '@angular/core';

@Component({
  selector: 'star-rating',
  standalone: true,
  template: `
    <div class="inline-flex gap-1">
      @for (star of [1,2,3,4,5]; track star) {
        <span
          (click)="rate(star)"
          [class]="star <= currentRating()
            ? 'text-2xl text-yellow-400 cursor-pointer transition-colors hover:text-yellow-500'
            : 'text-2xl text-gray-300 cursor-pointer transition-colors hover:text-yellow-400'">
          ★
        </span>
      }
    </div>
  `
})
export class StarRating implements OnInit {
  // Input: initial rating
  rating = input(0);

  // Output: when user clicks a star
  ratingChanged = output<number>();

  currentRating = signal(0);

  ngOnInit() {
    this.currentRating.set(this.rating());
  }

  rate(stars: number) {
    this.currentRating.set(stars);
    this.ratingChanged.emit(stars); // Emit to parent
  }
}
