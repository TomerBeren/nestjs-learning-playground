import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-black/20 backdrop-blur-lg border-b border-white/10">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center gap-3">
            <span class="text-2xl">🚀</span>
            <span class="text-xl font-bold text-white">NestDocs</span>
          </div>

          <!-- Navigation Links -->
          <div class="flex gap-2">
            <a routerLink="/frontend" routerLinkActive="active" class="nav-link">
              <span class="icon">🎨</span>
              <span>Frontend Playground</span>
            </a>

            <a routerLink="/backend" routerLinkActive="active" class="nav-link">
              <span class="icon">⚙️</span>
              <span>Backend API</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      .nav-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1.25rem;
        border-radius: 0.5rem;
        color: rgba(255, 255, 255, 0.8);
        font-weight: 500;
        transition: all 0.2s ease;
        border: 2px solid transparent;
      }

      .nav-link:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        transform: translateY(-1px);
      }

      .nav-link.active {
        background: rgba(255, 255, 255, 0.15);
        color: white;
        border-color: rgba(255, 255, 255, 0.3);
      }

      .icon {
        font-size: 1.125rem;
      }
    `,
  ],
})
export class Navbar {}
