import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TrialService {
  // State
  private _isTrial = signal(false);
  private _isTrialExpired = signal(false);

  // Public readonly signals
  readonly isTrial = this._isTrial.asReadonly();
  readonly isTrialExpired = this._isTrialExpired.asReadonly();
  
  // Computed values
  readonly showTrialDuration = computed(() => 
    this._isTrial() && !this._isTrialExpired()
  );
  
  readonly trialStatus = computed(() => {
    if (this._isTrialExpired()) return 'expired';
    if (this._isTrial()) return 'active';
    return 'inactive';
  });

  // Business logic for trial management
  activateTrial(): void {
    this._isTrial.set(true);
    this._isTrialExpired.set(false);
  }

  expireTrial(): void {
    if (this._isTrial()) {
      this._isTrialExpired.set(true);
    }
  }

  resetTrial(): void {
    this._isTrial.set(false);
    this._isTrialExpired.set(false);
  }

  // Could add more complex logic here:
  // - Validate trial period
  // - Check expiration dates
  // - Call backend API
  // - Store in localStorage
  // etc.
}
