import { Component, input, output, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'profile-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile-editor.html',
  styleUrl: './profile-editor.scss',
})
export class ProfileEditor {
  // Receive current values from parent
  userName = input.required<string>();
  userEmail = input.required<string>();
  
  // Emit changes to parent
  userNameChanged = output<string>();
  userEmailChanged = output<string>();
  
  // Computed signals for display
  displayName = computed(() => `👤 ${this.userName()}`);
  emailDomain = computed(() => ` ${this.userEmail().split('@')[1] || 'unknown'}`);
  
  // Emit on input change
  onUserNameChange(newName: string) {
    this.userNameChanged.emit(newName);
  }
  
  onUserEmailChange(newEmail: string) {
    this.userEmailChanged.emit(newEmail);
  }
}
