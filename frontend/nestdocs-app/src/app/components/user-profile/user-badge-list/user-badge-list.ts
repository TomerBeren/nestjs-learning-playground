import { Component, input, output, computed } from '@angular/core';

export interface Badge {
  id: number;
  name: string;
  color: string;
}

@Component({
  selector: 'user-badge-list',
  standalone: true,
  templateUrl: './user-badge-list.html',
  styleUrl: './user-badge-list.scss',
})
export class UserBadgeList {
  badges = input.required<Badge[]>();
  
  badgeAdded = output<void>();
  badgeRemoved = output<number>();
  badgesCleared = output<void>();
  
  badgeCount = computed(() => this.badges().length);
  
  onAddBadge() {
    this.badgeAdded.emit();
  }
  
  onRemoveBadge(badgeId: number) {
    this.badgeRemoved.emit(badgeId);
  }
  
  onClearAll() {
    this.badgesCleared.emit();
  }
}
