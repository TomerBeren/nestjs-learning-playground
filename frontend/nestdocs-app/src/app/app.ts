import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserProfile } from './components/user-profile/user-profile';
import { ButtonShowcase } from './components/button-showcase';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserProfile, ButtonShowcase],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('nestdocs-app');
}
