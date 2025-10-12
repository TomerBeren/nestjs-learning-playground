# Angular Signals & Two-Way Binding Guide

## 🎯 Overview
This guide explains how Angular signals work with two-way binding, demonstrated in the `user-profile` component.

---

## 📖 Concepts Explained

### 1. **Signal Basics**
```typescript
userName = signal('John Doe');  // Create a reactive signal
```

**What is a Signal?**
- A **reactive primitive** that holds a value
- When the value changes, Angular automatically updates the UI
- Similar to React's `useState` or Vue's `ref`

**How to use:**
- **Read:** `userName()` - Call it like a function
- **Write:** `userName.set('New Name')` - Use `.set()` to update
- **Update:** `userName.update(old => old.toUpperCase())` - Transform current value

---

### 2. **Two-Way Binding with Signals**
```typescript
// In component:
userName = signal('John Doe');

// In template:
<input [(ngModel)]="userName" />
```

**The `[(ngModel)]` Banana-in-a-Box Syntax:**
- `[ ]` - Property binding (component → view)
- `( )` - Event binding (view → component)
- `[( )]` - **Two-way binding** (both directions!)

**How it works:**
1. Signal value displays in input: `userName()` → Input shows "John Doe"
2. User types: Input changes to "Jane Smith"
3. NgModel emits event: Automatically calls `userName.set('Jane Smith')`
4. Signal updates: New value stored
5. UI refreshes: Anywhere `userName()` is used gets the new value

**Data Flow:**
```
Signal → Input Display  (One-way: Property Binding)
   ↑            ↓
   └─ Update ← User Types  (One-way: Event Binding)
   
Combined = Two-Way Binding [(ngModel)]
```

---

### 3. **Computed Signals**
```typescript
displayName = computed(() => `👤 ${this.userName()}`);
emailDomain = computed(() => this.userEmail().split('@')[1]);
```

**What is a Computed Signal?**
- **Derives** a value from other signals
- **Automatically recalculates** when dependencies change
- **Cached** - only recomputes when needed (efficient!)

**Example Flow:**
```
1. userName = "John"
   → displayName = "👤 John"

2. User types "Jane" in input
   → userName.set("Jane") (via ngModel)
   → displayName automatically becomes "👤 Jane"
   → UI updates everywhere displayName() is used
```

**Why use computed?**
- DRY (Don't Repeat Yourself)
- Performance - only recalculates when dependencies change
- Clean separation of logic

---

## 🔍 Real Example Breakdown

### TypeScript Component:
```typescript
import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Required for ngModel!

@Component({
  selector: 'user-profile',
  imports: [FormsModule],  // Import FormsModule for two-way binding
  templateUrl: './user-profile.html',
})
export class UserProfile {
  // 1. Create signals (reactive state)
  userName = signal('John Doe');
  userEmail = signal('john.doe@example.com');
  
  // 2. Computed signals (derived state)
  displayName = computed(() => `👤 ${this.userName()}`);
  emailDomain = computed(() => this.userEmail().split('@')[1]);
}
```

### HTML Template:
```html
<!-- Two-way binding input -->
<input [(ngModel)]="userName" />

<!-- Display the signal value -->
<p>Name: {{ userName() }}</p>

<!-- Display computed signal -->
<p>Display: {{ displayName() }}</p>
```

---

## 🎮 Interactive Demo Features

### In the Live App:
1. **Type in the Name input** → Watch these update instantly:
   - Name field in profile info
   - Display Name (with 👤 emoji)
   
2. **Type in the Email input** → Watch these update:
   - Email field in profile info  
   - Email Domain (everything after @)

3. **All updates are automatic** - No manual event handlers needed!

---

## 📊 Comparison: Old vs New

### Old Angular (NgRx/RxJS):
```typescript
// Component
userName$ = new BehaviorSubject('John');

// Template
<input [value]="userName$ | async" 
       (input)="userName$.next($event.target.value)" />
```
❌ Complex, lots of boilerplate  
❌ Need to unsubscribe  
❌ Async pipe everywhere

### New Angular (Signals):
```typescript
// Component
userName = signal('John');

// Template
<input [(ngModel)]="userName" />
```
✅ Simple, minimal code  
✅ No subscriptions needed  
✅ Automatic cleanup  
✅ Better performance

---

## 🚀 Key Takeaways

1. **Signals are reactive** - Change the signal, UI updates automatically
2. **Two-way binding** - `[(ngModel)]` syncs input ↔ signal
3. **Computed signals** - Derived values that auto-update
4. **No subscriptions** - Angular handles everything
5. **Type-safe** - Full TypeScript support

---

## 🔗 Additional Resources

- [Angular Signals Docs](https://angular.dev/guide/signals)
- [Forms & Two-Way Binding](https://angular.dev/guide/forms)
- [Computed Signals](https://angular.dev/guide/signals#computed-signals)

---

## 💡 Try It Yourself!

**Exercise:** Add a new signal for user age:
```typescript
userAge = signal(25);
ageGroup = computed(() => 
  this.userAge() < 18 ? 'Minor' : 'Adult'
);
```

Then add in template:
```html
<input type="number" [(ngModel)]="userAge" />
<p>Age Group: {{ ageGroup() }}</p>
```

Watch the age group automatically update as you change the number! 🎉
