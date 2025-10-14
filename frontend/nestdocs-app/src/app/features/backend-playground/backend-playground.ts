import { Component, signal, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { CreateUserDto, LoginDto } from '../../core/models';

/**
 * BackendPlayground Component
 * Demonstrates API integration with the NestJS backend
 * Follows Single Responsibility Principle - only handles UI and delegates to ApiService
 */

/**
 * BackendPlayground Component
 * Demonstrates API integration with the NestJS backend
 * Follows Single Responsibility Principle - only handles UI and delegates to ApiService
 */
@Component({
  selector: 'backend-playground',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-white mb-2">⚙️ Backend API Playground</h2>
        <p class="text-white/80">Test NestJS API Endpoints</p>
      </div>
      
      <div class="bg-white rounded-xl shadow-2xl p-8 space-y-6">
        <!-- API Status -->
        <div class="p-6 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">🔌 API Status</h3>
          <div class="space-y-2">
            <p class="text-sm text-gray-600">Status: 
              @if (connected()) {
                <span class="text-green-600 font-semibold">✅ Connected</span>
              } @else {
                <span class="text-red-600 font-semibold">❌ Disconnected</span>
              }
            </p>
          </div>
        </div>

        <!-- Quick Test Endpoints -->
        <div class="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">🧪 Quick API Tests</h3>
          
          <div class="space-y-3">
            <button 
              (click)="testHealthCheck()"
              class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Test Health Check (GET /api/v1)
            </button>
            
            <button 
              (click)="createUser()"
              class="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              👤 Create User (POST /api/v1/users)
            </button>
            
            <button 
              (click)="testAuthEndpoint()"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              🔐 Test Login (POST /api/v1/auth/login)
            </button>
            
            <button 
              (click)="testCatsEndpoint()"
              class="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Test Cats API (GET /api/v1/cats)
            </button>
          </div>
        </div>

        <!-- Response Display -->
        @if (response()) {
          <div class="p-6 bg-gray-50 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">📦 Response</h3>
            <pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">{{ response() | json }}</pre>
          </div>
        }

        @if (error()) {
          <div class="p-6 bg-red-50 rounded-lg border-2 border-red-200">
            <h3 class="text-lg font-semibold text-red-700 mb-3">❌ Error</h3>
            <pre class="bg-red-900 text-red-200 p-4 rounded-lg overflow-x-auto text-sm">{{ error() }}</pre>
          </div>
        }

        <!-- Instructions -->
        <div class="p-6 bg-yellow-50 rounded-lg border-2 border-yellow-200">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">📝 Setup Instructions</h3>
          <ol class="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Make sure your NestJS backend is running on <code class="bg-gray-200 px-2 py-1 rounded">http://localhost:3000</code></li>
            <li>Enable CORS in your NestJS backend (main.ts)</li>
            <li>Click any button above to test the connection</li>
          </ol>
          
          <div class="mt-4 p-3 bg-white rounded border border-yellow-300">
            <p class="text-xs font-semibold text-gray-700 mb-2">Add to backend/src/main.ts:</p>
            <code class="text-xs text-gray-600">
              app.enableCors({{ '{' }}<br>
              &nbsp;&nbsp;origin: 'http://localhost:4200',<br>
              &nbsp;&nbsp;credentials: true<br>
              {{ '}' }});
            </code>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BackendPlayground {
  private readonly apiService = inject(ApiService);
  
  // State management with signals
  readonly connected = signal<boolean>(false);
  readonly response = signal<any>(null);
  readonly error = signal<string | null>(null);

  /**
   * Test API health check endpoint
   */
  async testHealthCheck(): Promise<void> {
    this.clearMessages();
    try {
      const data = await firstValueFrom(this.apiService.healthCheck());
      this.response.set(data);
      this.connected.set(true);
    } catch (err) {
      this.handleError(err, 'Failed to connect to backend');
    }
  }

  /**
   * Create a test user
   */
  async createUser(): Promise<void> {
    this.clearMessages();
    try {
      const newUser: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'john',
        password: 'changeme',
        isActive: true
      };
      const data = await firstValueFrom(this.apiService.createUser(newUser));
      this.response.set(data);
      this.connected.set(true);
    } catch (err) {
      this.handleError(err, 'Failed to create user');
    }
  }

  /**
   * Test authentication endpoint
   */
  async testAuthEndpoint(): Promise<void> {
    this.clearMessages();
    try {
      const credentials: LoginDto = {
        username: 'john',
        password: 'changeme'
      };
      const data = await firstValueFrom(this.apiService.login(credentials));
      this.response.set(data);
      this.connected.set(true);
    } catch (err) {
      this.handleError(err, 'Failed to authenticate');
    }
  }

  /**
   * Test cats endpoint
   */
  async testCatsEndpoint(): Promise<void> {
    this.clearMessages();
    try {
      const data = await firstValueFrom(this.apiService.getAllCats());
      this.response.set(data);
      this.connected.set(true);
    } catch (err) {
      this.handleError(err, 'Failed to fetch cats');
    }
  }

  /**
   * Clear response and error messages
   */
  private clearMessages(): void {
    this.response.set(null);
    this.error.set(null);
  }

  /**
   * Handle API errors consistently
   * @param err Error object
   * @param defaultMessage Default error message
   */
  private handleError(err: any, defaultMessage: string): void {
    this.error.set(err?.message || defaultMessage);
    this.connected.set(false);
  }
}
