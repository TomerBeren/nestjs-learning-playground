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
  emailDomain = computed(() => this.userEmail().split('@')[1] || 'unknown');

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
