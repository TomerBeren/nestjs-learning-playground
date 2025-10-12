import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'user-profile',
  imports: [FormsModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile {
  // Signal binding example - reactive username
  userName = signal('John Doe');
  userEmail = signal('john.doe@example.com');

  // Trial management signals
  isTrial = signal(false);
  isTrialExpired = signal(false);
  showTrialDuration = computed(() => this.isTrial() && !this.isTrialExpired());

  // Computed signal example - derives from userName
  displayName = computed(() => `👤 ${this.userName()}`);
  emailDomain = computed(() => ` ${this.userEmail().split('@')[1] || 'unknown'}`);

  // User badges - dynamic list with @for demo
  badges = signal([
    { id: 1, name: '🌟 Early Adopter', color: 'blue' },
    { id: 2, name: '🚀 Pro Developer', color: 'purple' },
    { id: 3, name: '💎 Premium Member', color: 'yellow' },
  ]);

  // Computed: count of badges
  badgeCount = computed(() => this.badges().length);

  addBadge() {
    const newBadges = [
      { id: 4, name: '🏆 Achievement Hunter', color: 'green' },
      { id: 5, name: '🔥 Streak Master', color: 'red' },
      { id: 6, name: '⭐ Top Contributor', color: 'orange' },
      { id: 7, name: '🎯 Goal Setter', color: 'pink' },
    ];
    
    const currentBadges = this.badges();
    const nextBadge = newBadges[currentBadges.length - 3];
    
    if (nextBadge) {
      this.badges.set([...currentBadges, nextBadge]);
    }
  }

  removeBadge(badgeId: number) {
    this.badges.update(current => current.filter(b => b.id !== badgeId));
  }

  activateTrial() {
    this.isTrial.set(true);
  }

  resetTrial() {
    this.isTrial.set(false);
    this.isTrialExpired.set(false);
  }

  editProfile() {
    alert('Edit profile clicked! 🎉\n(No backend connection yet)');
  }

  viewActivity() {
    alert('View activity clicked! 📊\n(No backend connection yet)');
  }
}
