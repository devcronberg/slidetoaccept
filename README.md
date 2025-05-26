# Slide to Accept Web Component

A modern, interactive slide-to-accept component built as a Web Component. Perfect for confirmation actions, agreements, and user consent interactions.

## 🎯 Live Demos

- **[Complete Demo](demo.html)** - Interactive showcase of all features and attributes
- **[Simple Demo](demo-simple.html)** - Basic examples without styling

## What are Web Components?

Web Components are a set of web platform APIs that allow you to create custom, reusable HTML elements. They work across all modern browsers and frameworks without dependencies. Key benefits include:

- **Framework Agnostic**: Works with vanilla JavaScript, React, Vue, Angular, or any other framework
- **Encapsulated**: CSS and JavaScript are scoped to the component (no conflicts)
- **Reusable**: Use the same component across different projects
- **Standards-Based**: Built on native browser APIs
- **Future-Proof**: Part of the web standards, supported by all modern browsers

## Features

- ✅ Touch and mouse support
- ✅ Fully customizable appearance
- ✅ Smooth animations and transitions
- ✅ Success feedback with custom messages
- ✅ Event-driven architecture
- ✅ Programmatic control (complete/reset)
- ✅ Responsive design
- ✅ No dependencies

## Quick Start

### Step 1: Include the Component

You have two options to include the component:

#### Option A: Reference directly from CDN (recommended)

```html
<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
</head>
<body>
    <!-- Include the web component from GitHub Pages -->
    <script src="https://devcronberg.github.io/slidetoaccept/slidetoaccept.js"></script>
    
    <!-- Use the component -->
    <slide-to-accept text="Slide to confirm"></slide-to-accept>
</body>
</html>
```

#### Option B: Download and host locally

1. Download the `slidetoaccept.js` file from the repository
2. Include it in your project:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
</head>
<body>
    <!-- Include the web component locally -->
    <script src="slidetoaccept.js"></script>
    
    <!-- Use the component -->
    <slide-to-accept text="Slide to confirm"></slide-to-accept>
</body>
</html>
```

### Step 2: Basic Usage

Once included, you can use the component anywhere in your HTML:

```html
<slide-to-accept 
    text="Slide to accept terms" 
    width="400" 
    height="70">
</slide-to-accept>
```

### Step 3: Listen for Events

```html
<script>
    const slider = document.querySelector('slide-to-accept');
    
    slider.addEventListener('accepted', (event) => {
        console.log('User accepted!', event.detail.timestamp);
        // Handle acceptance logic here
    });
    
    slider.addEventListener('reset', (event) => {
        console.log('Slider was reset', event.detail.timestamp);
    });
</script>
```

## Configuration Options

### Attributes

| Attribute      | Description                       | Default Value     |
| -------------- | --------------------------------- | ----------------- |
| `text`         | Text displayed in the slider      | "Slide to Accept" |
| `success-text` | Message shown after completion    | "✅ Accepteret!"   |
| `width`        | Width in pixels                   | "300"             |
| `height`       | Height in pixels                  | "60"              |
| `track-color`  | Color of the progress track       | "#4CAF50"         |
| `handle-color` | Color of the draggable handle     | "white"           |
| `threshold`    | Completion threshold (0.0 to 1.0) | "0.8"             |

### Example with Custom Styling

```html
<slide-to-accept 
    text="Swipe right to order"
    success-text="🎉 Order confirmed!"
    width="350"
    height="80"
    track-color="#FF6B35"
    handle-color="#FFFFFF"
    threshold="0.9">
</slide-to-accept>
```

## JavaScript API

### Methods

```javascript
const slider = document.querySelector('slide-to-accept');

// Check if completed
if (slider.isCompleted()) {
    console.log('Already completed');
}

// Complete programmatically
slider.programmaticComplete();

// Reset programmatically
slider.programmaticReset();
```

### Events

```javascript
const slider = document.querySelector('slide-to-accept');

// Fired when user completes the slide
slider.addEventListener('accepted', (event) => {
    console.log('Accepted at:', event.detail.timestamp);
    // Your acceptance logic here
});

// Fired when slider is reset
slider.addEventListener('reset', (event) => {
    console.log('Reset at:', event.detail.timestamp);
    // Your reset logic here
});
```

## Real-World Examples

### 1. Terms and Conditions Acceptance

```html
<div class="terms-section">
    <h3>Terms and Conditions</h3>
    <p>Please read and accept our terms...</p>
    
    <slide-to-accept 
        text="Slide to accept terms"
        success-text="✅ Terms accepted!"
        width="100%"
        track-color="#007bff">
    </slide-to-accept>
</div>

<script>
    document.querySelector('slide-to-accept').addEventListener('accepted', () => {
        // Enable the submit button
        document.querySelector('#submit-btn').disabled = false;
    });
</script>
```

### 2. Order Confirmation

```html
<slide-to-accept 
    text="Slide to place order ($99.99)"
    success-text="🛒 Order placed successfully!"
    width="300"
    height="70"
    track-color="#28a745">
</slide-to-accept>

<script>
    document.querySelector('slide-to-accept').addEventListener('accepted', async () => {
        try {
            // Call your API to place the order
            const response = await fetch('/api/orders', {
                method: 'POST',
                body: JSON.stringify({ items: cartItems })
            });
            
            if (response.ok) {
                window.location.href = '/order-success';
            }
        } catch (error) {
            console.error('Order failed:', error);
            // Reset the slider on error
            document.querySelector('slide-to-accept').programmaticReset();
        }
    });
</script>
```

### 3. Delete Confirmation

```html
<slide-to-accept 
    text="Slide to delete permanently"
    success-text="⚠️ Item deleted"
    width="280"
    height="60"
    track-color="#dc3545"
    threshold="0.95">
</slide-to-accept>

<script>
    document.querySelector('slide-to-accept').addEventListener('accepted', () => {
        // Perform delete operation
        deleteItem(itemId);
    });
</script>
```

## Framework Integration

### React

```jsx
import { useEffect, useRef } from 'react';

function MyComponent() {
    const sliderRef = useRef();
    
    useEffect(() => {
        const slider = sliderRef.current;
        
        const handleAccepted = (event) => {
            console.log('Accepted!', event.detail);
        };
        
        slider.addEventListener('accepted', handleAccepted);
        
        return () => {
            slider.removeEventListener('accepted', handleAccepted);
        };
    }, []);
    
    return (
        <slide-to-accept 
            ref={sliderRef}
            text="Slide to confirm"
            width="300">
        </slide-to-accept>
    );
}
```

### Vue.js

```vue
<template>
    <slide-to-accept 
        ref="slider"
        text="Slide to confirm"
        width="300"
        @accepted="handleAccepted">
    </slide-to-accept>
</template>

<script>
export default {
    mounted() {
        this.$refs.slider.addEventListener('accepted', this.handleAccepted);
    },
    methods: {
        handleAccepted(event) {
            console.log('Accepted!', event.detail);
        }
    }
}
</script>
```

## Browser Support

This component works in all modern browsers that support:
- Custom Elements v1
- Shadow DOM v1
- ES6 Classes

**Supported browsers:**
- Chrome 54+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## Styling Tips

The component uses Shadow DOM, so global CSS won't affect its internal styling. Use the provided attributes for customization, or modify the component's CSS directly if needed.

For responsive design:

```html
<slide-to-accept 
    text="Slide to confirm"
    width="100%"
    style="max-width: 400px;">
</slide-to-accept>
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Test across browsers
5. Submit a pull request

## License

See LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on the repository.