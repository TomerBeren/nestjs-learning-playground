import { Component } from '@angular/core';
import {
  ProductCard,
  UserProfileCard,
  BlogPostCard,
  NotificationCard,
  StarRating
} from '../../shared/components';

@Component({
  selector: 'content-projection-demo',
  standalone: true,
  imports: [ProductCard, UserProfileCard, BlogPostCard, NotificationCard, StarRating],
  template: `
    <div class="bg-white/10 backdrop-blur-sm rounded-lg p-6">
      <h3 class="text-xl font-semibold text-white mb-6">📄 SOLID Content Projection Demo</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Product Card - SOLID Implementation -->
        <product-card [product]="productData">
          <star-rating product-rating [rating]="4"></star-rating>
          <div product-actions class="flex gap-3">
            <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
              Add to Cart
            </button>
            <button class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors">
              View Details
            </button>
          </div>
        </product-card>

        <!-- User Profile Card - SOLID Implementation -->
        <user-profile-card [user]="userData">
          <div profile-actions class="flex gap-3">
            <button class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
              Edit Profile
            </button>
            <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors">
              Logout
            </button>
          </div>
        </user-profile-card>

        <!-- Blog Post Card - SOLID Implementation -->
        <blog-post-card [post]="postData">
          <button post-actions class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
            Read More
          </button>
        </blog-post-card>

        <!-- Notification Card - SOLID Implementation -->
        <notification-card [notification]="notificationData">
          <div notification-actions class="flex gap-3">
            <button class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors">
              Update Now
            </button>
            <button class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors">
              Remind Later
            </button>
          </div>
        </notification-card>
      </div>

      <!-- SOLID Principles Explanation -->
      <div class="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h4 class="text-lg font-semibold text-blue-300 mb-3">🎯 SOLID Principles Applied:</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/80">
          <div>
            <strong class="text-blue-300">Single Responsibility:</strong> Each card component has one job
          </div>
          <div>
            <strong class="text-blue-300">Open/Closed:</strong> Extended functionality without modifying base
          </div>
          <div>
            <strong class="text-blue-300">Liskov Substitution:</strong> All cards work with BaseCard interface
          </div>
          <div>
            <strong class="text-blue-300">Interface Segregation:</strong> Specific interfaces for each card type
          </div>
          <div>
            <strong class="text-blue-300">Dependency Inversion:</strong> Depends on abstractions, not concretions
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContentProjectionDemo {
  productData = {
    name: 'Premium Headphones',
    price: '$299',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    tags: ['Wireless', 'Noise Canceling', 'Premium']
  };

  userData = {
    name: 'John Doe',
    initials: 'JD',
    role: 'Premium Member',
    stats: [
      { label: 'Email', value: 'john.doe@example.com' },
      { label: 'Joined', value: 'Jan 2024' },
      { label: 'Orders', value: '24' }
    ]
  };

  postData = {
    title: 'Angular Content Projection Guide',
    author: 'Sarah Wilson',
    readTime: '5 min read',
    excerpt: 'Content projection is a powerful feature in Angular that allows you to create reusable components...',
    tags: ['Angular', 'Components', 'Tutorial'],
    likes: 42,
    comments: 8
  };

  notificationData = {
    title: 'System Update Available',
    message: 'A new version of the application is available. Update now to get the latest features and security improvements.',
    icon: '⚠️',
    details: {
      title: 'What\'s new',
      description: 'Improved performance, bug fixes, and new UI components.'
    }
  };
}