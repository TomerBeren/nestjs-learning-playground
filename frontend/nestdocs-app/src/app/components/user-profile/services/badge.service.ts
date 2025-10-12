import { Injectable, signal, computed } from '@angular/core';

export interface Badge {
  id: number;
  name: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  private readonly allBadges: Badge[] = [
    { id: 1, name: '🌟 Early Adopter', color: 'blue' },
    { id: 2, name: '🚀 Pro Developer', color: 'purple' },
    { id: 3, name: '💎 Premium Member', color: 'yellow' },
    { id: 4, name: '🏆 Achievement Hunter', color: 'green' },
    { id: 5, name: '🔥 Streak Master', color: 'red' },
    { id: 6, name: '⭐ Top Contributor', color: 'orange' },
    { id: 7, name: '🎯 Goal Setter', color: 'pink' },
  ];

  // State
  private _badges = signal<Badge[]>([
    this.allBadges[0],
    this.allBadges[1],
    this.allBadges[2],
  ]);

  // Public readonly signal
  readonly badges = this._badges.asReadonly();
  
  // Computed values
  readonly badgeCount = computed(() => this._badges().length);
  readonly canAddMore = computed(() => this._badges().length < 7);

  // Business logic for badges
  addBadge(): void {
    const currentCount = this._badges().length;
    const nextBadge = this.allBadges[currentCount];
    
    if (nextBadge) {
      this._badges.update(current => [...current, nextBadge]);
    }
  }

  removeBadge(badgeId: number): void {
    this._badges.update(current => current.filter(b => b.id !== badgeId));
  }

  clearBadges(): void {
    this._badges.set([]);
  }

  resetToDefault(): void {
    this._badges.set([
      this.allBadges[0],
      this.allBadges[1],
      this.allBadges[2],
    ]);
  }
}
