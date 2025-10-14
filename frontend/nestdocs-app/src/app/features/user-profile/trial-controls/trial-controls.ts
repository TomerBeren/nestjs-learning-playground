import { Component, input, output } from '@angular/core';

@Component({
  selector: 'trial-controls',
  standalone: true,
  templateUrl: './trial-controls.html',
  styleUrl: './trial-controls.scss',
})
export class TrialControls {
  isTrial = input.required<boolean>();
  isTrialExpired = input.required<boolean>();
  showTrialDuration = input.required<boolean>();
  
  trialActivated = output<void>();
  trialExpired = output<void>();
  trialReset = output<void>();
  profileEdited = output<void>();
  activityViewed = output<void>();
  
  onActivateTrial() {
    this.trialActivated.emit();
  }
  
  onExpireTrial() {
    this.trialExpired.emit();
  }
  
  onResetTrial() {
    this.trialReset.emit();
  }
  
  onEditProfile() {
    this.profileEdited.emit();
  }
  
  onViewActivity() {
    this.activityViewed.emit();
  }
}
