import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserProfile } from './components/user-profile/user-profile';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserProfile],
  template: `
    <div class="min-h-screen flex flex-col bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800">
      <header class="text-center py-8 bg-black/10 backdrop-blur-lg">
        <h1 class="text-4xl font-bold text-white mb-2">🚀 NestDocs App</h1>
        <p class="text-lg text-white/90">Angular 20 + Tailwind CSS</p>
      </header>

      <main class="flex-1 py-8 px-4">
        <user-profile></user-profile>
      </main>

      <footer class="text-center py-6 bg-black/20 backdrop-blur-lg">
        <p class="text-white/80">&copy; 2025 NestDocs - Full Stack TypeScript Application</p>
      </footer>
    </div>

    <router-outlet />
  `,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('nestdocs-app');
}
