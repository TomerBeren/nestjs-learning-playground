import { Component, input, output, computed } from '@angular/core';
import { Badge } from '../models';

@Component({
  selector: 'user-badge-list',
  standalone: true,
  templateUrl: './user-badge-list.html',
  styleUrl: './user-badge-list.scss',
})
export class UserBadgeList {
  badges = input.required<Badge[]>();
  
  badgeAdded = output<void>();
  badgeRemoved = output<string>();
  badgesCleared = output<void>();
  
  badgeCount = computed(() => this.badges().length);
  
  onAddBadge() {
    this.badgeAdded.emit();
  }
  
  onRemoveBadge(badgeId: string) {
    this.badgeRemoved.emit(badgeId);
  }
  
  onClearAll() {
    this.badgesCleared.emit();
  }
}
