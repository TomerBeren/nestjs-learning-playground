import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'user-profile',
  imports: [],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile {
  isTrial = signal(false);
  isTrialExpired = signal(false);
  showTrialDuration = computed(() => this.isTrial() && !this.isTrialExpired());

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
