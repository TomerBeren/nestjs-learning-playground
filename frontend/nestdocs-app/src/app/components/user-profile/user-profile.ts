import { Component } from '@angular/core';

@Component({
  selector: 'user-profile',
  imports: [],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss'
})
export class UserProfile {
  editProfile() {
    alert('Edit profile clicked! 🎉\n(No backend connection yet)');
  }

  viewActivity() {
    alert('View activity clicked! 📊\n(No backend connection yet)');
  }
}
