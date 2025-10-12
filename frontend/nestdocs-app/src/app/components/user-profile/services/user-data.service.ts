import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  // State
  private _userName = signal('John Doe');
  private _userEmail = signal('john.doe@example.com');

  // Public readonly signals
  readonly userName = this._userName.asReadonly();
  readonly userEmail = this._userEmail.asReadonly();

  // Business logic for user data
  updateUserName(name: string): void {
    // Could add validation here
    if (name && name.trim().length > 0) {
      this._userName.set(name.trim());
    }
  }

  updateUserEmail(email: string): void {
    // Could add email validation here
    if (email && email.includes('@')) {
      this._userEmail.set(email.trim());
    }
  }

  updateUserData(name: string, email: string): void {
    this.updateUserName(name);
    this.updateUserEmail(email);
  }

  resetToDefaults(): void {
    this._userName.set('John Doe');
    this._userEmail.set('john.doe@example.com');
  }

  // Could add more user-related logic:
  // - Load from API
  // - Save to API
  // - Validate data
  // - Handle errors
  // etc.
}
