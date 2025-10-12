import { Component, input } from '@angular/core';

@Component({
  selector: 'profile-header',
  standalone: true,
  templateUrl: './profile-header.html',
  styleUrl: './profile-header.scss',
})
export class ProfileHeader {
  isTrial = input.required<boolean>();
  isTrialExpired = input.required<boolean>();
}
