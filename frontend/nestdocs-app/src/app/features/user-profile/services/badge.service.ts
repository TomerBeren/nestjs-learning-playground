import { Injectable, signal, computed } from '@angular/core';
import { Badge } from '../models';

/**
 * BadgeService - Single Responsibility Principle
 * Manages user badge collection and operations
 */
@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  private readonly allBadges: ReadonlyArray<Badge> = [
    { id: '1', name: '🌟 Early Adopter', icon: '🌟', color: 'blue' },
    { id: '2', name: '🚀 Pro Developer', icon: '🚀', color: 'purple' },
    { id: '3', name: '💎 Premium Member', icon: '💎', color: 'yellow' },
    { id: '4', name: '🏆 Achievement Hunter', icon: '🏆', color: 'green' },
    { id: '5', name: '🔥 Streak Master', icon: '🔥', color: 'red' },
    { id: '6', name: '⭐ Top Contributor', icon: '⭐', color: 'orange' },
    { id: '7', name: '🎯 Goal Setter', icon: '🎯', color: 'pink' },
  ];

  // Private state
  private readonly _badges = signal<Badge[]>([
    this.allBadges[0],
    this.allBadges[1],
    this.allBadges[2],
  ]);

  // Public readonly signals
  readonly badges = this._badges.asReadonly();
  
  // Computed values
  readonly badgeCount = computed(() => this._badges().length);
  readonly canAddMore = computed(() => this._badges().length < this.allBadges.length);

  /**
   * Add the next available badge
   */
  addBadge(): void {
    const currentCount = this._badges().length;
    const nextBadge = this.allBadges[currentCount];
    
    if (nextBadge && this.canAddMore()) {
      this._badges.update(current => [...current, nextBadge]);
    }
  }

  /**
   * Remove a badge by ID
   * @param badgeId Badge ID to remove
   */
  removeBadge(badgeId: string): void {
    this._badges.update(current => current.filter(b => b.id !== badgeId));
  }

  /**
   * Clear all badges
   */
  clearBadges(): void {
    this._badges.set([]);
  }

  /**
   * Reset badges to default collection
   */
  resetToDefault(): void {
    this._badges.set([
      this.allBadges[0],
      this.allBadges[1],
      this.allBadges[2],
    ]);
  }
}
