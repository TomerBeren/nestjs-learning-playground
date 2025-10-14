import { Injectable, signal, computed } from '@angular/core';

/**
 * TrialService - Single Responsibility Principle
 * Manages trial subscription state and logic
 */
@Injectable({
  providedIn: 'root'
})
export class TrialService {
  // Private state
  private readonly _isTrial = signal<boolean>(false);
  private readonly _isTrialExpired = signal<boolean>(false);

  // Public readonly signals
  readonly isTrial = this._isTrial.asReadonly();
  readonly isTrialExpired = this._isTrialExpired.asReadonly();
  
  // Computed values
  readonly showTrialDuration = computed(() => 
    this._isTrial() && !this._isTrialExpired()
  );
  
  readonly trialStatus = computed<'expired' | 'active' | 'inactive'>(() => {
    if (this._isTrialExpired()) return 'expired';
    if (this._isTrial()) return 'active';
    return 'inactive';
  });

  /**
   * Activate trial subscription
   */
  activateTrial(): void {
    this._isTrial.set(true);
    this._isTrialExpired.set(false);
  }

  /**
   * Mark trial as expired
   */
  expireTrial(): void {
    if (this._isTrial()) {
      this._isTrialExpired.set(true);
    }
  }

  /**
   * Reset trial to inactive state
   */
  resetTrial(): void {
    this._isTrial.set(false);
    this._isTrialExpired.set(false);
  }
}

