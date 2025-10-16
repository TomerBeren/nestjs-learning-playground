import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PrimaryButton, DangerButton, SuccessButton, YouTubeUploadButton } from '../directives';

@Component({
  selector: 'button-showcase',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, // 🎯 Performance optimization
  imports: [PrimaryButton, DangerButton, SuccessButton, YouTubeUploadButton],
  template: `
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8 mb-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-6">🎨 Button Showcase</h2>

      <div class="space-y-6">
        <!-- YouTube Upload Button -->
        <div class="p-6 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">YouTube Upload Button</h3>
          <div class="flex gap-4 flex-wrap">
            <button yt-upload>Upload Video</button>
            <button yt-upload disabled>Uploading...</button>
          </div>
          <code class="block mt-3 text-xs text-gray-600 bg-white p-2 rounded">
            &lt;button yt-upload&gt;Upload Video&lt;/button&gt;
          </code>
        </div>

        <!-- Primary Button -->
        <div class="p-6 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">Primary Button</h3>
          <div class="flex gap-4 flex-wrap">
            <button app-primary>Save Changes</button>
            <button app-primary>Submit Form</button>
            <button app-primary disabled>Disabled</button>
          </div>
          <code class="block mt-3 text-xs text-gray-600 bg-white p-2 rounded">
            &lt;button app-primary&gt;Save Changes&lt;/button&gt;
          </code>
        </div>

        <!-- Danger Button -->
        <div class="p-6 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">Danger Button</h3>
          <div class="flex gap-4 flex-wrap">
            <button app-danger>Delete Account</button>
            <button app-danger>Remove Item</button>
            <button app-danger disabled>Disabled</button>
          </div>
          <code class="block mt-3 text-xs text-gray-600 bg-white p-2 rounded">
            &lt;button app-danger&gt;Delete Account&lt;/button&gt;
          </code>
        </div>

        <!-- Success Button -->
        <div class="p-6 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-700 mb-3">Success Button</h3>
          <div class="flex gap-4 flex-wrap">
            <button app-success>Confirm</button>
            <button app-success>Approve</button>
            <button app-success disabled>Disabled</button>
          </div>
          <code class="block mt-3 text-xs text-gray-600 bg-white p-2 rounded">
            &lt;button app-success&gt;Confirm&lt;/button&gt;
          </code>
        </div>

        <!-- Combined Example -->
        <div
          class="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200"
        >
          <h3 class="text-lg font-semibold text-gray-700 mb-3">🎬 Action Panel Example</h3>
          <div class="flex gap-3 flex-wrap">
            <button yt-upload>Upload to YouTube</button>
            <button app-primary>Edit Video</button>
            <button app-success>Publish</button>
            <button app-danger>Delete Video</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ButtonShowcase {}
