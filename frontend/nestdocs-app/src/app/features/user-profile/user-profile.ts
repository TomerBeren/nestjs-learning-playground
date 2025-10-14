import { Component, inject } from '@angular/core';
import { ProfileHeader } from './profile-header/profile-header';
import { UserBadgeList } from './user-badge-list/user-badge-list';
import { ProfileEditor } from './profile-editor/profile-editor';
import { ProfileInfo } from './profile-info/profile-info';
import { TrialControls } from './trial-controls/trial-controls';
import { BadgeService, TrialService, UserDataService, ProfileActionService } from './services';

/**
 * UserProfile Component - ORCHESTRATOR (Container Pattern)
 * 
 * Responsibilities:
 * - Inject services (Dependency Injection)
 * - Compose child components
 * - Wire up data flow between services and presentation
 * 
 * Does NOT contain:
 * - Business logic (moved to services)
 * - Presentation logic (moved to child components)
 * - State management (moved to services)
 */
@Component({
  selector: 'user-profile',
  imports: [ProfileHeader, UserBadgeList, ProfileEditor, ProfileInfo, TrialControls],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile {
  // Inject services - each handles ONE responsibility
  private badgeService = inject(BadgeService);
  private trialService = inject(TrialService);
  private userDataService = inject(UserDataService);
  private profileActionService = inject(ProfileActionService);

  // Expose service signals to template (delegation pattern)
  // Badge-related
  readonly badges = this.badgeService.badges;
  
  // Trial-related
  readonly isTrial = this.trialService.isTrial;
  readonly isTrialExpired = this.trialService.isTrialExpired;
  readonly showTrialDuration = this.trialService.showTrialDuration;
  
  // User data-related
  readonly userName = this.userDataService.userName;
  readonly userEmail = this.userDataService.userEmail;

  // Delegate badge actions to BadgeService
  addBadge = () => this.badgeService.addBadge();
  removeBadge = (id: string) => this.badgeService.removeBadge(id);
  clearBadges = () => this.badgeService.clearBadges();

  // Delegate trial actions to TrialService
  activateTrial = () => this.trialService.activateTrial();
  expireTrial = () => this.trialService.expireTrial();
  resetTrial = () => this.trialService.resetTrial();

  // Delegate user data actions to UserDataService
  updateUserName = (name: string) => this.userDataService.updateUserName(name);
  updateUserEmail = (email: string) => this.userDataService.updateUserEmail(email);

  // Delegate profile actions to ProfileActionService
  editProfile = () => this.profileActionService.editProfile();
  viewActivity = () => this.profileActionService.viewActivity();
}

