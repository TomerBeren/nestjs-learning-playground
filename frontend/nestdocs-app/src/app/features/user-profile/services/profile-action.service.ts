import { Injectable } from '@angular/core';

/**
 * ProfileActionService - Single Responsibility Principle  
 * Handles user profile actions and navigation
 * Interface Segregation - Focused on profile-related actions only
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileActionService {
  /**
   * Navigate to profile edit view
   * In production: would navigate to edit page or open modal
   */
  editProfile(): void {
    // TODO: Implement navigation or modal
    alert('Edit profile clicked! 🎉\n(No backend connection yet)');
  }

  /**
   * View user activity and analytics
   * In production: would navigate to activity page
   */
  viewActivity(): void {
    // TODO: Implement activity view
    alert('View activity clicked! 📊\n(No backend connection yet)');
  }
}

