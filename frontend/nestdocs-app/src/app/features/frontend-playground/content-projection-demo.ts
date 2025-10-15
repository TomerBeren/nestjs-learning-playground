import { Component } from '@angular/core';
import { ContentProjectionCard } from '../../shared/components/content-projection-card';
import { StarRating } from '../../shared/components/star-rating';

@Component({
  selector: 'content-projection-demo',
  standalone: true,
  imports: [ContentProjectionCard, StarRating],
  template: `
    <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
      <h3 class="text-xl font-semibold text-white mb-6">📄 Content Projection Demo</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Product Card -->
        <content-projection-card>
          <div card-header class="flex items-center justify-between">
            <h4 class="text-lg font-semibold text-white">Premium Headphones</h4>
            <span class="text-green-400 font-bold">$299</span>
          </div>

          <div card-body>
            <p class="text-white/80 mb-3">High-quality wireless headphones with noise cancellation and premium sound quality.</p>
            <div class="flex items-center gap-2 mb-3">
              <span class="text-white/90">Rating:</span>
              <star-rating [rating]="4"></star-rating>
            </div>
            <div class="flex flex-wrap gap-2">
              <span class="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm">Wireless</span>
              <span class="bg-green-500/20 text-green-300 px-2 py-1 rounded text-sm">Noise Canceling</span>
              <span class="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-sm">Premium</span>
            </div>
          </div>

          <div card-footer class="flex gap-3">
            <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
              Add to Cart
            </button>
            <button class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors">
              View Details
            </button>
          </div>
        </content-projection-card>

        <!-- User Profile Card -->
        <content-projection-card>
          <div card-header class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-lg">JD</span>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-white">John Doe</h4>
              <p class="text-white/70 text-sm">Premium Member</p>
            </div>
          </div>

          <div card-body>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-white/90">Email:</span>
                <span class="text-white">john.doe@example.com</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/90">Joined:</span>
                <span class="text-white">Jan 2024</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/90">Orders:</span>
                <span class="text-white">24</span>
              </div>
            </div>
          </div>

          <div card-footer class="flex gap-3">
            <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
              Edit Profile
            </button>
            <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors">
              Logout
            </button>
          </div>
        </content-projection-card>

        <!-- Blog Post Card -->
        <content-projection-card>
          <div card-header>
            <h4 class="text-lg font-semibold text-white">Angular Content Projection Guide</h4>
            <div class="flex items-center gap-2 mt-2">
              <span class="text-white/70 text-sm">By Sarah Wilson</span>
              <span class="text-white/50">•</span>
              <span class="text-white/70 text-sm">5 min read</span>
            </div>
          </div>

          <div card-body>
            <p class="text-white/80 mb-3">
              Content projection is a powerful feature in Angular that allows you to create reusable components
              that can accept content from their parent components...
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="bg-orange-500/20 text-orange-300 px-2 py-1 rounded text-sm">Angular</span>
              <span class="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-sm">Components</span>
              <span class="bg-pink-500/20 text-pink-300 px-2 py-1 rounded text-sm">Tutorial</span>
            </div>
          </div>

          <div card-footer class="flex justify-between items-center">
            <div class="flex items-center gap-4">
              <button class="text-blue-400 hover:text-blue-300 transition-colors">👍 42</button>
              <button class="text-green-400 hover:text-green-300 transition-colors">💬 8</button>
            </div>
            <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
              Read More
            </button>
          </div>
        </content-projection-card>

        <!-- Notification Card -->
        <content-projection-card>
          <div card-header class="flex items-center gap-3">
            <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm">⚠️</span>
            </div>
            <h4 class="text-lg font-semibold text-white">System Update Available</h4>
          </div>

          <div card-body>
            <p class="text-white/80">
              A new version of the application is available. Update now to get the latest features and security improvements.
            </p>
            <div class="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
              <p class="text-yellow-300 text-sm">
                <strong>What's new:</strong> Improved performance, bug fixes, and new UI components.
              </p>
            </div>
          </div>

          <div card-footer class="flex gap-3">
            <button class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors">
              Update Now
            </button>
            <button class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors">
              Remind Later
            </button>
          </div>
        </content-projection-card>
      </div>
    </div>
  `
})
export class ContentProjectionDemo {}