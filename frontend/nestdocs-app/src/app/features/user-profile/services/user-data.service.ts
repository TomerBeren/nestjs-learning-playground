import { Injectable, signal } from '@angular/core';
import { UserProfile } from '../models';

/**
 * UserDataService - Single Responsibility Principle
 * Manages user profile data state
 */
@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  // Private state
  private readonly _userName = signal<string>('John Doe');
  private readonly _userEmail = signal<string>('john.doe@example.com');

  // Public readonly signals
  readonly userName = this._userName.asReadonly();
  readonly userEmail = this._userEmail.asReadonly();

  /**
   * Update user name with validation
   * @param name New user name
   */
  updateUserName(name: string): void {
    if (name && name.trim().length > 0) {
      this._userName.set(name.trim());
    }
  }

  /**
   * Update user email with validation
   * @param email New user email
   */
  updateUserEmail(email: string): void {
    if (email && this.isValidEmail(email)) {
      this._userEmail.set(email.trim());
    }
  }

  /**
   * Update both user name and email
   * @param name New user name
   * @param email New user email
   */
  updateUserData(name: string, email: string): void {
    this.updateUserName(name);
    this.updateUserEmail(email);
  }

  /**
   * Reset user data to defaults
   */
  resetToDefaults(): void {
    this._userName.set('John Doe');
    this._userEmail.set('john.doe@example.com');
  }

  /**
   * Validate email format
   * @param email Email to validate
   * @returns True if valid email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }
}
