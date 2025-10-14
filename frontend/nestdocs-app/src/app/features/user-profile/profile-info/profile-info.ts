import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'profile-info',
  standalone: true,
  templateUrl: './profile-info.html',
  styleUrl: './profile-info.scss',
})
export class ProfileInfo {
  userName = input.required<string>();
  userEmail = input.required<string>();
  isTrial = input.required<boolean>();
  isTrialExpired = input.required<boolean>();
  
  showTrialDuration = computed(() => this.isTrial() && !this.isTrialExpired());
}
